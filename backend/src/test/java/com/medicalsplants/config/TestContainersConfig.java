package com.medicalsplants.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Configuration Testcontainers pour les tests d'intégration. Utilise PostgreSQL
 * réel au lieu de H2 pour une parité complète avec la production.
 */
@TestConfiguration(proxyBeanMethods = false)
public class TestContainersConfig {

    /**
     * Container PostgreSQL partagé entre tous les tests. L'annotation
     *
     * @ServiceConnection configure automatiquement les propriétés DataSource.
     */
    @Bean
    @ServiceConnection
    public PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"))
                .withDatabaseName("medicalsplants_test")
                .withUsername("test")
                .withPassword("test")
                .withReuse(true); // Réutilise le container entre les tests pour plus de rapidité
    }
}
