package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums.ReceiptType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "ms_receipt")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Receipt extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private java.util.UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReceiptType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_premium")
    @Builder.Default
    private Boolean isPremium = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReceiptStatus status = ReceiptStatus.PUBLISHED;

    // Relation avec User (auteur)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    // Relations Many-to-Many avec Plant
    @ManyToMany
    @JoinTable(
            name = "ms_receipt_plant",
            joinColumns = @JoinColumn(name = "receipt_id"),
            inverseJoinColumns = @JoinColumn(name = "plant_id")
    )
    @Builder.Default
    private Set<Plant> plants = new HashSet<>();

    // Relations One-to-Many avec Review
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    // Méthodes utilitaires
    public void addPlant(Plant plant) {
        this.plants.add(plant);
        plant.getReceipts().add(this);
    }

    public void removePlant(Plant plant) {
        this.plants.remove(plant);
        plant.getReceipts().remove(this);
    }

    public boolean isPublished() {
        return this.status == ReceiptStatus.PUBLISHED;
    }

    public boolean isPending() {
        return this.status == ReceiptStatus.PENDING;
    }
}
