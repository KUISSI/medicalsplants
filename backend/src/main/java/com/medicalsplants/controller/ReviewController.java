package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.ReviewRequest;
import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Reviews", description = "Review management endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(summary = "Get reviews by recipe ID")
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByRecipeId(@PathVariable UUID recipeId) {
        return ResponseEntity.ok(reviewService.getReviewsByRecipeId(recipeId));
    }

    @Operation(summary = "Get review by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @Operation(summary = "Get reviews by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByUserId(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId, pageable));
    }

    @Operation(summary = "Get my reviews")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(currentUser.getId(), pageable));
    }

    @Operation(summary = "Get review count for a recipe")
    @GetMapping("/recipe/{recipeId}/count")
    public ResponseEntity<Long> getReviewCountByRecipeId(@PathVariable UUID recipeId) {
        return ResponseEntity.ok(reviewService.getReviewCountByRecipeId(recipeId));
    }

    @Operation(summary = "Get average rating for a recipe")
    @GetMapping("/recipe/{recipeId}/rating")
    public ResponseEntity<Double> getAverageRatingByRecipeId(@PathVariable UUID recipeId) {
        Double rating = reviewService.getAverageRatingByRecipeId(recipeId);
        return ResponseEntity.ok(rating != null ? rating : 0.0);
    }

    @Operation(summary = "Create a review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ReviewResponse created = reviewService.createReview(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a review")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(reviewService.updateReview(id, request, currentUser));
    }

    @Operation(summary = "Delete a review")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        reviewService.deleteReview(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
