package com.medicalsplants.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medicalsplants.model.entity.Symptom;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, UUID> {

    Optional<Symptom> findByTitle(String title);

    boolean existsByTitle(String title);

    List<Symptom> findByFamily(String family);

    @Query("SELECT s FROM Symptom s ORDER BY s.family ASC, s.title ASC")
    List<Symptom> findAllOrderByFamily();

    @Query("SELECT DISTINCT s.family FROM Symptom s ORDER BY s.family ASC")
    List<String> findAllFamilies();

    // Recherche insensible à la casse sur titre, description et famille
    @Query("SELECT s FROM Symptom s WHERE "
            + "LOWER(s.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "OR LOWER(s.family) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "ORDER BY s.family ASC, s.title ASC")
    List<Symptom> search(@Param("searchTerm") String searchTerm);

    @Query("SELECT s FROM Symptom s WHERE "
            + "(:family IS NULL OR s.family = :family) AND "
            + "(LOWER(s.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) "
            + "OR LOWER(s.family) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) "
            + "ORDER BY s.family ASC, s.title ASC")
    List<Symptom> searchByFamilyAndTerm(
            @Param("family") String family,
            @Param("searchTerm") String searchTerm
    );
}
