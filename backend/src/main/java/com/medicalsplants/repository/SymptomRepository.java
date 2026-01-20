package com.medicalsplants.repository;

import com.medicalsplants.model.entity.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, String> {

    Optional<Symptom> findByTitle(String title);

    boolean existsByTitle(String title);

    List<Symptom> findBySymptomFamily(String symptomFamily);

    @Query("SELECT s FROM Symptom s ORDER BY s.symptomFamily ASC, s.title ASC")
    List<Symptom> findAllOrderByFamily();

    @Query("SELECT DISTINCT s.symptomFamily FROM Symptom s ORDER BY s.symptomFamily ASC")
    List<String> findAllFamilies();
}
