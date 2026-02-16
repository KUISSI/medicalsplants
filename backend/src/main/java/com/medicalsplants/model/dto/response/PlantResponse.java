package com.medicalsplants.model.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PlantResponse {

    private UUID id;
    private String title;
    private String description;
    private String history;
    private String imageUrl;
    private LocalDateTime createdAt;
    private List<PropertyResponse> properties;

    public PlantResponse() {
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<PropertyResponse> getProperties() {
        return properties;
    }

    public void setProperties(List<PropertyResponse> properties) {
        this.properties = properties;
    }
}
