package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.enums.ReceiptType;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.ReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/receipts")
@Tag(name = "Receipts", description = "Recipe management endpoints")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @Operation(summary = "Get published recipes (paginated)")
    @GetMapping
    public ResponseEntity<Page<Receipt>> getPublishedReceipts(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        return ResponseEntity.ok(receiptService.getPublishedReceipts(canSeePremium, pageable));
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(receiptService.getReceiptById(id.toString(), currentUser));
    }

    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<Receipt>> getReceiptsByPlantId(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        return ResponseEntity.ok(receiptService.getReceiptsByPlantId(plantId.toString(), canSeePremium, pageable));
    }

    @Operation(summary = "Get pending recipes (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<Receipt>> getPendingReceipts() {
        return ResponseEntity.ok(receiptService.getPendingReceipts());
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Receipt> createReceipt(
            @RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(required = false) Set<String> plantIds,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.createReceipt(title, type, description, isPremium, plantIds, currentUser.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.updateReceipt(id.toString(), title, type, description, isPremium, currentUser);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<Receipt> submitForReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.submitForReview(id.toString(), currentUser);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Approve a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<Receipt> approveReceipt(@PathVariable UUID id) {
        Receipt receipt = receiptService.approveReceipt(id.toString());
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Reject a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<Receipt> rejectReceipt(@PathVariable UUID id) {
        Receipt receipt = receiptService.rejectReceipt(id.toString());
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Delete a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        receiptService.deleteReceipt(id.toString(), currentUser);
        return ResponseEntity.noContent().build();
    }
}
