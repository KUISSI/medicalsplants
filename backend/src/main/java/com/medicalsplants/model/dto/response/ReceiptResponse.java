package com.medicalsplants.model.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ReceiptResponse {

    private UUID id;
    private String title;
    private String type;
    private String description;
    private boolean isPremium;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse author;
    private List<PlantResponse> plants;
    private List<ReviewResponse> reviews;
    // Ajoutez d'autres champs nécessaires

    public ReceiptResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPremium() {
        return isPremium;
    }

    public void setPremium(boolean premium) {
        isPremium = premium;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UserResponse getAuthor() {
        return author;
    }

    public void setAuthor(UserResponse author) {
        this.author = author;
    }

    public List<PlantResponse> getPlants() {
        return plants;
    }

    public void setPlants(List<PlantResponse> plants) {
        this.plants = plants;
    }

    public List<ReviewResponse> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }
    // Ajoutez d'autres getters/setters si besoin
}
