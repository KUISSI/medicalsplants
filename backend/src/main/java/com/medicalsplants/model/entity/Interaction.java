package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.InteractionType;
import jakarta.persistence.*;
// Lombok removed, manual implementation

@Entity
@Table(name = "ms_interaction")
public class Interaction extends BaseEntity {

    public Interaction() {
    }

    public Interaction(java.util.UUID id, InteractionType type, String value, User user, Review review) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.user = user;
        this.review = review;
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public InteractionType getType() {
        return type;
    }

    public void setType(InteractionType type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public static InteractionBuilder builder() {
        return new InteractionBuilder();
    }

    public static class InteractionBuilder {

        private java.util.UUID id;
        private InteractionType type;
        private String value;
        private User user;
        private Review review;

        public InteractionBuilder id(java.util.UUID id) {
            this.id = id;
            return this;
        }

        public InteractionBuilder type(InteractionType type) {
            this.type = type;
            return this;
        }

        public InteractionBuilder value(String value) {
            this.value = value;
            return this;
        }

        public InteractionBuilder user(User user) {
            this.user = user;
            return this;
        }

        public InteractionBuilder review(Review review) {
            this.review = review;
            return this;
        }

        public Interaction build() {
            return new Interaction(id, type, value, user, review);
        }
    }

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InteractionType type;

    @Column(nullable = false, length = 50)
    private String value;

    // Utilisateur ayant réagi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Avis concerné
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    // Méthodes utilitaires
    public boolean isGift() {
        return this.type == InteractionType.GIFT;
    }

    public boolean isEmoji() {
        return this.type == InteractionType.EMOJI;
    }
}
