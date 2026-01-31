package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Property;
import com.medicalsplants.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
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
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @Operation(summary = "Get property by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @Operation(summary = "Get properties by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<List<Property>> getPropertiesBySymptomId(@PathVariable UUID symptomId) {
        return ResponseEntity.ok(propertyService.getPropertiesBySymptomId(symptomId));
    }

    @Operation(summary = "Create a new property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestParam String title,
            @RequestParam String propertyFamily,
            @RequestParam(required = false) String propertyDetail,
            @RequestParam(required = false) Set<String> symptomIds) {
        Property property = propertyService.createProperty(title, propertyFamily, propertyDetail, symptomIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

    @Operation(summary = "Update a property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam String propertyFamily,
            @RequestParam(required = false) String propertyDetail) {
        Property property = propertyService.updateProperty(id, title, propertyFamily, propertyDetail);
        return ResponseEntity.ok(property);
    }

    @Operation(summary = "Delete a property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add symptom to property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/symptoms/{symptomId}")
    public ResponseEntity<Property> addSymptomToProperty(
            @PathVariable UUID id,
            @PathVariable UUID symptomId) {
        Property property = propertyService.addSymptomToProperty(id, symptomId);
        return ResponseEntity.ok(property);
    }

    @Operation(summary = "Remove symptom from property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/symptoms/{symptomId}")
    public ResponseEntity<Property> removeSymptomFromProperty(
            @PathVariable UUID id,
            @PathVariable UUID symptomId) {
        Property property = propertyService.removeSymptomFromProperty(id, symptomId);
        return ResponseEntity.ok(property);
    }
}
