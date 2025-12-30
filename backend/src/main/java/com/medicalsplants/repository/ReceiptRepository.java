package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.enums.ReceiptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String> {

    @Query("SELECT r FROM Receipt r WHERE r. status = 'PUBLISHED' AND (r.isPremium = false OR : canSeePremium = true) ORDER BY r.createdAt DESC")
    Page<Receipt> findPublished(@Param("canSeePremium") boolean canSeePremium, Pageable pageable);

    @Query("SELECT DISTINCT r FROM Receipt r JOIN r.plants pl WHERE r.status = 'PUBLISHED' AND pl.id = :plantId AND (r.isPremium = false OR : canSeePremium = true) ORDER BY r.createdAt DESC")
    Page<Receipt> findPublishedByPlantId(@Param("plantId") String plantId, @Param("canSeePremium") boolean canSeePremium, Pageable pageable);

    List<Receipt> findByStatus(ReceiptStatus status);

    @Query("SELECT r FROM Receipt r WHERE r.status = 'PENDING' ORDER BY r. createdAt ASC")
    List<Receipt> findPendingReceipts();

    long countByStatus(ReceiptStatus status);
}
