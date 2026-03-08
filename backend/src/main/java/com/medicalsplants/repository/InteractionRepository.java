package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Interaction;
import com.medicalsplants.model.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, java.util.UUID> {

    List<Interaction> findByReviewId(java.util.UUID reviewId);

    boolean existsByUserIdAndReviewIdAndTypeAndValue(java.util.UUID userId, java.util.UUID reviewId, InteractionType type, String value);

    Optional<Interaction> findByUserIdAndReviewIdAndTypeAndValue(java.util.UUID userId, java.util.UUID reviewId, InteractionType type, String value);

    @Query("SELECT i. type, i.value, COUNT(i) FROM Interaction i WHERE i. review.id = :reviewId GROUP BY i.type, i.value ORDER BY COUNT(i) DESC")
    List<Object[]> getInteractionSummary(@Param("reviewId") java.util.UUID reviewId);
}
