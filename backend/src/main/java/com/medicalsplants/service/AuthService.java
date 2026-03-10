package com.medicalsplants.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

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

    // Classe utilitaire pour retourner la réponse et le refresh token
    public static class AuthResult {

        private final AuthResponse response;
        private final String refreshToken;

        public AuthResult(AuthResponse response, String refreshToken) {
            this.response = response;
            this.refreshToken = refreshToken;
        }

        public AuthResponse getResponse() {
            return response;
        }

        public String getRefreshToken() {
            return refreshToken;
        }
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("An account with this email already exists");
        }

        if (userRepository.existsByPseudoAndDeletedAtIsNull(request.getPseudo().trim())) {
            throw new ConflictException("This pseudo is already taken");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPseudo(request.getPseudo().trim());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(UserStatus.PENDING);
        user.setIsEmailVerified(false);

        String emailVerificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(emailVerificationToken);

        user = userRepository.saveAndFlush(user);
        mailService.sendEmailVerification(user.getEmail(), emailVerificationToken);

        return MessageResponse.of("Registration successful. Please check your email to verify your account.");
    }

    @Transactional
    public MessageResponse resendEmailVerification(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email.trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Utilisateur non trouvé."));
        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new BadRequestException("Email déjà vérifié.");
        }
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        userRepository.save(user);
        mailService.sendEmailVerification(user.getEmail(), token);
        return MessageResponse.of("Email de vérification renvoyé.");
    }

    @Transactional
    public AuthResult login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Récupère l'utilisateur complet
            User user = userRepository.findById(
                    java.util.Objects.requireNonNull(userDetails.getId(), "User id cannot be null")
            ).orElseThrow();

            // 1. Si le compte est PENDING, renvoyer l'email de vérification et bloquer la connexion
            if (user.getStatus() == UserStatus.PENDING) {
                String token = UUID.randomUUID().toString();
                user.setEmailVerificationToken(token);
                userRepository.save(user);
                mailService.sendEmailVerification(user.getEmail(), token);
                throw new ForbiddenException("Votre compte n'est pas encore activé. Un nouvel email de vérification vient de vous être envoyé.");
            }

            // 2. Si le compte est bloqué
            if (!userDetails.isAccountNonLocked()) {
                throw new ForbiddenException("Your account has been blocked. Please contact support.");
            }

            // 3. Connexion normale
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

            saveRefreshToken(userDetails.getId(), refreshToken);

            userRepository.updateLastLoginAt(userDetails.getId(), Instant.now());

            AuthResponse response = new AuthResponse(
                    true,
                    new AuthResponse.AuthData(
                            accessToken,
                            "Bearer",
                            jwtTokenProvider.getExpirationInSeconds(),
                            userMapper.toDto(user)
                    ),
                    "Login successful",
                    Instant.now().toString()
            );

            return new AuthResult(response, refreshToken);

        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid email or password");
        } catch (DisabledException e) {
            User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail().toLowerCase().trim())
                    .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
            if (user.getStatus() == UserStatus.PENDING) {
                String token = UUID.randomUUID().toString();
                user.setEmailVerificationToken(token);
                userRepository.save(user);
                try {
                    mailService.sendEmailVerification(user.getEmail(), token);
                } catch (Exception ex) {
                    log.error("Erreur envoi email: {}", ex.getMessage());
                }
            }
            throw new ForbiddenException("Votre compte n'est pas encore activé. Un nouvel email de vérification vient de vous être envoyé.");
        }
    }

    @Transactional
    public AuthResult refreshToken(RefreshTokenRequest request) {
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

        AuthResponse.AuthData data = new AuthResponse.AuthData(
                newAccessToken,
                "Bearer",
                jwtTokenProvider.getExpirationInSeconds(),
                userMapper.toDto(user)
        );

        AuthResponse response = new AuthResponse(
                true,
                data,
                "Token refreshed successfully",
                Instant.now().toString()
        );

        return new AuthResult(response, newRefreshToken);
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
        log.info(">>> verifyEmail called with token: '{}'", token);
        log.info(">>> token length: {}", token != null ? token.length() : "NULL");

        User user = userRepository.findByEmailVerificationTokenAndDeletedAtIsNull(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token"));

        if (user.getIsEmailVerified()) {
            return MessageResponse.of("Email is already verified");
        }

        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setStatus(UserStatus.ACTIVE);  // <-- AJOUTEZ CETTE LIGNE
        userRepository.save(user);

        return MessageResponse.of("Email verified successfully.  You can now login.");
    }

    @Transactional
    public MessageResponse forgotPassword(String email) {
        userRepository.findByEmailAndDeletedAtIsNull(email.toLowerCase().trim())
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
        User user = userRepository.findByPasswordResetTokenAndDeletedAtIsNull(token)
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
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId, "userId cannot be null")).orElseThrow();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshToken);
    }

    public MessageResponse logoutAll(String userId) {
        return logoutAll(UUID.fromString(userId));
    }

}
