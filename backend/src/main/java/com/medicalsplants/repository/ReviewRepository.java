package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("SELECT r FROM Review r WHERE r.id = :id AND r.deletedAt IS NULL")
    Optional<Review> findByIdAndNotDeleted(@Param("id") UUID id);

    @Query("SELECT r FROM Review r WHERE r.recipe.id = :recipeId AND r.deletedAt IS NULL AND r.parent IS NULL ORDER BY r.createdAt DESC")
    List<Review> findByRecipeIdAndNotDeleted(@Param("recipeId") UUID recipeId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.recipe.id = :recipeId AND r.deletedAt IS NULL")
    long countByRecipeId(@Param("recipeId") UUID recipeId);

    @Query("SELECT r FROM Review r WHERE r.author.id = :userId AND r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    Page<Review> findByAuthorIdAndNotDeleted(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.recipe.id = :recipeId AND r.deletedAt IS NULL AND r.rating IS NOT NULL")
    Double getAverageRatingByRecipeId(@Param("recipeId") UUID recipeId);

    @Modifying
    @Query("UPDATE Review r SET r.deletedAt = :now WHERE r.author.id = :userId AND r.deletedAt IS NULL")
    int softDeleteByAuthorId(@Param("userId") UUID userId, @Param("now") Instant now);
}
