package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ms_user")
public class User extends BaseEntity {

    @Column(name = "email_verification_token", length = 50)
    private String emailVerificationToken;

    @Column(name = "password_reset_token", length = 50)
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private Instant passwordResetExpiresAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    // Relations
    // Relations (optionnelles, à activer si besoin)
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // private final List<RefreshToken> refreshTokens = new ArrayList<>();
    // @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    // private final List<Review> reviews = new ArrayList<>();
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private final List<Interaction> interactions = new ArrayList<>();
    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }

    public String getEmailVerificationToken() {
        return this.emailVerificationToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public String getPasswordResetToken() {
        return this.passwordResetToken;
    }

    public void setPasswordResetExpiresAt(Instant passwordResetExpiresAt) {
        this.passwordResetExpiresAt = passwordResetExpiresAt;
    }

    public Instant getPasswordResetExpiresAt() {
        return this.passwordResetExpiresAt;
    }

    public void setLastLoginAt(Instant lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public Instant getLastLoginAt() {
        return this.lastLoginAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String firstname;

    @Column(nullable = false, length = 50)
    private String lastname;

    @Column(nullable = false, length = 50)
    private String pseudo;

    @Column(length = 15)
    private String phone;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 64)
    private String passwordHash;

    @Column(length = 500)
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_email_verified")
    private Boolean isEmailVerified;

    public User() {
    }

    public User(UUID id, String firstname, String lastname, String pseudo, String phone, String email, String passwordHash, String avatar, Role role, UserStatus status, Boolean isActive, Boolean isEmailVerified) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.pseudo = pseudo;
        this.phone = phone;
        this.email = email;
        this.passwordHash = passwordHash;
        this.avatar = avatar;
        this.role = role;
        this.status = status;
        this.isActive = isActive;
        this.isEmailVerified = isEmailVerified;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    // Méthodes utilitaires
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean isPremium() {
        return this.role == Role.PREMIUM || this.role == Role.ADMIN;
    }

    public boolean isBlocked() {
        return this.status == UserStatus.BLOCKED;
    }

    public boolean isDeleted() {
        return this.status == UserStatus.DELETED;
    }
}
