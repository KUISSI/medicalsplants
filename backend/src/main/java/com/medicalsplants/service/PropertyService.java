package com.medicalsplants.service;

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
import com.medicalsplants.model.dto.request.PropertyRequest;
import com.medicalsplants.model.dto.response.PropertyResponse;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Property;
import com.medicalsplants.model.mapper.PropertyMapper;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.PropertyRepository;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PlantRepository plantRepository;
    private final PropertyMapper propertyMapper;

    public PropertyService(PropertyRepository propertyRepository, PlantRepository plantRepository, PropertyMapper propertyMapper) {
        this.propertyRepository = propertyRepository;
        this.plantRepository = plantRepository;
        this.propertyMapper = propertyMapper;
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> getAllProperties(Pageable pageable) {
        return propertyRepository.findAll(java.util.Objects.requireNonNull(pageable, "Pageable cannot be null"))
                .map(propertyMapper::toDto);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(UUID id) {
        if (id == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id.toString()));
        return propertyMapper.toDto(property);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPropertiesBySymptomId(UUID symptomId) {
        // À adapter selon ta logique métier et repository
        return propertyRepository.findBySymptomId(symptomId)
                .stream()
                .map(propertyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPropertiesByFamily(String family) {
        // À adapter selon ta logique métier et repository
        return propertyRepository.findByFamily(family)
                .stream()
                .map(propertyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllFamilies() {
        // À adapter selon ta logique métier et repository
        return propertyRepository.findAllFamilies();
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest propertyRequest) {
        if (propertyRequest == null) {
            throw new BadRequestException("Property request cannot be null");
        }
        if (propertyRepository.existsByTitle(propertyRequest.getTitle())) {
            throw new ConflictException("A property with this title already exists");
        }

        Property property = new Property();
        property.setId(UUID.randomUUID());
        property.setTitle(propertyRequest.getTitle());
        property.setDescription(propertyRequest.getDescription());

        // Gestion des plantes associées (UUID)
        Set<UUID> plantIds = propertyRequest.getPlantIds();
        if (plantIds != null && !plantIds.isEmpty()) {
            for (UUID plantId : plantIds) {
                Plant plant = plantRepository.findById(plantId)
                        .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId.toString()));
                property.getPlants().add(plant);
            }
        }

        return propertyMapper.toDto(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse updateProperty(UUID id, PropertyRequest propertyRequest) {
        if (propertyRequest == null) {
            throw new BadRequestException("Property request cannot be null");
        }
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id.toString()));

        if (!property.getTitle().equals(propertyRequest.getTitle()) && propertyRepository.existsByTitle(propertyRequest.getTitle())) {
            throw new ConflictException("A property with this title already exists");
        }

        property.setTitle(propertyRequest.getTitle());
        property.setDescription(propertyRequest.getDescription());

        // Mise à jour des plantes associées (UUID)
        Set<UUID> plantIds = propertyRequest.getPlantIds();
        if (plantIds != null) {
            property.getPlants().clear();
            for (UUID plantId : plantIds) {
                Plant plant = plantRepository.findById(plantId)
                        .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId.toString()));
                property.getPlants().add(plant);
            }
        }

        return propertyMapper.toDto(propertyRepository.save(property));
    }

    @Transactional
    public void deleteProperty(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id.toString()));
        propertyRepository.delete(property);
    }

    @Transactional(readOnly = true)
    public Property getPropertyEntityById(UUID id) {
        if (id == null) {
            throw new BadRequestException("Property id cannot be null");
        }
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id.toString()));
    }

    @Transactional(readOnly = true)
    public Set<Property> resolveProperties(Set<UUID> propertyUuids) {
        return propertyUuids.stream()
                .map(this::getPropertyEntityById)
                .collect(Collectors.toSet());
    }
}
