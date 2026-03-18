package com.medicalsplants.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicalsplants.model.dto.request.RecipeRequest;
import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.RecipeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/recipes")
@Tag(name = "Recipes", description = "Recipe management endpoints")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @Operation(summary = "Get published recipes (paginated)")
    @GetMapping
    public ResponseEntity<Page<RecipeResponse>> getPublishedRecipes(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.premium();
        return ResponseEntity.ok(recipeService.getPublishedRecipes(canSeePremium, pageable));
    }

    @Operation(summary = "Search recipes by title")
    @GetMapping("/search")
    public ResponseEntity<Page<RecipeResponse>> searchRecipes(
            @RequestParam String q,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.premium();
        return ResponseEntity.ok(recipeService.searchRecipes(q, canSeePremium, pageable));
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.getRecipeById(id, currentUser));
    }

    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByPlantId(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.premium();
        return ResponseEntity.ok(recipeService.getRecipesByPlantId(plantId, canSeePremium, pageable));
    }

    @Operation(summary = "Get my recipes")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/my")
    public ResponseEntity<Page<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(recipeService.getRecipesByAuthor(currentUser.getId(), pageable));
    }

    @Operation(summary = "Get pending recipes (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/pending")
    public ResponseEntity<List<RecipeResponse>> getpendingRecipes() {
        return ResponseEntity.ok(recipeService.getpendingRecipes());
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody RecipeRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        RecipeResponse created = recipeService.createRecipe(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable UUID id,
            @Valid @RequestBody RecipeRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, request, currentUser));
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<RecipeResponse> submitForReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.submitForReview(id, currentUser));
    }

    @Operation(summary = "Approve a recipe (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<RecipeResponse> approveRecipe(@PathVariable UUID id) {
        return ResponseEntity.ok(recipeService.approveRecipe(id));
    }

    @Operation(summary = "Archive a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/archive")
    public ResponseEntity<RecipeResponse> archiveRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.archiveRecipe(id, currentUser));
    }

    @Operation(summary = "Delete a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        recipeService.deleteRecipe(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<RecipeResponse>> getAllRecipes(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 100) Pageable pageable) {
        return ResponseEntity.ok(recipeService.getAllRecipes(status, pageable));
    }
}
