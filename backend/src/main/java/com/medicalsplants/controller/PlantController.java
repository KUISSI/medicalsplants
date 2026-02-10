package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.PlantRequest;
import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.service.PlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

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
    public ResponseEntity<Page<PlantResponse>> getAllPlants(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(plantService.getAllPlants(pageable));
    }

    @Operation(summary = "Get plant by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PlantResponse> getPlantById(@PathVariable UUID id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    @Operation(summary = "Get plants by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<Page<PlantResponse>> getPlantsBySymptomId(
            @PathVariable String symptomId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(plantService.getPlantsBySymptomId(symptomId, pageable));
    }

    @Operation(summary = "Get plants by property ID")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PlantResponse>> getPlantsByPropertyId(@PathVariable String propertyId) {
        return ResponseEntity.ok(plantService.getPlantsByPropertyId(propertyId));
    }

    @Operation(summary = "Create a new plant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PlantResponse> createPlant(@Valid @RequestBody PlantRequest request) {
        PlantResponse created = plantService.createPlant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a plant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlantResponse> updatePlant(
            @PathVariable String id,
            @Valid @RequestBody PlantRequest request) {
        return ResponseEntity.ok(plantService.updatePlant(id, request));
    }

    @Operation(summary = "Delete a plant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable String id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add property to plant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<PlantResponse> addPropertyToPlant(
            @PathVariable String id,
            @PathVariable String propertyId) {
        return ResponseEntity.ok(plantService.addPropertyToPlant(id, propertyId));
    }

    @Operation(summary = "Remove property from plant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/properties/{propertyId}")
    public ResponseEntity<PlantResponse> removePropertyFromPlant(
            @PathVariable String id,
            @PathVariable String propertyId) {
        return ResponseEntity.ok(plantService.removePropertyFromPlant(id, propertyId));
    }
}
