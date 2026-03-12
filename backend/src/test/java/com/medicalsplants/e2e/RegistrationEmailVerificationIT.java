package com.medicalsplants.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.medicalsplants.AbstractIntegrationTest;
import com.medicalsplants.repository.UserRepository;

public class RegistrationEmailVerificationIT extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    private final TestRestTemplate restTemplate = new TestRestTemplate();

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void registration_and_email_verification_flow() throws Exception {
        // 1. Inscription via l'API HTTP
        String email = "test" + System.currentTimeMillis() + "@test.com";
        String json = "{\"email\": \"" + email + "\","
                + "\"password\": \"Test1234!\","
                + "\"confirmPassword\": \"Test1234!\","
                + "\"pseudo\": \"testuser\","
                + "\"firstname\": \"Test\","
                + "\"lastname\": \"User\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> regResp = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/v1/auth/register",
                new HttpEntity<>(json, headers), String.class);

        assertThat(regResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 2. Récupération du token depuis la base de données
        String token = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow().getEmailVerificationToken();
        assertThat(token).isNotNull();

        // 3. Vérification du compte via l'API HTTP
        ResponseEntity<String> verifyResp = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/v1/auth/verify-email?token=" + token,
                String.class);

        assertThat(verifyResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(verifyResp.getBody()).contains("Email verified successfully");
    }
}
