package com.medicalsplants.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

// Application configuration properties.
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    // Application name.
    private String name = "Medicals Plants";

    // Application URL (for emails and links).
    private String url = "http://localhost:8080";

    // CORS configuration.
    */
    private Cors cors = new Cors();

    @Getter
    @Setter
    public static class Cors {

        // Allowed origins for CORS. 
        private List<String> allowedOrigins = new ArrayList<>();

        // Max age for CORS preflight cache. 
        private long maxAge = 3600;
    }
}
