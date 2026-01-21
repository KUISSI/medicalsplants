package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, java.util.UUID> {

    Optional<Property> findByTitle(String title);

    boolean existsByTitle(String title);

    @Query("SELECT p FROM Property p JOIN p.symptoms s WHERE s.id = :symptomId ORDER BY p.title ASC")
    List<Property> findBySymptomId(@Param("symptomId") java.util.UUID symptomId);

    @Query("SELECT p FROM Property p ORDER BY p.propertyFamily ASC, p.title ASC")
    List<Property> findAllOrderByFamily();
}
