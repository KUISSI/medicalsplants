package com.medicalsplants.model.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ReviewResponse {

    private UUID id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse author;
    private UUID recipeId;
    private UUID parentReviewId;
    private List<ReviewResponse> replies;
    private Short rating; // Ajout du champ rating

    public ReviewResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public UUID getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(UUID recipeId) {
        this.recipeId = recipeId;
    }

    public UUID getParentReviewId() {
        return parentReviewId;
    }

    public void setParentReviewId(UUID parentReviewId) {
        this.parentReviewId = parentReviewId;
    }

    public List<ReviewResponse> getReplies() {
        return replies;
    }

    public void setReplies(List<ReviewResponse> replies) {
        this.replies = replies;
    }

    public Short getRating() {
        return rating;
    }

    public void setRating(Short rating) {
        this.rating = rating;
    }
}
