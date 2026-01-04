package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.repository.PropertyRepository;
import com.medicalsplants.repository.SymptomRepository;
import com.medicalsplants.util.UlidGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final SymptomRepository symptomRepository;
    private final UlidGenerator ulidGenerator;

    @Transactional(readOnly = true)
    public List<Property> getAllProperties() {
        return propertyRepository.findAllOrderByFamily();
    }

    @Transactional(readOnly = true)
    public Property getPropertyById(String id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Property> getPropertiesBySymptomId(String symptomId) {
        return propertyRepository.findBySymptomId(symptomId);
    }

    @Transactional
    public Property createProperty(String title, String propertyFamily, String propertyDetail, Set<String> symptomIds) {
        if (propertyRepository.existsByTitle(title)) {
            throw new ConflictException("A property with this title already exists");
        }

        Property property = new Property();
        property.setId(ulidGenerator.generate());
        property.setTitle(title);
        property.setPropertyFamily(propertyFamily);
        property.setPropertyDetail(propertyDetail);

        if (symptomIds != null && !symptomIds.isEmpty()) {
            for (String symptomId : symptomIds) {
                Symptom symptom = symptomRepository.findById(symptomId)
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
        propertyRepository.delete(property);
    }

    @Transactional
    public Property addSymptomToProperty(String propertyId, String symptomId) {
        Property property = getPropertyById(propertyId);
        Symptom symptom = symptomRepository.findById(symptomId)
                .orElseThrow(() -> new ResourceNotFoundException("Symptom", "id", symptomId));

        property.getSymptoms().add(symptom);
        return propertyRepository.save(property);
    }

    @Transactional
    public Property removeSymptomFromProperty(String propertyId, String symptomId) {
        Property property = getPropertyById(propertyId);
        property.getSymptoms().removeIf(s -> s.getId().equals(symptomId));
        return propertyRepository.save(property);
    }
}
