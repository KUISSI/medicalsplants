# ============================================================
# Script PowerShell - Création des fichiers Java
# Medicals Plants Backend
# ============================================================

$ErrorActionPreference = "Stop"
$baseDir = "src\main\java\com\medicalsplants"

# Fonction pour créer un fichier avec encodage UTF-8 sans BOM
function Create-JavaFile {
    param (
        [string]$Path,
        [string]$Content
    )
    
    $fullPath = Join-Path $PSScriptRoot $Path
    $directory = Split-Path $fullPath -Parent
    
    if (!(Test-Path $directory)) {
        New-Item -ItemType Directory -Force -Path $directory | Out-Null
    }
    
    # Écrire en UTF-8 sans BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($fullPath, $Content, $utf8NoBom)
    
    Write-Host "✓ Créé: $Path" -ForegroundColor Green
}

Write-Host "🌿 Création des fichiers Java pour Medicals Plants..." -ForegroundColor Cyan
Write-Host ""

# ============================================================
# APPLICATION PRINCIPALE
# ============================================================

Create-JavaFile "$baseDir\MedicalsPlantsApplication.java" @'
package com.medicalsplants;

import org.springframework.boot.SpringApplication;
import org. springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework. data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MedicalsPlantsApplication {
    public static void main(String[] args) {
        SpringApplication. run(MedicalsPlantsApplication. class, args);
    }
}
'@

# ============================================================
# ENUMS
# ============================================================

Create-JavaFile "$baseDir\model\enums\Role.java" @'
package com.medicalsplants.model. enums;

public enum Role {
    USER,
    PREMIUM,
    ADMIN
}
'@

Create-JavaFile "$baseDir\model\enums\UserStatus.java" @'
package com. medicalsplants. model.enums;

public enum UserStatus {
    ACTIVE,
    BLOCKED,
    DELETED
}
'@

Create-JavaFile "$baseDir\model\enums\AdministrationMode.java" @'
package com.medicalsplants.model.enums;

public enum AdministrationMode {
    ORAL_ROUTE,
    NASAL_ROUTE,
    EPIDERMAL_ROUTE
}
'@

Create-JavaFile "$baseDir\model\enums\ReceiptType.java" @'
package com.medicalsplants.model.enums;

public enum ReceiptType {
    HOT_DRINK,
    COLD_DRINK,
    DISH,
    LOTION
}
'@

Create-JavaFile "$baseDir\model\enums\ReceiptStatus.java" @'
package com.medicalsplants.model.enums;

public enum ReceiptStatus {
    DRAFT,
    PENDING,
    PUBLISHED,
    REJECTED
}
'@

Create-JavaFile "$baseDir\model\enums\InteractionType.java" @'
package com.medicalsplants.model.enums;

public enum InteractionType {
    EMOJI,
    GIFT
}
'@

# ============================================================
# UTIL
# ============================================================

Create-JavaFile "$baseDir\util\UlidGenerator.java" @'
package com. medicalsplants. util;

import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.stereotype. Component;

@Component
public class UlidGenerator {
    public String generate() {
        return UlidCreator.getMonotonicUlid().toString();
    }
}
'@

# ============================================================
# ENTITIES
# ============================================================

Create-JavaFile "$baseDir\model\entity\BaseEntity.java" @'
package com. medicalsplants. model.entity;

import jakarta.persistence. Column;
import jakarta. persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data. annotation.CreatedDate;
import org. springframework.data.annotation.LastModifiedDate;
import org. springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time. Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
'@

Create-JavaFile "$baseDir\model\entity\User.java" @'
package com. medicalsplants. model.entity;

import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util. ArrayList;
import java.util.List;

@Entity
@Table(name = "ms_user")
public class User extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "pseudo", nullable = false, unique = true, length = 50)
    private String pseudo;

    @Column(name = "firstname", length = 100)
    private String firstname;

    @Column(name = "lastname", length = 100)
    private String lastname;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "avatar")
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role = Role.USER;

    @Enumerated(EnumType. STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @Column(name = "email_verification_token")
    private String emailVerificationToken;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private Instant passwordResetExpiresAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    public User() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPseudo() { return pseudo; }
    public void setPseudo(String pseudo) { this.pseudo = pseudo; }
    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(Boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
    public String getEmailVerificationToken() { return emailVerificationToken; }
    public void setEmailVerificationToken(String token) { this.emailVerificationToken = token; }
    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String token) { this.passwordResetToken = token; }
    public Instant getPasswordResetExpiresAt() { return passwordResetExpiresAt; }
    public void setPasswordResetExpiresAt(Instant time) { this.passwordResetExpiresAt = time; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant time) { this.lastLoginAt = time; }
    public List<RefreshToken> getRefreshTokens() { return refreshTokens; }

    public String getFullName() {
        if (firstname != null && lastname != null) return firstname + " " + lastname;
        return pseudo;
    }
    public boolean isAdmin() { return role == Role. ADMIN; }
    public boolean isPremium() { return role == Role.PREMIUM || role == Role. ADMIN; }
    public boolean isBlocked() { return status == UserStatus. BLOCKED; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private final User user = new User();
        public UserBuilder id(String id) { user.id = id; return this; }
        public UserBuilder email(String email) { user.email = email; return this; }
        public UserBuilder passwordHash(String hash) { user.passwordHash = hash; return this; }
        public UserBuilder pseudo(String pseudo) { user.pseudo = pseudo; return this; }
        public UserBuilder firstname(String firstname) { user.firstname = firstname; return this; }
        public UserBuilder lastname(String lastname) { user.lastname = lastname; return this; }
        public UserBuilder role(Role role) { user.role = role; return this; }
        public UserBuilder status(UserStatus status) { user.status = status; return this; }
        public UserBuilder isActive(Boolean active) { user.isActive = active; return this; }
        public UserBuilder isEmailVerified(Boolean verified) { user.isEmailVerified = verified; return this; }
        public UserBuilder emailVerificationToken(String token) { user.emailVerificationToken = token; return this; }
        public User build() { return user; }
    }
}
'@

