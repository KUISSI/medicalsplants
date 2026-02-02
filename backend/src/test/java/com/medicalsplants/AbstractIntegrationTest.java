package com.medicalsplants;

import com.medicalsplants.config.TestContainersConfig;
import com.medicalsplants.config.TestMailConfig;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Classe de base pour tous les tests d'intégration. Configure automatiquement
 * Testcontainers avec PostgreSQL.
 *
 * Usage:
 * <pre>
 * class MyServiceTest extends AbstractIntegrationTest {
 *     @Autowired
 *     private MyService myService;
 *
 *     @Test
 *     void testSomething() { ... }
 * }
 * </pre>
 */
@SpringBootTest(classes = MedicalsPlantsApplication.class)
@ActiveProfiles("test")
@Import({TestContainersConfig.class, TestMailConfig.class})
@Testcontainers
public abstract class AbstractIntegrationTest {
    // Classe de base pour les tests d'intégration
    // Les configurations sont héritées automatiquement
}
 
 * 
 *
