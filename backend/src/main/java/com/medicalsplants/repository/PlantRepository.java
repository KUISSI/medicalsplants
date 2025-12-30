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
public interface PlantRepository extends JpaRepository<Plant, String> {

    Optional<Plant> findByTitle(String title);

    boolean existsByTitle(String title);

    @Query("SELECT DISTINCT pl FROM Plant pl JOIN pl.properties p JOIN p.symptoms s WHERE s.id = : symptomId ORDER BY pl.title ASC")
    Page<Plant> findBySymptomId(@Param("symptomId") String symptomId, Pageable pageable);

    @Query("SELECT pl FROM Plant pl JOIN pl.properties p WHERE p.id = :propertyId ORDER BY pl.title ASC")
    List<Plant> findByPropertyId(@Param("propertyId") String propertyId);
}
