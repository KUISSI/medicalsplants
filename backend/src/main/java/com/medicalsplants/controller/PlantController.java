package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Plant;
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

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @Operation(summary = "Get all plants (paginated)")
    @GetMapping
    public ResponseEntity<Page<Plant>> getAllPlants(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(plantService.getAllPlants(pageable));
    }

    @Operation(summary = "Get plant by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(@PathVariable UUID id) {
        return ResponseEntity.ok(plantService.getPlantById(id.toString()));
    }

    @Operation(summary = "Get plants by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<Page<Plant>> getPlantsBySymptomId(@PathVariable UUID symptomId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(plantService.getPlantsBySymptomId(symptomId.toString(), pageable));
    }

    @Operation(summary = "Get plants by property ID")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Plant>> getPlantsByPropertyId(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(plantService.getPlantsByPropertyId(propertyId.toString()));
    }

    @Operation(summary = "Create a new plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Plant> createPlant(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<String> propertyIds) {
        Plant plant = plantService.createPlant(title, description, propertyIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(plant);
    }

    @Operation(summary = "Update a plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Plant> updatePlant(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam(required = false) String description) {
        Plant plant = plantService.updatePlant(id.toString(), title, description);
        return ResponseEntity.ok(plant);
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
    public ResponseEntity<Plant> addPropertyToPlant(
            @PathVariable UUID id,
            @PathVariable UUID propertyId) {
        Plant plant = plantService.addPropertyToPlant(id.toString(), propertyId.toString());
        return ResponseEntity.ok(plant);
    }

    @Operation(summary = "Remove property from plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<Plant> removePropertyFromPlant(
            @PathVariable UUID id,
            @PathVariable UUID propertyId) {
        Plant plant = plantService.removePropertyFromPlant(id.toString(), propertyId.toString());
        return ResponseEntity.ok(plant);
    }
}
