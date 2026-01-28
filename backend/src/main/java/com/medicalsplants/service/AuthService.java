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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            MailService mailService,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.mailService = mailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("An account with this email already exists");
        }

        if (userRepository.existsByPseudo(request.getPseudo().trim())) {
            throw new ConflictException("This pseudo is already taken");
        }

        User user = new User(
                java.util.UUID.randomUUID(),
                request.getFirstname(),
                request.getLastname(),
                request.getPseudo().trim(),
                null, // phone non fourni par RegisterRequest
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                null, // avatar
                Role.USER,
                UserStatus.ACTIVE,
                true,
                false
        );
        String emailVerificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(emailVerificationToken);

        userRepository.save(user);
        mailService.sendEmailVerification(user.getEmail(), emailVerificationToken);
        return MessageResponse.of("Registration successful.  Please check your email to verify your account.");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            if (!userDetails.isAccountNonLocked()) {
                throw new ForbiddenException("Your account has been blocked.  Please contact support.");
            }

            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

            saveRefreshToken(userDetails.getId(), refreshToken);

            userRepository.updateLastLoginAt(userDetails.getId(), Instant.now());

            User user = userRepository.findById(java.util.Objects.requireNonNull(userDetails.getId(), "User id cannot be null")).orElseThrow();

            return new AuthResponse(
                    true,
                    new AuthResponse.AuthData(
                            accessToken,
                            refreshToken,
                            "Bearer",
                            jwtTokenProvider.getExpirationInSeconds(),
                            userMapper.toDto(user)
                    ),
                    "Login successful",
                    Instant.now().toString()
            );

        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        } catch (DisabledException e) {
            throw new ForbiddenException("Your account has been disabled");
        }
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (!refreshToken.isValid()) {
            throw new UnauthorizedException("Refresh token is expired or revoked");
        }

        User user = refreshToken.getUser();

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenException("Your account is no longer active");
        }

        CustomUserDetails userDetails = CustomUserDetails.fromUser(user);

        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        refreshToken.revoke();
        refreshTokenRepository.save(refreshToken);

        saveRefreshToken(user.getId(), newRefreshToken);

        AuthResponse.AuthData data = new AuthResponse.AuthData();
        data.setAccessToken(newAccessToken);
        data.setRefreshToken(newRefreshToken);
        data.setTokenType("Bearer");
        data.setExpiresIn(jwtTokenProvider.getExpirationInSeconds());
        data.setUser(userMapper.toDto(user));

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setData(data);
        response.setTimestamp(Instant.now().toString());
        return response;
    }

    @Transactional
    public MessageResponse logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(token -> {
                        token.revoke();
                        refreshTokenRepository.save(token);
                    });
        }
        return MessageResponse.of("Logged out successfully");
    }

    @Transactional
    public MessageResponse logoutAll(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        return MessageResponse.of("Logged out from all devices successfully");
    }

    @Transactional
    public MessageResponse verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token"));

        if (user.getIsEmailVerified()) {
            return MessageResponse.of("Email is already verified");
        }

        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);

        return MessageResponse.of("Email verified successfully.  You can now login.");
    }

    @Transactional
    public MessageResponse forgotPassword(String email) {
        userRepository.findByEmail(email.toLowerCase().trim())
                .ifPresent(user -> {
                    String resetToken = UUID.randomUUID().toString();
                    user.setPasswordResetToken(resetToken);
                    user.setPasswordResetExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
                    userRepository.save(user);
                });

        return MessageResponse.of("If an account exists with this email, you will receive a password reset link.");
    }

    @Transactional
    public MessageResponse resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getPasswordResetExpiresAt() == null
                || user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token has expired.  Please request a new one.");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUserId(user.getId());

        return MessageResponse.of("Password reset successfully. Please login with your new password.");
    }

    private void saveRefreshToken(UUID userId, String token) {
        // Enregistre le refresh token pour l'utilisateur
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId, "userId cannot be null")).orElseThrow();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS)); // exemple durée
        // L'id sera généré automatiquement par Hibernate
        refreshTokenRepository.save(refreshToken);
    }

    // Pour compatibilité API (si besoin d'accepter un String)
    public MessageResponse logoutAll(String userId) {
        return logoutAll(UUID.fromString(userId));
    }
}
