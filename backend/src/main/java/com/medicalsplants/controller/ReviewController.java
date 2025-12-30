package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Review;
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

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Reviews", description = "Review management endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(summary = "Get reviews by receipt ID")
    @GetMapping("/receipt/{receiptId}")
    public ResponseEntity<List<Review>> getReviewsByReceiptId(@PathVariable String receiptId) {
        List<Review> reviews = reviewService.getReviewsByReceiptId(receiptId);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get review by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable String id) {
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @Operation(summary = "Get reviews by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Review>> getReviewsByUserId(@PathVariable String userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Review> reviews = reviewService.getReviewsByUserId(userId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get my reviews")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<Page<Review>> getMyReviews(@AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Review> reviews = reviewService.getReviewsByUserId(currentUser.getId(), pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Create a review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestParam String receiptId,
            @RequestParam String content,
            @RequestParam(required = false) String parentReviewId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.createReview(receiptId, content, parentReviewId, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @Operation(summary = "Update a review")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id,
            @RequestParam String content,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.updateReview(id, content, currentUser);
        return ResponseEntity.ok(review);
    }

    @Operation(summary = "Delete a review")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        reviewService.deleteReview(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
