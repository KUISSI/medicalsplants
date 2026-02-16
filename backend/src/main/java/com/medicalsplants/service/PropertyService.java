package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.dto.request.PropertyRequest;
import com.medicalsplants.model.dto.response.PropertyResponse;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.model.mapper.PropertyMapper;
import com.medicalsplants.repository.PropertyRepository;
import com.medicalsplants.repository.SymptomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final SymptomRepository symptomRepository;
    private final PropertyMapper propertyMapper;

    public PropertyService(PropertyRepository propertyRepository,
            SymptomRepository symptomRepository,
            PropertyMapper propertyMapper) {
        this.propertyRepository = propertyRepository;
        this.symptomRepository = symptomRepository;
        this.propertyMapper = propertyMapper;
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAllOrderByFamily()
                .stream()
                .map(propertyMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(String id) {
        UUID uuid = UUID.fromString(id);
        Property property = propertyRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        return propertyMapper.toDto(property);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPropertiesBySymptomId(String symptomId) {
        UUID uuid = UUID.fromString(symptomId);
        return propertyRepository.findBySymptomId(uuid)
                .stream()
                .map(propertyMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPropertiesByFamily(String family) {
        return propertyRepository.findByFamily(family)
                .stream()
                .map(propertyMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> getAllFamilies() {
        return propertyRepository.findAllFamilies();
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        if (propertyRepository.existsByTitle(request.getTitle())) {
            throw new ConflictException("A property with this title already exists");
        }

        Property property = propertyMapper.toEntity(request);
        property.setId(UUID.randomUUID());

        // Associer les symptômes
        if (request.getSymptomIds() != null && !request.getSymptomIds().isEmpty()) {
            Set<Symptom> symptoms = new HashSet<>();
            for (String symptomId : request.getSymptomIds()) {
                UUID uuid = UUID.fromString(symptomId);
                Symptom symptom = symptomRepository.findById(uuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));
                symptoms.add(symptom);
            }
            property.setSymptoms(symptoms);
        }

        Property saved = propertyRepository.save(property);
        return propertyMapper.toDto(saved);
    }

    @Transactional
    public PropertyResponse updateProperty(String id, PropertyRequest request) {
        UUID uuid = UUID.fromString(id);
        Property property = propertyRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        property.setTitle(request.getTitle());
        property.setFamily(request.getFamily());
        property.setDescription(request.getDescription());

        // Mettre à jour les symptômes si fournis
        if (request.getSymptomIds() != null) {
            Set<Symptom> symptoms = new HashSet<>();
            for (String symptomId : request.getSymptomIds()) {
                UUID symptomUuid = UUID.fromString(symptomId);
                Symptom symptom = symptomRepository.findById(symptomUuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));
                symptoms.add(symptom);
            }
            property.setSymptoms(symptoms);
        }

        Property saved = propertyRepository.save(property);
        return propertyMapper.toDto(saved);
    }

    @Transactional
    public void deleteProperty(String id) {
        UUID uuid = UUID.fromString(id);
        if (!propertyRepository.existsById(uuid)) {
            throw new ResourceNotFoundException("Property", "id", id);
        }
        propertyRepository.deleteById(uuid);
    }
}
