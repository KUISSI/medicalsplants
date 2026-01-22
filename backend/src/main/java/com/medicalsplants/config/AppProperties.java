package com.medicalsplants.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name = "Medicals Plants";
    private String url = "http://localhost:8080";
    private Cors cors = new Cors();

    @Data
    public static class Cors {

        private List<String> allowedOrigins = new ArrayList<>();
        private long maxAge = 3600;
    }
}
