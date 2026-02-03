package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.SymptomRequest;
import com.medicalsplants.model.dto.response.SymptomResponse;
import com.medicalsplants.service.SymptomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<SymptomResponse>> getAllSymptoms() {
        return ResponseEntity.ok(symptomService.getAllSymptoms());
    }

    @Operation(summary = "Get symptom by ID")
    @GetMapping("/{id}")
    public ResponseEntity<SymptomResponse> getSymptomById(@PathVariable String id) {
        return ResponseEntity.ok(symptomService.getSymptomById(id));
    }

    @Operation(summary = "Get symptoms by family")
    @GetMapping("/family/{family}")
    public ResponseEntity<List<SymptomResponse>> getSymptomsByFamily(@PathVariable String family) {
        return ResponseEntity.ok(symptomService.getSymptomsByFamily(family));
    }

    @Operation(summary = "Get all symptom families")
    @GetMapping("/families")
    public ResponseEntity<List<String>> getAllFamilies() {
        return ResponseEntity.ok(symptomService.getAllFamilies());
    }

    @Operation(summary = "Get symptoms grouped by family")
    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<SymptomResponse>>> getSymptomsGroupedByFamily() {
        return ResponseEntity.ok(symptomService.getSymptomsGroupedByFamily());
    }

    @Operation(summary = "Create a new symptom")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping
    public ResponseEntity<SymptomResponse> createSymptom(@Valid @RequestBody SymptomRequest request) {
        SymptomResponse created = symptomService.createSymptom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a symptom")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PutMapping("/{id}")
    public ResponseEntity<SymptomResponse> updateSymptom(
            @PathVariable String id,
            @Valid @RequestBody SymptomRequest request) {
        return ResponseEntity.ok(symptomService.updateSymptom(id, request));
    }

    @Operation(summary = "Delete a symptom")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable String id) {
        symptomService.deleteSymptom(id);
        return ResponseEntity.noContent().build();
    }
}
