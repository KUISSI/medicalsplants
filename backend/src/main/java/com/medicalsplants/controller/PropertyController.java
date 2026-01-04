package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Property;
import com.medicalsplants.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/properties")
@Tag(name = "Properties", description = "Property management endpoints")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @Operation(summary = "Get all properties")
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @Operation(summary = "Get property by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        Property property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @Operation(summary = "Get properties by symptom ID")
    @GetMapping("/symptom/{symptomId}")
    public ResponseEntity<List<Property>> getPropertiesBySymptomId(@PathVariable String symptomId) {
        List<Property> properties = propertyService.getPropertiesBySymptomId(symptomId);
        return ResponseEntity.ok(properties);
    }

    @Operation(summary = "Create a new property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestParam String title,
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
    public ResponseEntity<Property> updateProperty(@PathVariable String id,
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
    public ResponseEntity<Void> deleteProperty(@PathVariable String id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add symptom to property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/symptoms/{symptomId}")
    public ResponseEntity<Property> addSymptomToProperty(@PathVariable String id,
            @PathVariable String symptomId) {
        Property property = propertyService.addSymptomToProperty(id, symptomId);
        return ResponseEntity.ok(property);
    }

    @Operation(summary = "Remove symptom from property (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/symptoms/{symptomId}")
    public ResponseEntity<Property> removeSymptomFromProperty(@PathVariable String id,
            @PathVariable String symptomId) {
        Property property = propertyService.removeSymptomFromProperty(id, symptomId);
        return ResponseEntity.ok(property);
    }
}
