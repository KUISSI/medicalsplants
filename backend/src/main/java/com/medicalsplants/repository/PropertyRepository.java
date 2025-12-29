package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository for Property entity operations.
@Repository
public interface PropertyRepository extends JpaRepository<Property, String> {

// Finds a property by title.
    Optional<Property> findByTitle(String title);

// Checks if title exists.
    boolean existsByTitle(String title);

// Finds properties by symptom ID.
    @Query("SELECT p FROM Property p JOIN p.symptoms s WHERE s.id = : symptomId ORDER BY p.title ASC")
    List<Property> findBySymptomId(@Param("symptomId") String symptomId);

// Finds all properties ordered by family and title.
    @Query("SELECT p FROM Property p ORDER BY p.propertyFamily ASC, p.title ASC")
    List<Property> findAllOrderByFamily();
}
