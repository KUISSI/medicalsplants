package com.medicalsplants.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.dto.request.PlantRequest;
import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.mapper.PlantMapper;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.PropertyRepository;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final PropertyRepository propertyRepository;
    private final PlantMapper plantMapper;

    public PlantService(PlantRepository plantRepository, PropertyRepository propertyRepository, PlantMapper plantMapper) {
        this.plantRepository = plantRepository;
        this.propertyRepository = propertyRepository;
        this.plantMapper = plantMapper;
    }

    @Transactional(readOnly = true)
    public PlantResponse getPlantById(UUID id) {
        if (id == null) {
            throw new BadRequestException("Plant id cannot be null");
        }
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id.toString()));
        return plantMapper.toDto(plant);
    }

    @Transactional(readOnly = true)
    public Page<PlantResponse> getPlantsBySymptomId(UUID symptomId, Pageable pageable) {
        if (symptomId == null) {
            throw new BadRequestException("Symptom id cannot be null");
        }
        return plantRepository.findBySymptomId(symptomId, pageable)
                .map(plantMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getPlantsByPropertyId(UUID propertyId) {
        if (propertyId == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        return plantRepository.findByPropertyId(propertyId)
                .stream()
                .map(plantMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlantResponse createPlant(PlantRequest plantRequest) {
        if (plantRequest == null) {
            throw new BadRequestException("Plant request cannot be null");
        }
        if (plantRepository.existsByTitle(plantRequest.getTitle())) {
            throw new ConflictException("A plant with this title already exists");
        }

        Plant plant = new Plant();
        plant.setId(UUID.randomUUID());
        plant.setTitle(plantRequest.getTitle());
        plant.setDescription(plantRequest.getDescription());

        Set<UUID> propertyIds = plantRequest.getPropertyIds();
        if (propertyIds != null && !propertyIds.isEmpty()) {
            for (UUID propertyId : propertyIds) {
                Property property = propertyRepository.findById(propertyId)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId.toString()));
                plant.getProperties().add(property);
            }
        }

        return plantMapper.toDto(plantRepository.save(plant));
    }

    @Transactional
    public PlantResponse updatePlant(UUID id, PlantRequest plantRequest) {
        if (plantRequest == null) {
            throw new BadRequestException("Plant request cannot be null");
        }
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id.toString()));

        if (!plant.getTitle().equals(plantRequest.getTitle()) && plantRepository.existsByTitle(plantRequest.getTitle())) {
            throw new ConflictException("A plant with this title already exists");
        }

        plant.setTitle(plantRequest.getTitle());
        plant.setDescription(plantRequest.getDescription());

        Set<UUID> propertyIds = plantRequest.getPropertyIds();
        if (propertyIds != null && !propertyIds.isEmpty()) {
            plant.getProperties().clear();
            for (UUID propertyId : propertyIds) {
                Property property = propertyRepository.findById(propertyId)
                        .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId.toString()));
                plant.getProperties().add(property);
            }
        }

        return plantMapper.toDto(plantRepository.save(plant));
    }

    @Transactional
    public void deletePlant(UUID id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id.toString()));
        plantRepository.delete(plant);
    }

    @Transactional
    public PlantResponse addPropertyToPlant(UUID plantId, UUID propertyId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId.toString()));
        if (propertyId == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId.toString()));

        plant.getProperties().add(property);
        return plantMapper.toDto(plantRepository.save(plant));
    }

    @Transactional
    public PlantResponse removePropertyFromPlant(UUID plantId, UUID propertyId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId.toString()));
        if (propertyId == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        plant.getProperties().removeIf(p -> p.getId().equals(propertyId));
        return plantMapper.toDto(plantRepository.save(plant));
    }

    @Transactional(readOnly = true)
    public Plant getPlantEntityById(UUID id) {
        if (id == null) {
            throw new BadRequestException("Plant id cannot be null");
        }
        return plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id.toString()));
    }

    @Transactional(readOnly = true)
    public Page<PlantResponse> getAllPlants(Pageable pageable, String search) {
        if (search != null && !search.isBlank()) {
            return plantRepository.search(search, pageable)
                    .map(plantMapper::toDto);
        } else {
            return plantRepository.findAll(pageable)
                    .map(plantMapper::toDto);
        }
    }

    @Transactional(readOnly = true)
    public Set<Plant> resolvePlants(Set<UUID> plantUuids) {
        return plantUuids.stream()
                .map(this::getPlantEntityById)
                .collect(Collectors.toSet());
    }
}
