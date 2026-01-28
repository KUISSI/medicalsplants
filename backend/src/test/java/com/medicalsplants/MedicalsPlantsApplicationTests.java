package com.medicalsplants;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.medicalsplants.config.TestMailConfig;

@SpringBootTest(classes = com.medicalsplants.MedicalsPlantsApplication.class)
@ActiveProfiles("test")
@Import(TestMailConfig.class)
class MedicalsPlantsApplicationTests {

    @Test
    void contextLoads() {
        // Test que le contexte Spring se charge correctement
    }
}
