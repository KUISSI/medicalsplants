package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.repository.SymptomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SymptomService {

    private final SymptomRepository symptomRepository;

    public SymptomService(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }

    @Transactional(readOnly = true)
    public List<Symptom> getAllSymptoms() {
        return symptomRepository.findAllOrderByFamily();
    }

    @Transactional(readOnly = true)
    public Symptom getSymptomById(String id) {
        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        return symptomRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Symptom> getSymptomsByFamily(String family) {
        return symptomRepository.findBySymptomFamily(family);
    }

    @Transactional(readOnly = true)
    public List<String> getAllFamilies() {
        return symptomRepository.findAllFamilies();
    }

    @Transactional(readOnly = true)
    public Map<String, List<Symptom>> getSymptomsGroupedByFamily() {
        List<Symptom> allSymptoms = symptomRepository.findAllOrderByFamily();
        return allSymptoms.stream()
                .collect(Collectors.groupingBy(Symptom::getFamily));
    }

    @Transactional
    public Symptom createSymptom(String title, String symptomFamily, String symptomDetail) {
        if (symptomRepository.existsByTitle(title)) {
            throw new ConflictException("A symptom with this title already exists");
        }

        Symptom symptom = new Symptom();
        symptom.setId(java.util.UUID.randomUUID());
        symptom.setTitle(title);
        symptom.setFamily(symptomFamily);
        symptom.setDescription(symptomDetail);

        return symptomRepository.save(symptom);
    }

    @Transactional
    public Symptom updateSymptom(String id, String title, String symptomFamily, String symptomDetail) {
        Symptom symptom = getSymptomById(id);

        if (!symptom.getTitle().equals(title) && symptomRepository.existsByTitle(title)) {
            throw new ConflictException("A symptom with this title already exists");
        }

        symptom.setTitle(title);
        symptom.setFamily(symptomFamily);
        symptom.setDescription(symptomDetail);

        return symptomRepository.save(symptom);
    }

    @Transactional
    public void deleteSymptom(String id) {
        Symptom symptom = getSymptomById(id);
        if (symptom == null) {
            throw new BadRequestException("Symptom cannot be null");
        }
        symptomRepository.delete(symptom);
    }
}
