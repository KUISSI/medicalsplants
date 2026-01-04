package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ms_review")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @Column(length = 26)
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Auteur de l'avis
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    // Avis parent (pour les réponses en arborescence)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    private Review parentReview;

    // Réponses à cet avis
    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Review> replies = new ArrayList<>();

    // Recette concernée
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Soft delete
    @Column(name = "deleted_at")
    private Instant deletedAt;

    // Interactions (émojis, cadeaux)
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Interaction> interactions = new ArrayList<>();

    // Méthodes utilitaires
    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void softDelete() {
        this.deletedAt = Instant.now();
    }

    public boolean isReply() {
        return this.parentReview != null;
    }
}
