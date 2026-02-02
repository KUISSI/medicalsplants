package com.medicalsplants.service;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.entity.Review;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.repository.RecipeRepository;
import com.medicalsplants.repository.ReviewRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, RecipeRepository recipeRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByRecipeId(String recipeId) {
        UUID uuid = UUID.fromString(recipeId);
        return reviewRepository.findByRecipeIdAndNotDeleted(uuid);
    }

    @Transactional(readOnly = true)
    public Review getReviewById(String id) {
        UUID uuid = UUID.fromString(id);
        return reviewRepository.findByIdAndNotDeleted(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<Review> getReviewsByUserId(String userId, Pageable pageable) {
        UUID uuid = UUID.fromString(userId);
        return reviewRepository.findByAuthorIdAndNotDeleted(uuid, pageable);
    }

    @Transactional(readOnly = true)
    public long getReviewCountByRecipeId(String recipeId) {
        UUID uuid = UUID.fromString(recipeId);
        return reviewRepository.countByRecipeId(uuid);
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingByRecipeId(String recipeId) {
        UUID uuid = UUID.fromString(recipeId);
        return reviewRepository.getAverageRatingByRecipeId(uuid);
    }

    @Transactional
    public Review createReview(String recipeId, String content, Short rating, String parentId, String authorId) {
        UUID recipeUuid = UUID.fromString(recipeId);
        Recipe recipe = recipeRepository.findById(recipeUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", recipeId));

        UUID authorUuid = UUID.fromString(authorId);
        User author = userRepository.findById(authorUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Review review = new Review();
        review.setId(UUID.randomUUID());
        review.setContent(content);
        review.setRating(rating);
        review.setRecipe(recipe);
        review.setAuthor(author);

        if (parentId != null && !parentId.isBlank()) {
            UUID parentUuid = UUID.fromString(parentId);
            Review parent = reviewRepository.findByIdAndNotDeleted(parentUuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Review", "id", parentId));
            review.setParent(parent);
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(String id, String content, Short rating, CustomUserDetails currentUser) {
        Review review = getReviewById(id);

        if (!review.getAuthor().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own reviews");
        }

        if (content != null) review.setContent(content);
        if (rating != null) review.setRating(rating);
        
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(String id, CustomUserDetails currentUser) {
        Review review = getReviewById(id);

        if (!review.getAuthor().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        review.softDelete();
        reviewRepository.save(review);
    }
}
