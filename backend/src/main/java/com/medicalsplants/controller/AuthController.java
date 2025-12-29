package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.LoginRequest;
import com. medicalsplants. model.dto.request.RefreshTokenRequest;
import com. medicalsplants. model.dto.request.RegisterRequest;
import com.medicalsplants.model. dto.response.AuthResponse;
import com.medicalsplants.model.dto. response.MessageResponse;
import com.medicalsplants.model.dto.response. UserResponse;
import com. medicalsplants. model.mapper.UserMapper;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security. CustomUserDetails;
import com.medicalsplants.service. AuthService;
import io.swagger.v3.oas. annotations.Operation;
import io.swagger. v3.oas.annotations.media. Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger. v3.oas.annotations.responses. ApiResponses;
import io.swagger. v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok. RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework. security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

// REST controller for authentication endpoints.
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "��� Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // Register a new user. 
    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account.  A verification email will be sent."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse. class))
        ),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "409", description = "Email or pseudo already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Registration request for email: {}", request. getEmail());
        MessageResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Login and get tokens.
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
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "403", description = "Account blocked or disabled")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Refresh access token.
    @Operation(
        summary = "Refresh token",
        description = "Exchanges a refresh token for new access and refresh tokens."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = AuthResponse. class))
        ),
        @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
        @Valid @RequestBody RefreshTokenRequest request
    ) {
        log.debug("Token refresh request");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity. ok(response);
    }

    // Logout current session.
    @Operation(
        summary = "Logout",
        description = "Revokes the refresh token and logs out the user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Logged out successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        )
    })
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
        @RequestBody(required = false) RefreshTokenRequest request
    ) {
        log.info("Logout request");
        String refreshToken = request != null ? request.getRefreshToken() : null;
        MessageResponse response = authService.logout(refreshToken);
        return ResponseEntity.ok(response);
    }

    // Logout from all devices.
    @Operation(
        summary = "Logout from all devices",
        description = "Revokes all refresh tokens for the current user."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Logged out from all devices",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        ),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @PostMapping("/logout-all")
    public ResponseEntity<MessageResponse> logoutAll(
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        log.info("Logout all devices for user: {}", currentUser.getId());
        MessageResponse response = authService. logoutAll(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    // Get current user information. 
    @Operation(
        summary = "Get current user",
        description = "Returns information about the currently authenticated user."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User information retrieved",
            content = @Content(schema = @Schema(implementation = UserResponse.class))
        ),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        log.debug("Get current user:  {}", currentUser. getId());
        
        return userRepository.findById(currentUser.getId())
            .map(user -> ResponseEntity.ok(userMapper.toResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    // Verify email address.
    @Operation(
        summary = "Verify email",
        description = "Verifies user email using the token sent by email."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Email verified successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        ),
        @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(
        @RequestParam String token
    ) {
        log.info("Email verification request with token");
        MessageResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    // Request password reset.
    @Operation(
        summary = "Forgot password",
        description = "Sends a password reset email to the user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Password reset email sent",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        )
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
        @RequestParam String email
    ) {
        log. info("Password reset request for email: {}", email);
        MessageResponse response = authService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }

    // Reset password with token.
    @Operation(
        summary = "Reset password",
        description = "Resets the password using the token sent by email."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Password reset successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))
        ),
        @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
        @RequestParam String token,
        @RequestParam String newPassword
    ) {
        log.info("Password reset with token");
        MessageResponse response = authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(response);
    }
}