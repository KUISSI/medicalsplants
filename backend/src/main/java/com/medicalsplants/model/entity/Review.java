package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ms_review")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

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
