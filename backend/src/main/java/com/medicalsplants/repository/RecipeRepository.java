package com.medicalsplants.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.enums.RecipeStatus;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, UUID> {

    @Query("SELECT r FROM Recipe r WHERE r.status = 'PUBLISHED' AND r.deletedAt IS NULL AND (r.premium = false OR :canSeePremium = true)")
    Page<Recipe> findPublished(@Param("canSeePremium") boolean canSeePremium, Pageable pageable);

    @Query("SELECT DISTINCT r FROM Recipe r JOIN r.plants pl WHERE r.status = 'PUBLISHED' AND r.deletedAt IS NULL AND pl.id = :plantId AND (r.premium = false OR :canSeePremium = true)")
    Page<Recipe> findPublishedByPlantId(UUID plantId, boolean canSeePremium, Pageable pageable);

    List<Recipe> findByStatusAndDeletedAtIsNull(RecipeStatus status);

    @Query("SELECT r FROM Recipe r WHERE r.status = 'PENDING' AND r.deletedAt IS NULL ORDER BY r.createdAt ASC")
    List<Recipe> findpendingRecipes();

    @Query("SELECT r FROM Recipe r WHERE r.author.id = :authorId AND r.deletedAt IS NULL")
    Page<Recipe> findByAuthorId(@Param("authorId") UUID authorId, Pageable pageable);

    long countByStatusAndDeletedAtIsNull(RecipeStatus status);

    @Query("SELECT r FROM Recipe r WHERE r.status = 'PUBLISHED' AND r.deletedAt IS NULL AND (r.premium = false OR :canSeePremium = true) AND LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Recipe> searchByTitle(@Param("search") String search, @Param("canSeePremium") boolean canSeePremium, Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE r.deletedAt IS NULL")
    Page<Recipe> findAllByDeletedAtIsNull(Pageable pageable);

    Page<Recipe> findByStatusAndDeletedAtIsNull(RecipeStatus status, Pageable pageable);
}
