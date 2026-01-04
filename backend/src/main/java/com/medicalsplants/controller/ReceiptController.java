package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.enums.ReceiptType;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.ReceiptService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/receipts")
@Tag(name = "Receipts", description = "Recipe management endpoints")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @Operation(summary = "Get published recipes (paginated)")
    @GetMapping
    public ResponseEntity<Page<Receipt>> getPublishedReceipts(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Receipt> receipts = receiptService.getPublishedReceipts(canSeePremium, pageable);
        return ResponseEntity.ok(receipts);
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.getReceiptById(id, currentUser);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<Receipt>> getReceiptsByPlantId(
            @PathVariable String plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Receipt> receipts = receiptService.getReceiptsByPlantId(plantId, canSeePremium, pageable);
        return ResponseEntity.ok(receipts);
    }

    @Operation(summary = "Get pending recipes (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<Receipt>> getPendingReceipts() {
        List<Receipt> receipts = receiptService.getPendingReceipts();
        return ResponseEntity.ok(receipts);
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Receipt> createReceipt(@RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(required = false) Set<String> plantIds,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.createReceipt(title, type, description, isPremium, plantIds, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Receipt> updateReceipt(@PathVariable String id,
            @RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.updateReceipt(id, title, type, description, isPremium, currentUser);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<Receipt> submitForReview(@PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.submitForReview(id, currentUser);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Approve a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<Receipt> approveReceipt(@PathVariable String id) {
        Receipt receipt = receiptService.approveReceipt(id);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Reject a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<Receipt> rejectReceipt(@PathVariable String id) {
        Receipt receipt = receiptService.rejectReceipt(id);
        return ResponseEntity.ok(receipt);
    }

    @Operation(summary = "Delete a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        receiptService.deleteReceipt(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
