package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository for Symptom entity operations. 
@Repository
public interface SymptomRepository extends JpaRepository<Symptom, String> {

    // Finds a symptom by title.
    Optional<Symptom> findByTitle(String title);

    // Checks if title exists.
    boolean existsByTitle(String title);

    // Finds symptoms by family.
    List<Symptom> findBySymptomFamily(String symptomFamily);

    // Finds all symptoms ordered by family and title.
    @Query("SELECT s FROM Symptom s ORDER BY s.symptomFamily ASC, s.title ASC")
    List<Symptom> findAllOrderByFamily();

    // Searches symptoms by title (case-insensitive).
    @Query(value = """
        SELECT * FROM ms_symptom 
        WHERE LOWER(title) LIKE LOWER(CONCAT('%', : query, '%'))
        ORDER BY title ASC
        LIMIT : limit
        """, nativeQuery = true)
    List<Symptom> searchByTitle(@Param("query") String query, @Param("limit") int limit);

    // Gets all distinct families.
    @Query("SELECT DISTINCT s.symptomFamily FROM Symptom s ORDER BY s.symptomFamily ASC")
    List<String> findAllFamilies();
}
