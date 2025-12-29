package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums.ReceiptType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository for Receipt entity operations. 
@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String> {

// Finds published recipes with optional premium filter.
    @Query("""
        SELECT r FROM Receipt r 
        WHERE r.status = 'PUBLISHED' 
        AND (r.isPremium = false OR : canSeePremium = true)
        ORDER BY r.createdAt DESC
        """)
    Page<Receipt> findPublished(@Param("canSeePremium") boolean canSeePremium, Pageable pageable);

// Finds published recipes by plant ID.
    @Query("""
        SELECT DISTINCT r FROM Receipt r 
        JOIN r.plants pl 
        WHERE r.status = 'PUBLISHED' 
        AND pl.id = : plantId
        AND (r.isPremium = false OR : canSeePremium = true)
        ORDER BY r.createdAt DESC
        """)
    Page<Receipt> findPublishedByPlantId(
            @Param("plantId") String plantId,
            @Param("canSeePremium") boolean canSeePremium,
            Pageable pageable
    );

// Finds recipes by status.
    List<Receipt> findByStatus(ReceiptStatus status);

    // Finds pending recipes for admin.
    @Query("SELECT r FROM Receipt r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Receipt> findPendingReceipts();

    // Counts recipes by status.
    long countByStatus(ReceiptStatus status);
}
