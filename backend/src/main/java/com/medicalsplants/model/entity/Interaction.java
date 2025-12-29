package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.InteractionType;
import jakarta.persistence.*;
import lombok.*;

// Entity representing an interaction on a review. Interactions can be emoji
// reactions or virtual gifts.
@Entity
@Table(name = "ms_interaction", indexes = {
    @Index(name = "idx_interaction_review", columnList = "review_id"),
    @Index(name = "idx_interaction_user", columnList = "user_id"),
    @Index(name = "idx_interaction_type", columnList = "type")
}, uniqueConstraints = {
    @UniqueConstraint(
            name = "uk_interaction_user_review_type_value",
            columnNames = {"user_id", "review_id", "type", "value"}
    )
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interaction extends BaseEntity {

    @Id
    @Column(name = "id", length = 26)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private InteractionType type;

    @Column(name = "value", nullable = false, length = 50)
    private String value;

    // ========================================
    // RELATIONSHIPS
    // ========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    // ========================================
    // HELPER METHODS
    // ========================================
    // Checks if this is an emoji interaction.
    public boolean isEmoji() {
        return type == InteractionType.EMOJI;
    }

    // Checks if this is a gift interaction.
    public boolean isGift() {
        return type == InteractionType.GIFT;
    }
}
