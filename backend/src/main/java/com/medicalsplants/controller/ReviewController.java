package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Review;
import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.model.mapper.ReviewMapper;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    private final ReviewMapper reviewMapper;

    public ReviewController(ReviewService reviewService, ReviewMapper reviewMapper) {
        this.reviewService = reviewService;
        this.reviewMapper = reviewMapper;
    }

    @Operation(summary = "Get reviews by recipe ID")
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByRecipeId(@PathVariable UUID recipeId) {
        List<Review> reviews = reviewService.getReviewsByRecipeId(recipeId.toString());
        List<ReviewResponse> dtoList = reviews.stream().map(reviewMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @Operation(summary = "Get review by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable UUID id) {
        Review review = reviewService.getReviewById(id.toString());
        return ResponseEntity.ok(reviewMapper.toDto(review));
    }

    @Operation(summary = "Get reviews by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByUserId(@PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReviewResponse> dtoPage = reviewService.getReviewsByUserId(userId.toString(), pageable).map(reviewMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get my reviews")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(@AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReviewResponse> dtoPage = reviewService.getReviewsByUserId(currentUser.getId().toString(), pageable).map(reviewMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get review count for a recipe")
    @GetMapping("/recipe/{recipeId}/count")
    public ResponseEntity<Long> getReviewCountByRecipeId(@PathVariable UUID recipeId) {
        long count = reviewService.getReviewCountByRecipeId(recipeId.toString());
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Get average rating for a recipe")
    @GetMapping("/recipe/{recipeId}/rating")
    public ResponseEntity<Double> getAverageRatingByRecipeId(@PathVariable UUID recipeId) {
        Double rating = reviewService.getAverageRatingByRecipeId(recipeId.toString());
        return ResponseEntity.ok(rating != null ? rating : 0.0);
    }

    @Operation(summary = "Create a review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestParam String recipeId,
            @RequestParam String content,
            @RequestParam(required = false) Short rating,
            @RequestParam(required = false) String parentId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.createReview(recipeId, content, rating, parentId, currentUser.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewMapper.toDto(review));
    }

    @Operation(summary = "Update a review")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable UUID id,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) Short rating,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.updateReview(id.toString(), content, rating, currentUser);
        return ResponseEntity.ok(reviewMapper.toDto(review));
    }

    @Operation(summary = "Delete a review")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        reviewService.deleteReview(id.toString(), currentUser);
        return ResponseEntity.noContent().build();
    }
}
