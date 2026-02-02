package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Interaction;
import com.medicalsplants.model.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, UUID> {

    List<Interaction> findByRecipeId(UUID recipeId);

    List<Interaction> findByUserId(UUID userId);

    boolean existsByUserIdAndRecipeIdAndType(UUID userId, UUID recipeId, InteractionType type);

    Optional<Interaction> findByUserIdAndRecipeIdAndType(UUID userId, UUID recipeId, InteractionType type);

    @Query("SELECT i.type, COUNT(i) FROM Interaction i WHERE i.recipe.id = :recipeId GROUP BY i.type ORDER BY COUNT(i) DESC")
    List<Object[]> getInteractionSummaryByRecipeId(@Param("recipeId") UUID recipeId);

    @Query("SELECT COUNT(i) FROM Interaction i WHERE i.recipe.id = :recipeId AND i.type = :type")
    long countByRecipeIdAndType(@Param("recipeId") UUID recipeId, @Param("type") InteractionType type);

    void deleteByUserIdAndRecipeIdAndType(UUID userId, UUID recipeId, InteractionType type);
}
