package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.dto.request.SymptomRequest;
import com.medicalsplants.model.dto.response.SymptomResponse;
import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.model.mapper.SymptomMapper;
import com.medicalsplants.repository.SymptomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.dto.response.PlantResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class SymptomService {

    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;

    public SymptomService(SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    @Transactional(readOnly = true)
    public List<SymptomResponse> getAllSymptoms() {
        return symptomRepository.findAllOrderByFamily()
                .stream()
                .map(symptomMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public SymptomResponse getSymptomById(String id) {
        UUID uuid = UUID.fromString(id);
        Symptom symptom = symptomRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", id));
        return symptomMapper.toDto(symptom);
    }

    @Transactional(readOnly = true)
    public List<SymptomResponse> getSymptomsByFamily(String family) {
        return symptomRepository.findByFamily(family)
                .stream()
                .map(symptomMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> getAllFamilies() {
        return symptomRepository.findAllFamilies();
    }

    @Transactional(readOnly = true)
    public Map<String, List<SymptomResponse>> getSymptomsGroupedByFamily() {
        return symptomRepository.findAllOrderByFamily()
                .stream()
                .map(symptomMapper::toDto)
                .collect(Collectors.groupingBy(SymptomResponse::getFamily));
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getPlantsBySymptomId(String symptomId) {
        UUID uuid = UUID.fromString(symptomId);
        Symptom symptom = symptomRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));

        // Récupérer toutes les propriétés liées à ce symptôme
        Set<Property> properties = symptom.getProperties();

        // Récupérer toutes les plantes liées à ces propriétés
        Set<Plant> plants = new HashSet<>();
        for (Property property : properties) {
            plants.addAll(property.getPlants());
        }

        // Mapper en PlantResponse
        return plants.stream()
                .map(plant -> {
                    PlantResponse dto = new PlantResponse();
                    dto.setId(plant.getId());
                    dto.setTitle(plant.getTitle());
                    dto.setDescription(plant.getDescription());
                    dto.setImageUrl(plant.getImageUrl());
                    return dto;
                })
                .toList();
    }

    @Transactional
    public SymptomResponse createSymptom(SymptomRequest request) {
        if (symptomRepository.existsByTitle(request.getTitle())) {
            throw new ConflictException("A symptom with this title already exists");
        }

        Symptom symptom = symptomMapper.toEntity(request);
        symptom.setId(UUID.randomUUID());
        Symptom saved = symptomRepository.save(symptom);
        return symptomMapper.toDto(saved);
    }

    @Transactional
    public SymptomResponse updateSymptom(String id, SymptomRequest request) {
        UUID uuid = UUID.fromString(id);
        Symptom symptom = symptomRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", id));

        symptom.setTitle(request.getTitle());
        symptom.setFamily(request.getFamily());
        symptom.setDescription(request.getDescription());

        Symptom saved = symptomRepository.save(symptom);
        return symptomMapper.toDto(saved);
    }

    @Transactional
    public void deleteSymptom(String id) {
        UUID uuid = UUID.fromString(id);
        if (!symptomRepository.existsById(uuid)) {
            throw new ResourceNotFoundException("Symptom", "id", id);
        }
        symptomRepository.deleteById(uuid);
    }
}
