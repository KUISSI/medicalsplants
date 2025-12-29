package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Interaction;
import com.medicalsplants.model.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository for Interaction entity operations. 
@Repository
public interface InteractionRepository extends JpaRepository<Interaction, String> {

// Finds interactions for a review.
    List<Interaction> findByReviewId(String reviewId);

//  Checks if an interaction exists.
    boolean existsByUserIdAndReviewIdAndTypeAndValue(
            String userId,
            String reviewId,
            InteractionType type,
            String value
    );

//  Finds a specific interaction. 
    Optional<Interaction> findByUserIdAndReviewIdAndTypeAndValue(
            String userId,
            String reviewId,
            InteractionType type,
            String value
    );

//  Gets interaction summary for a review.
    @Query("""
        SELECT i. type, i.value, COUNT(i) 
        FROM Interaction i 
        WHERE i.review.id = :reviewId
        GROUP BY i. type, i.value
        ORDER BY COUNT(i) DESC
        """)
    List<Object[]> getInteractionSummary(@Param("reviewId") String reviewId);
}
