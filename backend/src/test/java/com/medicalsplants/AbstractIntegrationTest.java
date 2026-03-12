package com.medicalsplants;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.medicalsplants.config.TestContainersConfig;
import com.medicalsplants.config.TestMailConfig;

// Classe de base pour tous les tests d'intégration.
// Configure automatiquementTestcontainers avec PostgreSQL.
// Les configurations sont héritées automatiquement
@SpringBootTest(classes = MedicalsPlantsApplication.class)
@ActiveProfiles("test")
@Import({TestContainersConfig.class, TestMailConfig.class})
@Testcontainers
public abstract class AbstractIntegrationTest {
}
