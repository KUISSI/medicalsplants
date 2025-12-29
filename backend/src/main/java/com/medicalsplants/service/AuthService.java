package com.medicalsplants.service;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.UnauthorizedException;
import com.medicalsplants.model.dto.request.LoginRequest;
import com.medicalsplants.model.dto.request.RefreshTokenRequest;
import com.medicalsplants.model.dto.request.RegisterRequest;
import com.medicalsplants.model.dto.response.AuthResponse;
import com.medicalsplants.model.dto.response.MessageResponse;
import com.medicalsplants.model.entity.RefreshToken;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import com.medicalsplants.model.mapper.UserMapper;
import com.medicalsplants.repository.RefreshTokenRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.security.JwtTokenProvider;
import com.medicalsplants.util.UlidGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

// Service for authentication operations.
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final UlidGenerator ulidGenerator;

    // Registers a new user. 
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        // Check if pseudo already exists
        if (userRepository.existsByPseudo(request.getPseudo())) {
            throw new ConflictException("This pseudo is already taken");
        }

        // Create user
        User user = User.builder()
                .id(ulidGenerator.generate())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .pseudo(request.getPseudo().trim())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .isActive(true)
                .isEmailVerified(false)
                .emailVerificationToken(UUID.randomUUID().toString())
                .build();

        userRepository.save(user);

        log.info("User registered successfully:  {}", user.getId());

        // TODO: Send verification email
        return MessageResponse.of("Registration successful.  Please verify your email.");
    }

    // Authenticates a user and returns tokens.
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        try {
            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Check if account is blocked
            if (!userDetails.isAccountNonLocked()) {
                throw new ForbiddenException("Your account has been blocked");
            }

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

            // Save refresh token
            saveRefreshToken(userDetails.getId(), refreshToken);

            // Update last login
            userRepository.updateLastLoginAt(userDetails.getId(), Instant.now());

            log.info("User logged in successfully: {}", userDetails.getId());

            // Get user for response
            User user = userRepository.findById(userDetails.getId()).orElseThrow();

            return AuthResponse.builder()
                    .success(true)
                    .data(AuthResponse.AuthData.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .tokenType("Bearer")
                            .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                            .user(userMapper.toResponse(user))
                            .build())
                    .timestamp(Instant.now().toString())
                    .build();

        } catch (BadCredentialsException e) {
            log.warn("Invalid credentials for email: {}", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        } catch (DisabledException e) {
            log.warn("Disabled account login attempt:  {}", request.getEmail());
            throw new ForbiddenException("Your account has been disabled");
        }
    }

    //  Refreshes the access token.
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        log.debug("Refresh token request");

        // Find refresh token
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        // Check if valid
        if (!refreshToken.isValid()) {
            throw new UnauthorizedException("Refresh token is expired or revoked");
        }

        // Get user
        User user = refreshToken.getUser();
        CustomUserDetails userDetails = CustomUserDetails.fromUser(user);

        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        // Revoke old refresh token
        refreshToken.revoke();
        refreshTokenRepository.save(refreshToken);

        // Save new refresh token
        saveRefreshToken(user.getId(), newRefreshToken);

        log.info("Token refreshed for user: {}", user.getId());

        return AuthResponse.builder()
                .success(true)
                .data(AuthResponse.AuthData.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .tokenType("Bearer")
                        .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                        .user(userMapper.toResponse(user))
                        .build())
                .timestamp(Instant.now().toString())
                .build();
    }

    // Logs out the user by revoking the refresh token.
    @Transactional
    public MessageResponse logout(String refreshToken) {
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(token -> {
                        token.revoke();
                        refreshTokenRepository.save(token);
                        log.info("User logged out, token revoked");
                    });
        }
        return MessageResponse.of("Logged out successfully");
    }

    // Logs out from all devices by revoking all refresh tokens.
    @Transactional
    public MessageResponse logoutAll(String userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("All tokens revoked for user:  {}", userId);
        return MessageResponse.of("Logged out from all devices");
    }

    // Saves a refresh token for a user.
    private void saveRefreshToken(String userId, String token) {
        User user = userRepository.getReferenceById(userId);

        RefreshToken refreshToken = RefreshToken.builder()
                .id(ulidGenerator.generate())
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plusMillis(
                        jwtTokenProvider.getRefreshExpirationInSeconds() * 1000
                ))
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
    }
}
