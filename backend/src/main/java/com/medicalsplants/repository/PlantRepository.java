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

@Repository
public interface PlantRepository extends JpaRepository<Plant, java.util.UUID> {

    Optional<Plant> findByTitle(String title);

    boolean existsByTitle(String title);

    @Query("SELECT DISTINCT pl FROM Plant pl JOIN pl.properties p JOIN p.symptoms s WHERE s.id = :symptomId")
    Page<Plant> findBySymptomId(@Param("symptomId") java.util.UUID symptomId, Pageable pageable);

    @Query("SELECT p FROM Plant p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Plant> search(@Param("search") String search, Pageable pageable);

    @Query("SELECT pl FROM Plant pl JOIN pl.properties p WHERE p.id = :propertyId ORDER BY pl.title ASC")
    List<Plant> findByPropertyId(@Param("propertyId") java.util.UUID propertyId);
}
