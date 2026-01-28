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

    @Operation(summary = "Get reviews by receipt ID")
    @GetMapping("/receipt/{receiptId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByReceiptId(@PathVariable UUID receiptId) {
        List<Review> reviews = reviewService.getReviewsByReceiptId(receiptId.toString());
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

    @Operation(summary = "Create a review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestParam String receiptId,
            @RequestParam String content,
            @RequestParam(required = false) String parentReviewId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.createReview(receiptId, content, parentReviewId, currentUser.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewMapper.toDto(review));
    }

    @Operation(summary = "Update a review")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable UUID id,
            @RequestParam String content,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Review review = reviewService.updateReview(id.toString(), content, currentUser);
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
