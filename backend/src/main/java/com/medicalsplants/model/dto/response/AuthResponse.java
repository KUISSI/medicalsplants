package com.medicalsplants.model.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Authentication response")
public class AuthResponse {
    
    @Schema(description = "Access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    @JsonProperty("access_token")
    private String accessToken;
    
    @Schema(description = "Refresh token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    @JsonProperty("refresh_token")
    private String refreshToken;
    
    @Schema(description = "Token type", example = "Bearer")
    @JsonProperty("token_type")
    private String tokenType;
    
    @Schema(description = "Token expiration in seconds", example = "3600")
    @JsonProperty("expires_in")
    private Long expiresIn;
    
    @Schema(description = "User information")
    private UserResponse user;
}
