package com.medicalsplants.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.repository.PropertyRepository;
import com.medicalsplants.repository.SymptomRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final SymptomRepository symptomRepository;

    public PropertyService(PropertyRepository propertyRepository, SymptomRepository symptomRepository) {
        this.propertyRepository = propertyRepository;
        this.symptomRepository = symptomRepository;
    }

    @Transactional(readOnly = true)
    public List<Property> getAllProperties() {
        return propertyRepository.findAllOrderByFamily();
    }

    @Transactional(readOnly = true)
    public Property getPropertyById(String id) {
        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        return propertyRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Property> getPropertiesBySymptomId(String symptomId) {
        UUID uuid = UUID.fromString(symptomId);
        if (uuid == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        return propertyRepository.findBySymptomId(uuid);
    }

    @Transactional
    public Property createProperty(String title, String propertyFamily, String propertyDetail, Set<String> symptomIds) {
        if (propertyRepository.existsByTitle(title)) {
            throw new ConflictException("A property with this title already exists");
        }

        Property property = new Property();
        property.setId(java.util.UUID.randomUUID());
        property.setTitle(title);
        property.setPropertyFamily(propertyFamily);
        property.setPropertyDetail(propertyDetail);

        if (symptomIds != null && !symptomIds.isEmpty()) {
            for (String symptomId : symptomIds) {
                UUID uuid = UUID.fromString(symptomId);
                if (uuid == null) {
                    throw new BadRequestException("Symptom id cannot be null");
                }
                Symptom symptom = symptomRepository.findById(uuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));
                property.getSymptoms().add(symptom);
            }
        }

        return propertyRepository.save(property);
    }

    @Transactional
    public Property updateProperty(String id, String title, String propertyFamily, String propertyDetail) {
        Property property = getPropertyById(id);

        if (!property.getTitle().equals(title) && propertyRepository.existsByTitle(title)) {
            throw new ConflictException("A property with this title already exists");
        }

        property.setTitle(title);
        property.setPropertyFamily(propertyFamily);
        property.setPropertyDetail(propertyDetail);

        return propertyRepository.save(property);
    }

    @Transactional
    public void deleteProperty(String id) {
        Property property = getPropertyById(id);
        if (property == null) {
            throw new BadRequestException("Property cannot be null");
        }
        propertyRepository.delete(property);
    }

    @Transactional
    public Property addSymptomToProperty(String propertyId, String symptomId) {
        Property property = getPropertyById(propertyId);
        UUID uuid = UUID.fromString(symptomId);
        if (uuid == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        Symptom symptom = symptomRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));
        property.getSymptoms().add(symptom);
        return propertyRepository.save(property);
    }

    @Transactional
    public Property removeSymptomFromProperty(String propertyId, String symptomId) {
        Property property = getPropertyById(propertyId);
        UUID uuid = UUID.fromString(symptomId);
        if (uuid == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        property.getSymptoms().removeIf(s -> s.getId().equals(uuid));
        return propertyRepository.save(property);
    }
}
