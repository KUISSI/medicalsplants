package com.medicalsplants.service;

import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.dto.request.PlantRequest;
import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.mapper.PlantMapper;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final PropertyRepository propertyRepository;
    private final PlantMapper plantMapper;

    public PlantService(PlantRepository plantRepository,
            PropertyRepository propertyRepository,
            PlantMapper plantMapper) {
        this.plantRepository = plantRepository;
        this.propertyRepository = propertyRepository;
        this.plantMapper = plantMapper;
    }

    @Transactional(readOnly = true)
    public Page<PlantResponse> getAllPlants(Pageable pageable) {
        return plantRepository.findAll(pageable)
                .map(plantMapper::toDto);
    }

    @Transactional(readOnly = true)
    public PlantResponse getPlantById(String id) {
        UUID uuid = UUID.fromString(id);
        Plant plant = plantRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        return plantMapper.toDto(plant);
    }

    @Transactional(readOnly = true)
    public Page<PlantResponse> getPlantsBySymptomId(String symptomId, Pageable pageable) {
        UUID uuid = UUID.fromString(symptomId);
        return plantRepository.findBySymptomId(uuid, pageable)
                .map(plantMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getPlantsByPropertyId(String propertyId) {
        UUID uuid = UUID.fromString(propertyId);
        return plantRepository.findByPropertyId(uuid)
                .stream()
                .map(plantMapper::toDto)
                .toList();
    }

    @Transactional
    public PlantResponse createPlant(PlantRequest request) {
        if (plantRepository.existsByTitle(request.getTitle())) {
            throw new ConflictException("A plant with this title already exists");
        }

        Plant plant = plantMapper.toEntity(request);
        plant.setId(UUID.randomUUID());

        // Associer les propriétés
        if (request.getPropertyIds() != null && !request.getPropertyIds().isEmpty()) {
            Set<Property> properties = new HashSet<>();
            for (String propertyId : request.getPropertyIds()) {
                UUID uuid = UUID.fromString(propertyId);
                Property property = propertyRepository.findById(uuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
                properties.add(property);
            }
            plant.setProperties(properties);
        }

        Plant saved = plantRepository.save(plant);
        return plantMapper.toDto(saved);
    }

    @Transactional
    public PlantResponse updatePlant(String id, PlantRequest request) {
        UUID uuid = UUID.fromString(id);
        Plant plant = plantRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));

        if (!plant.getTitle().equals(request.getTitle()) && plantRepository.existsByTitle(request.getTitle())) {
            throw new ConflictException("A plant with this title already exists");
        }

        plant.setTitle(request.getTitle());
        plant.setDescription(request.getDescription());
        plant.setHistory(request.getHistory());
        plant.setImageUrl(request.getImageUrl());

        // Mettre à jour les propriétés si fournis
        if (request.getPropertyIds() != null) {
            Set<Property> properties = new HashSet<>();
            for (String propertyId : request.getPropertyIds()) {
                UUID propUuid = UUID.fromString(propertyId);
                Property property = propertyRepository.findById(propUuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
                properties.add(property);
            }
            plant.setProperties(properties);
        }

        Plant saved = plantRepository.save(plant);
        return plantMapper.toDto(saved);
    }

    @Transactional
    public void deletePlant(String id) {
        UUID uuid = UUID.fromString(id);
        if (!plantRepository.existsById(uuid)) {
            throw new ResourceNotFoundException("Plant", "id", id);
        }
        plantRepository.deleteById(uuid);
    }

    @Transactional
    public PlantResponse addPropertyToPlant(String plantId, String propertyId) {
        UUID plantUuid = UUID.fromString(plantId);
        UUID propUuid = UUID.fromString(propertyId);

        Plant plant = plantRepository.findById(plantUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));
        Property property = propertyRepository.findById(propUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        plant.getProperties().add(property);
        Plant saved = plantRepository.save(plant);
        return plantMapper.toDto(saved);
    }

    @Transactional
    public PlantResponse removePropertyFromPlant(String plantId, String propertyId) {
        UUID plantUuid = UUID.fromString(plantId);
        UUID propUuid = UUID.fromString(propertyId);

        Plant plant = plantRepository.findById(plantUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));

        plant.getProperties().removeIf(p -> p.getId().equals(propUuid));
        Plant saved = plantRepository.save(plant);
        return plantMapper.toDto(saved);
    }
}
