package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.enums.ReceiptType;
import com.medicalsplants.model.dto.response.ReceiptResponse;
import com.medicalsplants.model.mapper.ReceiptMapper;
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
    private final ReceiptMapper receiptMapper;

    public ReceiptController(ReceiptService receiptService, ReceiptMapper receiptMapper) {
        this.receiptService = receiptService;
        this.receiptMapper = receiptMapper;
    }

    @Operation(summary = "Get published recipes (paginated)")
    @GetMapping
    public ResponseEntity<Page<ReceiptResponse>> getPublishedReceipts(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Receipt> receipts = receiptService.getPublishedReceipts(canSeePremium, pageable);
        Page<ReceiptResponse> dtoPage = receipts.map(receiptMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ReceiptResponse> getReceiptById(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.getReceiptById(id.toString(), currentUser);
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<ReceiptResponse>> getReceiptsByPlantId(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Receipt> receipts = receiptService.getReceiptsByPlantId(plantId.toString(), canSeePremium, pageable);
        Page<ReceiptResponse> dtoPage = receipts.map(receiptMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get pending recipes (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<ReceiptResponse>> getPendingReceipts() {
        List<Receipt> receipts = receiptService.getPendingReceipts();
        List<ReceiptResponse> dtoList = receipts.stream().map(receiptMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ReceiptResponse> createReceipt(
            @RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(required = false) Set<String> plantIds,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.createReceipt(title, type, description, isPremium, plantIds, currentUser.getId().toString());
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ReceiptResponse> updateReceipt(
            @PathVariable UUID id,
            @RequestParam String title,
            @RequestParam ReceiptType type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPremium,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.updateReceipt(id.toString(), title, type, description, isPremium, currentUser);
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<ReceiptResponse> submitForReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Receipt receipt = receiptService.submitForReview(id.toString(), currentUser);
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Approve a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<ReceiptResponse> approveReceipt(@PathVariable UUID id) {
        Receipt receipt = receiptService.approveReceipt(id.toString());
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Reject a recipe (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<ReceiptResponse> rejectReceipt(@PathVariable UUID id) {
        Receipt receipt = receiptService.rejectReceipt(id.toString());
        ReceiptResponse dto = receiptMapper.toDto(receipt);
        return ResponseEntity.ok(dto);
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
