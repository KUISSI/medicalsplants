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
        List<Symptom> symptoms = symptomService.getAllSymptoms();
        return ResponseEntity.ok(symptoms);
    }

    @Operation(summary = "Get symptom by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Symptom> getSymptomById(@PathVariable String id) {
        Symptom symptom = symptomService.getSymptomById(id);
        return ResponseEntity.ok(symptom);
    }

    @Operation(summary = "Get symptoms by family")
    @GetMapping("/family/{family}")
    public ResponseEntity<List<Symptom>> getSymptomsByFamily(@PathVariable String family) {
        List<Symptom> symptoms = symptomService.getSymptomsByFamily(family);
        return ResponseEntity.ok(symptoms);
    }

    @Operation(summary = "Get all symptom families")
    @GetMapping("/families")
    public ResponseEntity<List<String>> getAllFamilies() {
        List<String> families = symptomService.getAllFamilies();
        return ResponseEntity.ok(families);
    }

    @Operation(summary = "Get symptoms grouped by family")
    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Symptom>>> getSymptomsGroupedByFamily() {
        Map<String, List<Symptom>> grouped = symptomService.getSymptomsGroupedByFamily();
        return ResponseEntity.ok(grouped);
    }

    @Operation(summary = "Create a new symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Symptom> createSymptom(@RequestParam String title,
            @RequestParam String symptomFamily,
            @RequestParam(required = false) String symptomDetail) {
        Symptom symptom = symptomService.createSymptom(title, symptomFamily, symptomDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(symptom);
    }

    @Operation(summary = "Update a symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Symptom> updateSymptom(@PathVariable String id,
            @RequestParam String title,
            @RequestParam String symptomFamily,
            @RequestParam(required = false) String symptomDetail) {
        Symptom symptom = symptomService.updateSymptom(id, title, symptomFamily, symptomDetail);
        return ResponseEntity.ok(symptom);
    }

    @Operation(summary = "Delete a symptom (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable String id) {
        symptomService.deleteSymptom(id);
        return ResponseEntity.noContent().build();
    }
}
