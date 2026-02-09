package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class RecipeRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @NotNull(message = "Type is required")
    private String type;

    @NotBlank(message = "Description is required")
    private String description;

    private String preparationTime;

    @Size(max = 20, message = "Difficulty must be less than 20 characters")
    private String difficulty;

    private Integer servings;

    private String ingredients;

    private String instructions;

    private String imageUrl;

    private Boolean premium;

    private Set<String> plantIds;

    public RecipeRequest() {
    }

    // Getters and Setters
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

    public String getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(String preparationTime) {
        this.preparationTime = preparationTime;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public Set<String> getPlantIds() {
        return plantIds;
    }

    public void setPlantIds(Set<String> plantIds) {
        this.plantIds = plantIds;
    }
}
