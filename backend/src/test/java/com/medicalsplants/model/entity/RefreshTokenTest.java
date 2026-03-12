package com.medicalsplants.model.entity;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("RefreshToken - Tests Unitaires")
class RefreshTokenTest {

    private RefreshToken activeToken;

    @BeforeEach
    void setUp() {
        activeToken = new RefreshToken("abc", Instant.now().plusSeconds(3600), null);
    }

    @Test
    @DisplayName("isValid - vrai : token actif et non révoqué")
    void isValid_shouldReturnTrue_whenNotExpiredAndNotRevoked() {
        assertThat(activeToken.isValid()).isTrue();
    }

    @Test
    @DisplayName("isValid - faux : token expiré")
    void isValid_shouldReturnFalse_whenExpired() {
        RefreshToken expired = new RefreshToken("abc", Instant.now().minusSeconds(1), null);

        assertThat(expired.isValid()).isFalse();
    }

    @Test
    @DisplayName("isValid - faux : token révoqué")
    void isValid_shouldReturnFalse_whenRevoked() {
        activeToken.revoke();

        assertThat(activeToken.isValid()).isFalse();
    }

    @Test
    @DisplayName("revoke - marque le token comme révoqué")
    void revoke_shouldSetIsRevokedTrue() {
        assertThat(activeToken.getIsRevoked()).isFalse();
        activeToken.revoke();
        assertThat(activeToken.getIsRevoked()).isTrue();
    }
}
