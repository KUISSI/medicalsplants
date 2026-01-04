package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.enums.AdministrationMode;
import com.medicalsplants.service.PlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/plants")
@Tag(name = "Plants", description = "Plant management endpoints")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;

    @Operation(summary = "Get all plants (paginated)")
    @GetMapping
    public ResponseEntity<Page<Plant>> getAllPlants(@PageableDefault(size = 20) Pageable pageable) {
        Page<Plant> plants = plantService.getAllPlants(pageable);
        return ResponseEntity.ok(plants);
    }

    @Operation(summary = "Get plant by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(@PathVariable String id) {
        Plant plant = plantService.getPlantById(id);
        return ResponseEntity.ok(plant);
    }

    @Operation(summary = "Get plants by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<Page<Plant>> getPlantsBySymptomId(@PathVariable String symptomId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Plant> plants = plantService.getPlantsBySymptomId(symptomId, pageable);
        return ResponseEntity.ok(plants);
    }

    @Operation(summary = "Get plants by property ID")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Plant>> getPlantsByPropertyId(@PathVariable String propertyId) {
        List<Plant> plants = plantService.getPlantsByPropertyId(propertyId);
        return ResponseEntity.ok(plants);
    }

    @Operation(summary = "Create a new plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Plant> createPlant(@RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam AdministrationMode administrationMode,
            @RequestParam(required = false) String consumedPart,
            @RequestParam(required = false) Set<String> propertyIds) {
        Plant plant = plantService.createPlant(title, description, administrationMode, consumedPart, propertyIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(plant);
    }

    @Operation(summary = "Update a plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Plant> updatePlant(@PathVariable String id,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam AdministrationMode administrationMode,
            @RequestParam(required = false) String consumedPart) {
        Plant plant = plantService.updatePlant(id, title, description, administrationMode, consumedPart);
        return ResponseEntity.ok(plant);
    }

    @Operation(summary = "Delete a plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable String id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add property to plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<Plant> addPropertyToPlant(@PathVariable String id,
            @PathVariable String propertyId) {
        Plant plant = plantService.addPropertyToPlant(id, propertyId);
        return ResponseEntity.ok(plant);
    }

    @Operation(summary = "Remove property from plant (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<Plant> removePropertyFromPlant(@PathVariable String id,
            @PathVariable String propertyId) {
        Plant plant = plantService.removePropertyFromPlant(id, propertyId);
        return ResponseEntity.ok(plant);
    }
}
