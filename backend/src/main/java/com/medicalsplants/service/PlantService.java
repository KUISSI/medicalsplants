package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class PlantService {

    public PlantService(PlantRepository plantRepository, PropertyRepository propertyRepository) {
        this.plantRepository = plantRepository;
        this.propertyRepository = propertyRepository;
    }

    private final PlantRepository plantRepository;
    private final PropertyRepository propertyRepository;

    @Transactional(readOnly = true)
    public Page<Plant> getAllPlants(Pageable pageable) {
        return plantRepository.findAll(java.util.Objects.requireNonNull(pageable, "Pageable cannot be null"));
    }

    @Transactional(readOnly = true)
    public Plant getPlantById(String id) {
        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Plant id cannot be null");
        }
        return plantRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<Plant> getPlantsBySymptomId(String symptomId, Pageable pageable) {
        UUID uuid = UUID.fromString(symptomId);
        if (uuid == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        return plantRepository.findBySymptomId(uuid, pageable);
    }

    @Transactional(readOnly = true)
    public List<Plant> getPlantsByPropertyId(String propertyId) {
        UUID uuid = UUID.fromString(propertyId);
        if (uuid == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        return plantRepository.findByPropertyId(uuid);
    }

    @Transactional
    public Plant createPlant(String title, String description, Set<String> propertyIds) {
        if (plantRepository.existsByTitle(title)) {
            throw new ConflictException("A plant with this title already exists");
        }

        Plant plant = new Plant();
        plant.setId(UUID.randomUUID());
        plant.setTitle(title);
        plant.setDescription(description);

        if (propertyIds != null && !propertyIds.isEmpty()) {
            for (String propertyId : propertyIds) {
                UUID uuid = UUID.fromString(propertyId);
                if (uuid == null) {
                    throw new BadRequestException("Property id cannot be null");
                }
                Property property = propertyRepository.findById(uuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
                plant.getProperties().add(property);
            }
        }

        return plantRepository.save(plant);
    }

    @Transactional
    public Plant updatePlant(String id, String title, String description) {
        Plant plant = getPlantById(id);

        if (!plant.getTitle().equals(title) && plantRepository.existsByTitle(title)) {
            throw new ConflictException("A plant with this title already exists");
        }

        plant.setTitle(title);
        plant.setDescription(description);

        return plantRepository.save(plant);
    }

    @Transactional
    public void deletePlant(String id) {
        Plant plant = getPlantById(id);
        if (plant == null) {
            throw new BadRequestException("Plant cannot be null");
        }
        plantRepository.delete(plant);
    }

    @Transactional
    public Plant addPropertyToPlant(String plantId, String propertyId) {
        Plant plant = getPlantById(plantId);
        UUID uuid = UUID.fromString(propertyId);
        if (uuid == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        Property property = propertyRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        plant.getProperties().add(property);
        return plantRepository.save(plant);
    }

    @Transactional
    public Plant removePropertyFromPlant(String plantId, String propertyId) {
        Plant plant = getPlantById(plantId);
        UUID uuid = UUID.fromString(propertyId);
        if (uuid == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        plant.getProperties().removeIf(p -> p.getId().equals(uuid));
        return plantRepository.save(plant);
    }
}
