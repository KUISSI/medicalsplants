package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.LoginRequest;
import com.medicalsplants.model.dto.request.RefreshTokenRequest;
import com.medicalsplants.model.dto.request.RegisterRequest;
import com.medicalsplants.model.dto.response.AuthResponse;
import com.medicalsplants.model.dto.response.MessageResponse;
import com.medicalsplants.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user. 
     */
    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account. A verification email will be sent."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Email or pseudo already exists"
        )
    })
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Registration request for email: {}", request.getEmail());
        MessageResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login and get tokens.
     */
    @Operation(
        summary = "Login",
        description = "Authenticates user and returns access and refresh tokens."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid credentials"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Account blocked or disabled"
        )
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token.
     */
    @Operation(
        summary = "Refresh token",
        description = "Exchanges a refresh token for new access and refresh tokens."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid or expired refresh token"
        )
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
        @Valid @RequestBody RefreshTokenRequest request
    ) {
        log.info("Refresh token request");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout (invalidate tokens).
     */
    @Operation(
        summary = "Logout",
        description = "Invalidates the user's refresh token."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Logout successful"
        )
    })
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
        @RequestHeader("Authorization") String authorizationHeader
    ) {
        log.info("Logout request");
        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
        MessageResponse response = authService.logout(token);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify email.
     */
    @Operation(
        summary = "Verify email",
        description = "Verifies user email using verification token."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Email verified successfully"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid or expired verification token"
        )
    })
    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(
        @RequestParam("token") String token
    ) {
        log.info("Email verification request");
        MessageResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    /**
     * Request password reset.
     */
    @Operation(
        summary = "Request password reset",
        description = "Sends password reset email to user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Password reset email sent"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found"
        )
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
        @RequestParam("email") String email
    ) {
        log.info("Forgot password request for email: {}", email);
        MessageResponse response = authService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password.
     */
    @Operation(
        summary = "Reset password",
        description = "Resets user password using reset token."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Password reset successful"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid or expired reset token"
        )
    })
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
        @RequestParam("token") String token,
        @Valid @RequestBody LoginRequest request // Reusing LoginRequest for new password
    ) {
        log.info("Reset password request");
        MessageResponse response = authService.resetPassword(token, request.getPassword());
        return ResponseEntity.ok(response);
    }
}
