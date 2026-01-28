package com.medicalsplants.model.entity;

import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums.ReceiptType;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "ms_receipt")

public class Receipt extends BaseEntity {

    public Receipt() {
    }

    public Receipt(java.util.UUID id, String title, ReceiptType type, String description, Boolean isPremium, ReceiptStatus status, User author, Set<Plant> plants, List<Review> reviews) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.description = description;
        this.isPremium = isPremium;
        this.status = status;
        this.author = author;
        this.plants = plants;
        this.reviews = reviews;
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ReceiptType getType() {
        return type;
    }

    public void setType(ReceiptType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    public ReceiptStatus getStatus() {
        return status;
    }

    public void setStatus(ReceiptStatus status) {
        this.status = status;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Set<Plant> getPlants() {
        return plants;
    }

    public void setPlants(Set<Plant> plants) {
        this.plants = plants;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

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
    private Boolean isPremium = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
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
    private Set<Plant> plants = new HashSet<>();

    // Relations One-to-Many avec Review
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
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
