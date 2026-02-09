package com.medicalsplants.model.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReviewRequest {

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Recipe ID is required")
    private String recipeId;

    private UUID parentReviewId;

    @NotNull(message = "Rating is required")
    private Short rating;

    public ReviewRequest() {
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(String recipeId) {
        this.recipeId = recipeId;
    }

    public UUID getParentReviewId() {
        return parentReviewId;
    }

    public void setParentReviewId(UUID parentReviewId) {
        this.parentReviewId = parentReviewId;
    }

    public Short getRating() {
        return rating;
    }

    public void setRating(Short rating) {
        this.rating = rating;
    }
}
