package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Symptom;
import com.medicalsplants.service.SymptomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/symptoms")
@Tag(name = "Symptoms", description = "Symptom management endpoints")
public class SymptomController {

    private final SymptomService symptomService;

    public SymptomController(SymptomService symptomService) {
        this.symptomService = symptomService;
    }

    @Operation(summary = "Get all symptoms")
    @GetMapping
    public ResponseEntity<List<Symptom>> getAllSymptoms() {
        return ResponseEntity.ok(symptomService.getAllSymptoms());
    }

    @Operation(summary = "Get symptom by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Symptom> getSymptomById(@PathVariable UUID id) {
        return ResponseEntity.ok(symptomService.getSymptomById(id.toString()));
    }

    @Operation(summary = "Get symptoms by family")
    @GetMapping("/family/{family}")
    public ResponseEntity<List<Symptom>> getSymptomsByFamily(@PathVariable String family) {
        return ResponseEntity.ok(symptomService.getSymptomsByFamily(family));
    }

    @Operation(summary = "Get all symptom families")
    @GetMapping("/families")
    public ResponseEntity<List<String>> getAllFamilies() {
        return ResponseEntity.ok(symptomService.getAllFamilies());
    }

    @Operation(summary = "Get symptoms grouped by family")
    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Symptom>>> getSymptomsGroupedByFamily() {
        return ResponseEntity.ok(symptomService.getSymptomsGroupedByFamily());
    }

    @Operation(summary = "Create a new symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Symptom> createSymptom(
            @RequestParam String title,
            @RequestParam String symptomFamily,
            @RequestParam(required = false) String symptomDetail) {
        Symptom symptom = symptomService.createSymptom(title, symptomFamily, symptomDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(symptom);
    }

    @Operation(summary = "Update a symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Symptom> updateSymptom(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam String symptomFamily,
            @RequestParam(required = false) String symptomDetail) {
        Symptom symptom = symptomService.updateSymptom(id.toString(), title, symptomFamily, symptomDetail);
        return ResponseEntity.ok(symptom);
    }

    @Operation(summary = "Delete a symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable UUID id) {
        symptomService.deleteSymptom(id.toString());
        return ResponseEntity.noContent().build();
    }
}