Create-JavaFile "$baseDir\model\entity\RefreshToken.java" @'
package com. medicalsplants. model.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ms_refresh_token")
public class RefreshToken extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "token", nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_revoked", nullable = false)
    private Boolean isRevoked = false;

    @ManyToOne(fetch = FetchType. LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public RefreshToken() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Boolean getIsRevoked() { return isRevoked; }
    public void setIsRevoked(Boolean revoked) { this.isRevoked = revoked; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public boolean isExpired() { return Instant.now().isAfter(expiresAt); }
    public boolean isValid() { return !isRevoked && !isExpired(); }
    public void revoke() { this.isRevoked = true; }

    public static RefreshTokenBuilder builder() { return new RefreshTokenBuilder(); }

    public static class RefreshTokenBuilder {
        private final RefreshToken rt = new RefreshToken();
        public RefreshTokenBuilder id(String id) { rt.id = id; return this; }
        public RefreshTokenBuilder token(String token) { rt.token = token; return this; }
        public RefreshTokenBuilder expiresAt(Instant time) { rt.expiresAt = time; return this; }
        public RefreshTokenBuilder isRevoked(Boolean revoked) { rt.isRevoked = revoked; return this; }
        public RefreshTokenBuilder user(User user) { rt.user = user; return this; }
        public RefreshToken build() { return rt; }
    }
}
'@

Create-JavaFile "$baseDir\model\entity\Symptom.java" @'
package com. medicalsplants. model.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ms_symptom")
public class Symptom extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 100)
    private String title;

    @Column(name = "symptom_family", nullable = false, length = 100)
    private String symptomFamily;

    @Column(name = "symptom_detail", columnDefinition = "TEXT")
    private String symptomDetail;

    @ManyToMany(mappedBy = "symptoms")
    private Set<Property> properties = new HashSet<>();

    public Symptom() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSymptomFamily() { return symptomFamily; }
    public void setSymptomFamily(String family) { this.symptomFamily = family; }
    public String getSymptomDetail() { return symptomDetail; }
    public void setSymptomDetail(String detail) { this.symptomDetail = detail; }
    public Set<Property> getProperties() { return properties; }
    public void setProperties(Set<Property> properties) { this.properties = properties; }
}
'@

Create-JavaFile "$baseDir\model\entity\Property.java" @'
package com. medicalsplants. model.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util. Set;

@Entity
@Table(name = "ms_property")
public class Property extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 100)
    private String title;

    @Column(name = "property_family", nullable = false, length = 100)
    private String propertyFamily;

    @Column(name = "property_detail", columnDefinition = "TEXT")
    private String propertyDetail;

    @ManyToMany
    @JoinTable(name = "ms_property_symptom",
        joinColumns = @JoinColumn(name = "property_id"),
        inverseJoinColumns = @JoinColumn(name = "symptom_id"))
    private Set<Symptom> symptoms = new HashSet<>();

    @ManyToMany(mappedBy = "properties")
    private Set<Plant> plants = new HashSet<>();

    public Property() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPropertyFamily() { return propertyFamily; }
    public void setPropertyFamily(String family) { this.propertyFamily = family; }
    public String getPropertyDetail() { return propertyDetail; }
    public void setPropertyDetail(String detail) { this.propertyDetail = detail; }
    public Set<Symptom> getSymptoms() { return symptoms; }
    public void setSymptoms(Set<Symptom> symptoms) { this.symptoms = symptoms; }
    public Set<Plant> getPlants() { return plants; }
    public void setPlants(Set<Plant> plants) { this.plants = plants; }
}
'@

Create-JavaFile "$baseDir\model\entity\Plant.java" @'
package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.AdministrationMode;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util. Set;

