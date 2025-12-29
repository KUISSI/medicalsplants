package com.medicalsplants.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

// Entity representing a user review on a recipe.
//  Reviews can have replies (tree structure) and interactions.
@Entity
@Table(name = "ms_review", indexes = {
    @Index(name = "idx_review_receipt", columnList = "receipt_id"),
    @Index(name = "idx_review_sender", columnList = "sender_id"),
    @Index(name = "idx_review_parent", columnList = "parent_review_id"),
    @Index(name = "idx_review_deleted", columnList = "deleted_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // ========================================
    // RELATIONSHIPS
    // ========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    private Review parentReview;

    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL)
    @Builder.Default
    @OrderBy("createdAt ASC")
    private List<Review> replies = new ArrayList<>();

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Interaction> interactions = new ArrayList<>();

    // ========================================
    // HELPER METHODS
    // ========================================
    // Checks if the review is deleted (soft delete).
    public boolean isDeleted() {
        return deletedAt != null;
    }

    // Soft deletes this review.
    public void softDelete() {
        this.deletedAt = Instant.now();
    }

    // Checks if this is a reply to another review.
    public boolean isReply() {
        return parentReview != null;
    }

    // Gets the reply count.
    public int getReplyCount() {
        return replies != null ? replies.size() : 0;
    }
}
