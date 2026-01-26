package com.medicalsplants.config;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppProperties {

    @Builder.Default
    private String name = "Medicals Plants";
    @Builder.Default
    private String url = "http://localhost:8080";
    @Builder.Default
    private Cors cors = new Cors();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Cors {

        @Builder.Default
        private List<String> allowedOrigins = new ArrayList<>();
        @Builder.Default
        private long maxAge = 3600;
    }

}
