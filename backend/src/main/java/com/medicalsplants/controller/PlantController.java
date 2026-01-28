package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.model.mapper.PlantMapper;
import com.medicalsplants.service.PlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plants")
@Tag(name = "Plants", description = "Plant management endpoints")
public class PlantController {

    private final PlantService plantService;
    private final PlantMapper plantMapper;

    public PlantController(PlantService plantService, PlantMapper plantMapper) {
        this.plantService = plantService;
        this.plantMapper = plantMapper;
    }

    @Operation(summary = "Get all plants (paginated)")
    @GetMapping
    public ResponseEntity<Page<PlantResponse>> getAllPlants(@PageableDefault(size = 20) Pageable pageable) {
        Page<PlantResponse> dtoPage = plantService.getAllPlants(pageable).map(plantMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get plant by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PlantResponse> getPlantById(@PathVariable UUID id) {
        Plant plant = plantService.getPlantById(id.toString());
        return ResponseEntity.ok(plantMapper.toDto(plant));
    }

    @Operation(summary = "Get plants by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<Page<PlantResponse>> getPlantsBySymptomId(@PathVariable UUID symptomId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PlantResponse> dtoPage = plantService.getPlantsBySymptomId(symptomId.toString(), pageable).map(plantMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get plants by property ID")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PlantResponse>> getPlantsByPropertyId(@PathVariable UUID propertyId) {
        List<Plant> plants = plantService.getPlantsByPropertyId(propertyId.toString());
        List<PlantResponse> dtoList = plants.stream().map(plantMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @Operation(summary = "Create a new plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PlantResponse> createPlant(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<String> propertyIds) {
        Plant plant = plantService.createPlant(title, description, propertyIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(plantMapper.toDto(plant));
    }

    @Operation(summary = "Update a plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlantResponse> updatePlant(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam(required = false) String description) {
        Plant plant = plantService.updatePlant(id.toString(), title, description);
        return ResponseEntity.ok(plantMapper.toDto(plant));
    }

    @Operation(summary = "Delete a plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable UUID id) {
        plantService.deletePlant(id.toString());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add property to plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<PlantResponse> addPropertyToPlant(
            @PathVariable UUID id,
            @PathVariable UUID propertyId) {
        Plant plant = plantService.addPropertyToPlant(id.toString(), propertyId.toString());
        return ResponseEntity.ok(plantMapper.toDto(plant));
    }

    @Operation(summary = "Remove property from plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<PlantResponse> removePropertyFromPlant(
            @PathVariable UUID id,
            @PathVariable UUID propertyId) {
        Plant plant = plantService.removePropertyFromPlant(id.toString(), propertyId.toString());
        return ResponseEntity.ok(plantMapper.toDto(plant));
    }
}
