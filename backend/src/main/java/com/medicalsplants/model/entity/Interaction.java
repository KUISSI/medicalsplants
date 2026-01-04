package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.InteractionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ms_interaction")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interaction extends BaseEntity {

    @Id
    @Column(length = 26)
    private String id;

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
