package com.medicalsplants.config;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data
@NoArgsConstructor
public class JwtProperties {

    private String secret;
    private long expiration = 900000;
    private long refreshExpiration = 604800000;
    private String tokenPrefix = "Bearer ";
    private String headerName = "Authorization";
}
