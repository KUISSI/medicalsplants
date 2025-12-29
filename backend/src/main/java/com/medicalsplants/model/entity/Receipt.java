package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums.ReceiptType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

// Entity representing a recipe using medicinal plants. 
// Recipes can be public or premium, and require admin approval.
@Entity
@Table(name = "ms_receipt", indexes = {
    @Index(name = "idx_receipt_title", columnList = "title"),
    @Index(name = "idx_receipt_type", columnList = "type"),
    @Index(name = "idx_receipt_status", columnList = "status"),
    @Index(name = "idx_receipt_is_premium", columnList = "is_premium"),
    @Index(name = "idx_receipt_author", columnList = "author_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Builder.Default
    private Boolean isPremium = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ReceiptStatus status = ReceiptStatus.DRAFT;

    @Column(name = "image_url")
    private String imageUrl;

    // ========================================
    // RELATIONSHIPS
    // ========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany
    @JoinTable(
            name = "ms_receipt_plant",
            joinColumns = @JoinColumn(name = "receipt_id"),
            inverseJoinColumns = @JoinColumn(name = "plant_id")
    )
    @Builder.Default
    private Set<Plant> plants = new HashSet<>();

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("createdAt DESC")
    private List<Review> reviews = new ArrayList<>();

    // ========================================
    // HELPER METHODS
    // ========================================
    // Adds a plant to this recipe.
    public void addPlant(Plant plant) {
        this.plants.add(plant);
        plant.getReceipts().add(this);
    }

    // Removes a plant from this recipe.
    public void removePlant(Plant plant) {
        this.plants.remove(plant);
        plant.getReceipts().remove(this);
    }

    // Checks if the recipe is published.
    public boolean isPublished() {
        return status == ReceiptStatus.PUBLISHED;
    }

    // Gets the review count.
    public int getReviewCount() {
        return reviews != null ? reviews.size() : 0;
    }
}
