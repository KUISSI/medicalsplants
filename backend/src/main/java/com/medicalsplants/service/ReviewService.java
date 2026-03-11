package com.medicalsplants.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.dto.request.ReviewRequest;
import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.entity.Review;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.mapper.ReviewMapper;
import com.medicalsplants.repository.RecipeRepository;
import com.medicalsplants.repository.ReviewRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository,
            RecipeRepository recipeRepository,
            UserRepository userRepository,
            ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.reviewMapper = reviewMapper;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByRecipeId(UUID recipeId) {
        return reviewRepository.findByRecipeIdAndNotDeleted(recipeId)
                .stream()
                .map(reviewMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(UUID id) {
        Review review = reviewRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id.toString()));
        return reviewMapper.toDto(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByUserId(UUID userId, Pageable pageable) {
        return reviewRepository.findByAuthorIdAndNotDeleted(userId, pageable)
                .map(reviewMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long getReviewCountByRecipeId(UUID recipeId) {
        return reviewRepository.countByRecipeId(recipeId);
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingByRecipeId(UUID recipeId) {
        return reviewRepository.getAverageRatingByRecipeId(recipeId);
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, UUID authorId) {
        UUID recipeUuid = request.getRecipeId();
        Recipe recipe = recipeRepository.findById(recipeUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", recipeUuid.toString()));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId.toString()));

        Review review = new Review();
        review.setContent(request.getContent());
        review.setRating(request.getRating());
        review.setRecipe(recipe);
        review.setAuthor(author);

        if (request.getParentReviewId() != null) {
            UUID parentUuid = request.getParentReviewId();
            Review parent = reviewRepository.findById(parentUuid).orElse(null);
            review.setParent(parent);
        }

        Review saved = reviewRepository.save(review);
        return reviewMapper.toDto(saved);
    }

    @Transactional
    public ReviewResponse updateReview(UUID id, ReviewRequest request, CustomUserDetails currentUser) {
        Review review = reviewRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id.toString()));

        if (!review.getAuthor().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own reviews");
        }

        if (request.getContent() != null) {
            review.setContent(request.getContent());
        }
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }

        Review saved = reviewRepository.save(review);
        return reviewMapper.toDto(saved);
    }

    @Transactional
    public void deleteReview(UUID id, CustomUserDetails currentUser) {
        Review review = reviewRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id.toString()));

        if (!review.getAuthor().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        // Soft delete avec timestamp
        review.setDeletedAt(Instant.now());
        reviewRepository.save(review);
    }
}
