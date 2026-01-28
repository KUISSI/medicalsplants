package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ms_review")
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
    private List<Interaction> interactions = new ArrayList<>();

    public Review() {
    }

    public Review(java.util.UUID id, String content, User sender, Review parentReview, List<Review> replies, Receipt receipt, Instant deletedAt, List<Interaction> interactions) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.parentReview = parentReview;
        this.replies = replies != null ? replies : new ArrayList<>();
        this.receipt = receipt;
        this.deletedAt = deletedAt;
        this.interactions = interactions != null ? interactions : new ArrayList<>();
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public Review getParentReview() {
        return parentReview;
    }

    public void setParentReview(Review parentReview) {
        this.parentReview = parentReview;
    }

    public List<Review> getReplies() {
        return replies;
    }

    public void setReplies(List<Review> replies) {
        this.replies = replies;
    }

    public Receipt getReceipt() {
        return receipt;
    }

    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

    public List<Interaction> getInteractions() {
        return interactions;
    }

    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

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
