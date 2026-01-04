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

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query("SELECT r FROM Review r WHERE r.id = :id AND r.deletedAt IS NULL")
    Optional<Review> findByIdAndNotDeleted(@Param("id") String id);

    @Query("SELECT r FROM Review r WHERE r.receipt.id = :receiptId AND r.deletedAt IS NULL AND r.parentReview IS NULL ORDER BY r.createdAt DESC")
    List<Review> findByReceiptIdAndNotDeleted(@Param("receiptId") String receiptId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.receipt.id = :receiptId AND r.deletedAt IS NULL")
    long countByReceiptId(@Param("receiptId") String receiptId);

    @Query("SELECT r FROM Review r WHERE r.sender.id = :userId AND r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    Page<Review> findBySenderIdAndNotDeleted(@Param("userId") String userId, Pageable pageable);

    @Modifying
    @Query("UPDATE Review r SET r.deletedAt = :now WHERE r.sender.id = :userId AND r.deletedAt IS NULL")
    int softDeleteBySenderId(@Param("userId") String userId, @Param("now") Instant now);
}
