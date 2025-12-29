package com.medicalsplants.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// Configuration properties for JWT authentication. 
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {

    // Secret key for signing JWT tokens.
    Must be at least

    256 bits(
    32 characters) for HS256.
    private String secret;

    // Access token expiration time in milliseconds.
    // Default: 15 minutes (900000 ms)
    private long expiration = 900000;

    // Refresh token expiration time in milliseconds.
    // Default: 7 days (604800000 ms)
    private long refreshExpiration = 604800000;

    // Token prefix in Authorization header.
    private String tokenPrefix = "Bearer ";

    // Header name for JWT token. 
    private String headerName = "Authorization";
}
