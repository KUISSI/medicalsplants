

package com.medicalsplants.controller;

import java.util.UUID;

import com.medicalsplants.model.dto.request.LoginRequest;
import com.medicalsplants.model.dto.request.RefreshTokenRequest;
import com.medicalsplants.model.dto.request.RegisterRequest;
import com.medicalsplants.model.dto.response.AuthResponse;
import com.medicalsplants.model.dto.response.MessageResponse;
import com.medicalsplants.model.dto.response.UserResponse;
import com.medicalsplants.model.mapper.UserMapper;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")

public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthController(AuthService authService, UserRepository userRepository, UserMapper userMapper) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        MessageResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Login")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        String refreshToken = request != null ? request.getRefreshToken() : null;
        MessageResponse response = authService.logout(refreshToken);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Logout from all devices")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout-all")
    public ResponseEntity<MessageResponse> logoutAll(@AuthenticationPrincipal CustomUserDetails currentUser) {
        MessageResponse response = authService.logoutAll(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get current user")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    @SuppressWarnings("null")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null || currentUser.getId() == null) {
            // Pas authentifié ou id absent : retourne 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UUID userId = currentUser.getId();
        return userRepository.findById(userId)
            .map(user -> ResponseEntity.ok(userMapper.toDto(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Verify email")
    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        MessageResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Forgot password")
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestParam String email) {
        // Validation stricte du format email
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid email format"));
        }
        MessageResponse response = authService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Reset password")
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestParam String token,
            @RequestParam String newPassword) {
        MessageResponse response = authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(response);
    }
}
