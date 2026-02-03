package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InteractionRequest {

    @NotNull(message = "Type is required")
    private String type;

    @NotBlank(message = "Recipe ID is required")
    private String recipeId;

    public InteractionRequest() {
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(String recipeId) {
        this.recipeId = recipeId;
    }
}
