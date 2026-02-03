package com.medicalsplants.controller;

import com.medicalsplants.model.dto.request.RecipeRequest;
import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        return ResponseEntity.ok(recipeService.getPublishedRecipes(canSeePremium, pageable));
    }

    @Operation(summary = "Search recipes by title")
    @GetMapping("/search")
    public ResponseEntity<Page<RecipeResponse>> searchRecipes(
            @RequestParam String q,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        return ResponseEntity.ok(recipeService.searchRecipes(q, canSeePremium, pageable));
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.getRecipeById(id, currentUser));
    }

    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByPlantId(
            @PathVariable String plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        return ResponseEntity.ok(recipeService.getRecipesByPlantId(plantId, canSeePremium, pageable));
    }

    @Operation(summary = "Get my recipes")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/my")
    public ResponseEntity<Page<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(recipeService.getRecipesByAuthor(currentUser.getId().toString(), pageable));
    }

    @Operation(summary = "Get pending recipes (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/pending")
    public ResponseEntity<List<RecipeResponse>> getPendingRecipes() {
        return ResponseEntity.ok(recipeService.getPendingRecipes());
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody RecipeRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        RecipeResponse created = recipeService.createRecipe(request, currentUser.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable String id,
            @Valid @RequestBody RecipeRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, request, currentUser));
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<RecipeResponse> submitForReview(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.submitForReview(id, currentUser));
    }

    @Operation(summary = "Approve a recipe (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<RecipeResponse> approveRecipe(@PathVariable String id) {
        return ResponseEntity.ok(recipeService.approveRecipe(id));
    }

    @Operation(summary = "Archive a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/archive")
    public ResponseEntity<RecipeResponse> archiveRecipe(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recipeService.archiveRecipe(id, currentUser));
    }

    @Operation(summary = "Delete a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        recipeService.deleteRecipe(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
