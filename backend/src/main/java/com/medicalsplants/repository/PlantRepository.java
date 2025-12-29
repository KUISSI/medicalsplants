package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Plant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

//  Repository for Plant entity operations.
@Repository
public interface PlantRepository extends JpaRepository<Plant, String> {

//  Finds a plant by title.
    Optional<Plant> findByTitle(String title);

//  Checks if title exists. 
    boolean existsByTitle(String title);

// Finds plants by symptom ID (through properties).
    @Query("""
        SELECT DISTINCT pl FROM Plant pl 
        JOIN pl. properties p 
        JOIN p.symptoms s 
        WHERE s. id = :symptomId
        ORDER BY pl.title ASC
        """)
    Page<Plant> findBySymptomId(@Param("symptomId") String symptomId, Pageable pageable);

// Finds plants by property ID.
    @Query("SELECT pl FROM Plant pl JOIN pl.properties p WHERE p.id = :propertyId ORDER BY pl.title ASC")
    List<Plant> findByPropertyId(@Param("propertyId") String propertyId);

// Searches plants by title. 
    @Query(value = """
        SELECT * FROM ms_plant 
        WHERE LOWER(title) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY title ASC
        LIMIT : limit
        """, nativeQuery = true)
    List<Plant> searchByTitle(@Param("query") String query, @Param("limit") int limit);
}
