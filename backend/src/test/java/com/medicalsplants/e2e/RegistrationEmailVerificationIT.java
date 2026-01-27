package com.medicalsplants.e2e;

import java.util.Objects;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.regex.Matcher;

import java.util.regex.Pattern;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = com.medicalsplants.MedicalsPlantsApplication.class)
@ActiveProfiles("test")
public class RegistrationEmailVerificationIT {

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void registration_and_email_verification_flow() throws Exception {
        // 1. Register a new user
        String registerUrl = "http://localhost:" + port + "/api/v1/auth/register";
        String email = "test" + System.currentTimeMillis() + "@mailhog.local";
        String json = "{"
                + "\"email\": \"" + email + "\","
                + "\"password\": \"Test1234!\","
                + "\"confirmPassword\": \"Test1234!\","
                + "\"pseudo\": \"testuser\","
                + "\"firstname\": \"Test\","
                + "\"lastname\": \"User\"}";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(json, headers);
        ResponseEntity<String> regResp = restTemplate.postForEntity(registerUrl, entity, String.class);
        assertThat(regResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 2. Get the latest email from MailHog
        String mailhogApi = "http://localhost:8025/api/v2/messages";
        ResponseEntity<String> mailhogResp = restTemplate.getForEntity(mailhogApi, String.class);
        assertThat(mailhogResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        String body = mailhogResp.getBody();
        assertThat(body).contains(email);

        // 3. Extract the verification link
        Pattern p = Pattern.compile(
                "http://localhost:[0-9]+/api/v1/auth/verify-email\\?token=([a-zA-Z0-9\\-]+)");
        Matcher m = p.matcher(body);
        assertThat(m.find()).isTrue();
        String verifyUrl = Objects.requireNonNull(m.group(0), "Verification URL not found in email body");
        assertThat(verifyUrl).isNotNull();
        assertThat(verifyUrl).isNotNull();

        // 4. Call the verification endpoint
        ResponseEntity<String> verifyResp = restTemplate.getForEntity(verifyUrl, String.class);
        assertThat(verifyResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        String verifyBody = verifyResp.getBody();
        assertThat(verifyBody).isNotNull();
        assertThat(verifyBody).contains("Email verified successfully");
    }

}
