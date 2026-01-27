package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ms_refresh_tokens")
public class RefreshToken extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_revoked")
    private Boolean isRevoked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public RefreshToken() {
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getIsRevoked() {
        return isRevoked;
    }

    public void setIsRevoked(Boolean isRevoked) {
        this.isRevoked = isRevoked;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Méthodes utilitaires
    public boolean isValid() {
        return !Boolean.TRUE.equals(this.isRevoked) && this.expiresAt.isAfter(Instant.now());
    }

    public void revoke() {
        this.isRevoked = true;
    }
}
