package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.PropertyRequest;
import com.medicalsplants.model.dto.response.PropertyResponse;
import com.medicalsplants.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/properties")
@Tag(name = "Properties", description = "Property management endpoints")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @Operation(summary = "Get all properties")
    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @Operation(summary = "Get property by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @Operation(summary = "Get properties by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<List<PropertyResponse>> getPropertiesBySymptomId(@PathVariable UUID symptomId) {
        return ResponseEntity.ok(propertyService.getPropertiesBySymptomId(symptomId));
    }

    @Operation(summary = "Get properties by family")
    @GetMapping("/family/{family}")
    public ResponseEntity<List<PropertyResponse>> getPropertiesByFamily(@PathVariable String family) {
        return ResponseEntity.ok(propertyService.getPropertiesByFamily(family));
    }

    @Operation(summary = "Get all property families")
    @GetMapping("/families")
    public ResponseEntity<List<String>> getAllFamilies() {
        return ResponseEntity.ok(propertyService.getAllFamilies());
    }

    @Operation(summary = "Create a new property")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(@Valid @RequestBody PropertyRequest request) {
        PropertyResponse created = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a property")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable UUID id,
            @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request));
    }

    @Operation(summary = "Delete a property")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
