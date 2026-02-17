package com.medicalsplants.model.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "mp_review")
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column
    private Short rating;

    // Auteur de l'avis
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // Avis parent (pour les réponses en arborescence)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    private Review parent;

    // Réponses à cet avis
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Review> replies = new ArrayList<>();

    // Recette concernée
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // Soft delete
    @Column(name = "deleted_at")
    private Instant deletedAt;

    // Constructors
    public Review() {
    }

    public Review(UUID id, String content, User author, Recipe recipe) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.recipe = recipe;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Short getRating() {
        return rating;
    }

    public void setRating(Short rating) {
        this.rating = rating;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Review getParent() {
        return parent;
    }

    public void setParent(Review parent) {
        this.parent = parent;
    }

    public List<Review> getReplies() {
        return replies;
    }

    public void setReplies(List<Review> replies) {
        this.replies = replies;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    @Override
    public Instant getDeletedAt() {
        return deletedAt;
    }

    @Override
    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

    // Utility methods
    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void softDelete() {
        this.deletedAt = Instant.now();
    }

    public boolean isReply() {
        return this.parent != null;
    }

    public void addReply(Review reply) {
        this.replies.add(reply);
        reply.setParent(this);
    }
}
