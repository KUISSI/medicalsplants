package com.medicalsplants.model. entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Entity representing a JWT refresh token.
 * Used for token rotation and session management.
 */
@Entity
@Table(name = "ms_refresh_token", indexes = {
    @Index(name = "idx_refresh_token_token", columnList = "token", unique = true),
    @Index(name = "idx_refresh_token_user", columnList = "user_id"),
    @Index(name = "idx_refresh_token_expires", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "token", nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_revoked", nullable = false)
    @Builder.Default
    private Boolean isRevoked = false;

    // ========================================
    // RELATIONSHIPS
    // ========================================

    @ManyToOne(fetch = FetchType. LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Checks if the token is expired.
     */
    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    /**
     * Checks if the token is valid (not revoked and not expired).
     */
    public boolean isValid() {
        return !isRevoked && !isExpired();
    }

    /**
     * Revokes this token.
     */
    public void revoke() {
        this.isRevoked = true;
    }
}
