package com.medicalsplants.model.dto.response;

import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "User information response")
public class UserResponse {
    
    @Schema(description = "User ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private String id;
    
    @Schema(description = "First name", example = "John")
    private String firstName;
    
    @Schema(description = "Last name", example = "Doe")
    private String lastName;
    
    @Schema(description = "Pseudo (username)", example = "johndoe")
    private String pseudo;
    
    @Schema(description = "Email address", example = "user@example.com")
    private String email;
    
    @Schema(description = "Phone number", example = "+33123456789")
    private String phone;
    
    @Schema(description = "User role")
    private Role role;
    
    @Schema(description = "User status")
    private UserStatus status;
    
    @Schema(description = "Email verified status", example = "true")
    private Boolean emailVerified;
    
    @Schema(description = "Profile bio", example = "Plant enthusiast")
    private String bio;
    
    @Schema(description = "Profile image URL")
    private String profileImageUrl;
    
    @Schema(description = "Online status", example = "false")
    private Boolean isOnline;
    
    @Schema(description = "Premium expiration date")
    private LocalDateTime premiumExpiresAt;
    
    @Schema(description = "Account creation date")
    private LocalDateTime createdAt;
}
