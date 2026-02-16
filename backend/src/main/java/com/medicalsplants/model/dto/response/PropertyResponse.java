package com.medicalsplants.model.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PropertyResponse {

    private UUID id;
    private String title;
    private String family;
    private String description;
    private LocalDateTime createdAt;
    private List<SymptomResponse> symptoms;

    public PropertyResponse() {
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

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<SymptomResponse> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<SymptomResponse> symptoms) {
        this.symptoms = symptoms;
    }
}
