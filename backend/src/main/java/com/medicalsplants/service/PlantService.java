package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.enums.AdministrationMode;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.PropertyRepository;
import com.medicalsplants.util.UlidGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;
    private final PropertyRepository propertyRepository;
    private final UlidGenerator ulidGenerator;

    @Transactional(readOnly = true)
    public Page<Plant> getAllPlants(Pageable pageable) {
        return plantRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Plant getPlantById(String id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<Plant> getPlantsBySymptomId(String symptomId, Pageable pageable) {
        return plantRepository.findBySymptomId(symptomId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Plant> getPlantsByPropertyId(String propertyId) {
        return plantRepository.findByPropertyId(propertyId);
    }

    @Transactional
    public Plant createPlant(String title, String description, AdministrationMode administrationMode,
            String consumedPart, Set<String> propertyIds) {
        if (plantRepository.existsByTitle(title)) {
            throw new ConflictException("A plant with this title already exists");
        }

        Plant plant = new Plant();
        plant.setId(ulidGenerator.generate());
        plant.setTitle(title);
        plant.setDescription(description);
        plant.setAdministrationMode(administrationMode);
        plant.setConsumedPart(consumedPart);

        if (propertyIds != null && !propertyIds.isEmpty()) {
            for (String propertyId : propertyIds) {
                Property property = propertyRepository.findById(propertyId)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
                plant.getProperties().add(property);
            }
        }

        return plantRepository.save(plant);
    }

    @Transactional
    public Plant updatePlant(String id, String title, String description,
            AdministrationMode administrationMode, String consumedPart) {
        Plant plant = getPlantById(id);

        if (!plant.getTitle().equals(title) && plantRepository.existsByTitle(title)) {
            throw new ConflictException("A plant with this title already exists");
        }

        plant.setTitle(title);
        plant.setDescription(description);
        plant.setAdministrationMode(administrationMode);
        plant.setConsumedPart(consumedPart);

        return plantRepository.save(plant);
    }

    @Transactional
    public void deletePlant(String id) {
        Plant plant = getPlantById(id);
        plantRepository.delete(plant);
    }

    @Transactional
    public Plant addPropertyToPlant(String plantId, String propertyId) {
        Plant plant = getPlantById(plantId);
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        plant.getProperties().add(property);
        return plantRepository.save(plant);
    }

    @Transactional
    public Plant removePropertyFromPlant(String plantId, String propertyId) {
        Plant plant = getPlantById(plantId);
        plant.getProperties().removeIf(p -> p.getId().equals(propertyId));
        return plantRepository.save(plant);
    }
}
