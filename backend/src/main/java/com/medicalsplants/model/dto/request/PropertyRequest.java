package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class PropertyRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @NotBlank(message = "Family is required")
    @Size(max = 100, message = "Family must be less than 100 characters")
    private String family;

    @NotBlank(message = "Description is required")
    private String description;

    private Set<String> symptomIds;

    public PropertyRequest() {
    }

    // Getters and Setters
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

    public Set<String> getSymptomIds() {
        return symptomIds;
    }

    public void setSymptomIds(Set<String> symptomIds) {
        this.symptomIds = symptomIds;
    }
}