@Entity
@Table(name = "ms_plant")
public class Plant extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, unique = true, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "administration_mode", nullable = false, length = 30)
    private AdministrationMode administrationMode;

    @Column(name = "consumed_part", length = 100)
    private String consumedPart;

    @ManyToMany
    @JoinTable(name = "ms_plant_property",
        joinColumns = @JoinColumn(name = "plant_id"),
        inverseJoinColumns = @JoinColumn(name = "property_id"))
    private Set<Property> properties = new HashSet<>();

    @ManyToMany(mappedBy = "plants")
    private Set<Receipt> receipts = new HashSet<>();

    public Plant() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String desc) { this.description = desc; }
    public AdministrationMode getAdministrationMode() { return administrationMode; }
    public void setAdministrationMode(AdministrationMode mode) { this.administrationMode = mode; }
    public String getConsumedPart() { return consumedPart; }
    public void setConsumedPart(String part) { this.consumedPart = part; }
    public Set<Property> getProperties() { return properties; }
    public void setProperties(Set<Property> props) { this.properties = props; }
    public Set<Receipt> getReceipts() { return receipts; }
    public void setReceipts(Set<Receipt> receipts) { this.receipts = receipts; }
}
'@

Create-JavaFile "$baseDir\model\entity\Receipt. java" @'
package com.medicalsplants.model. entity;

import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums. ReceiptType;
import jakarta.persistence.*;
import java.util.ArrayList;
import java. util.HashSet;
import java.util.List;
import java. util.Set;

@Entity
@Table(name = "ms_receipt")
public class Receipt extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ReceiptType type;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReceiptStatus status = ReceiptStatus. DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany
    @JoinTable(name = "ms_receipt_plant",
        joinColumns = @JoinColumn(name = "receipt_id"),
        inverseJoinColumns = @JoinColumn(name = "plant_id"))
    private Set<Plant> plants = new HashSet<>();

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Receipt() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ReceiptType getType() { return type; }
    public void setType(ReceiptType type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String desc) { this.description = desc; }
    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean premium) { this.isPremium = premium; }
    public ReceiptStatus getStatus() { return status; }
    public void setStatus(ReceiptStatus status) { this.status = status; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public Set<Plant> getPlants() { return plants; }
    public void setPlants(Set<Plant> plants) { this.plants = plants; }
    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
}
'@

Create-JavaFile "$baseDir\model\entity\Review. java" @'
package com.medicalsplants.model. entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util. ArrayList;
import java.util.List;

@Entity
@Table(name = "ms_review")
public class Review extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @ManyToOne(fetch = FetchType. LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType. LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    private Review parentReview;

    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL)
    private List<Review> replies = new ArrayList<>();

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interaction> interactions = new ArrayList<>();

    public Review() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant time) { this.deletedAt = time; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public Receipt getReceipt() { return receipt; }
    public void setReceipt(Receipt receipt) { this.receipt = receipt; }
    public Review getParentReview() { return parentReview; }
    public void setParentReview(Review parent) { this.parentReview = parent; }
    public List<Review> getReplies() { return replies; }
    public List<Interaction> getInteractions() { return interactions; }

    public boolean isDeleted() { return deletedAt != null; }
    public void softDelete() { this.deletedAt = Instant.now(); }
}
'@

Create-JavaFile "$baseDir\model\entity\Interaction.java" @'
package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.InteractionType;
import jakarta.persistence.*;

@Entity
@Table(name = "ms_interaction")
public class Interaction extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private InteractionType type;

    @Column(name = "value", nullable = false, length = 50)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    public Interaction() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public InteractionType getType() { return type; }
    public void setType(InteractionType type) { this.type = type; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
}
'@

# ============================================================
# CONFIG
# ============================================================

Create-JavaFile "$baseDir\config\JwtProperties.java" @'
package com.medicalsplants.config;

import org. springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    private String secret;
    private long expiration = 900000;
    private long refreshExpiration = 604800000;
    private String tokenPrefix = "Bearer ";
    private String headerName = "Authorization";

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getExpiration() { return expiration; }
    public void setExpiration(long expiration) { this.expiration = expiration; }
    public long getRefreshExpiration() { return refreshExpiration; }
    public void setRefreshExpiration(long exp) { this.refreshExpiration = exp; }
    public String getTokenPrefix() { return tokenPrefix; }
    public void setTokenPrefix(String prefix) { this.tokenPrefix = prefix; }
    public String getHeaderName() { return headerName; }
    public void setHeaderName(String name) { this.headerName = name; }
}
'@

Create-JavaFile "$baseDir\config\AppProperties.java" @'
package com. medicalsplants. config;

import org.springframework.boot. context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java. util.List;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name = "Medicals Plants";
    private String url = "http://localhost:8080";
    private Cors cors = new Cors();

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public Cors getCors() { return cors; }
    public void setCors(Cors cors) { this.cors = cors; }

    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
        private long maxAge = 3600;

        public List<String> getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(List<String> origins) { this.allowedOrigins = origins; }
        public long getMaxAge() { return maxAge; }
        public void setMaxAge(long maxAge) { this.maxAge = maxAge; }
    }
}
'@

Write-Host ""
Write-Host "✅ Fichiers de base créés avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Exécutez:  mvn clean compile" -ForegroundColor White
Write-Host "   2. Si réussi, continuez avec les autres fichiers" -ForegroundColor White