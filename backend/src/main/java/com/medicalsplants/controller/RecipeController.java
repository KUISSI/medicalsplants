package com.medicalsplants.controller;

import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.enums.RecipeType;
import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.model.mapper.RecipeMapper;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.RecipeService;
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
@RequestMapping("/api/v1/recipes")
@Tag(name = "Recipes", description = "Recipe management endpoints")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;

    public RecipeController(RecipeService recipeService, RecipeMapper recipeMapper) {
        this.recipeService = recipeService;
        this.recipeMapper = recipeMapper;
    }

    @Operation(summary = "Get published recipes (paginated)")
    @GetMapping
    public ResponseEntity<Page<RecipeResponse>> getPublishedRecipes(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Recipe> recipes = recipeService.getPublishedRecipes(canSeePremium, pageable);
        Page<RecipeResponse> dtoPage = recipes.map(recipeMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Search recipes by title")
    @GetMapping("/search")
    public ResponseEntity<Page<RecipeResponse>> searchRecipes(
            @RequestParam String q,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Recipe> recipes = recipeService.searchRecipes(q, canSeePremium, pageable);
        Page<RecipeResponse> dtoPage = recipes.map(recipeMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get recipe by ID")
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Recipe recipe = recipeService.getRecipeById(id.toString(), currentUser);
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.ok(dto);
    }

    /**
     * *********** ✨ Windsurf Command ⭐ ************
     */
    /**
     * Get recipes by plant ID.
     * <p>
     * This endpoint returns a page of recipes associated with the given plant
     * ID. The recipes are filtered by the user's access level: if the user is
     * not premium, only non-premium recipes are returned.
     * <p>
     * The endpoint requires authentication and returns a 401 Unauthorized
     * response if the user is not authenticated.
     * <p>
     * The endpoint returns a 404 Not Found response if the plant ID does not
     * exist.
     * <p>
     * The endpoint returns a 200 OK response with a page of recipes if the
     * request is successful.
     *
     * /******* 1fb421c4-7a50-4993-a1c8-0190aa5fce54 ******
     */
    @Operation(summary = "Get recipes by plant ID")
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByPlantId(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        boolean canSeePremium = currentUser != null && currentUser.isPremium();
        Page<Recipe> recipes = recipeService.getRecipesByPlantId(plantId.toString(), canSeePremium, pageable);
        Page<RecipeResponse> dtoPage = recipes.map(recipeMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get my recipes")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/my")
    public ResponseEntity<Page<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Recipe> recipes = recipeService.getRecipesByAuthor(currentUser.getId().toString(), pageable);
        Page<RecipeResponse> dtoPage = recipes.map(recipeMapper::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Get pending recipes (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/pending")
    public ResponseEntity<List<RecipeResponse>> getPendingRecipes() {
        List<Recipe> recipes = recipeService.getPendingRecipes();
        List<RecipeResponse> dtoList = recipes.stream().map(recipeMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @Operation(summary = "Create a new recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @RequestParam String title,
            @RequestParam RecipeType type,
            @RequestParam(required = false) String image,
            @RequestParam String description,
            @RequestParam(required = false) Short preparationTimeMinutes,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) Short servings,
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false) String instructions,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(required = false) Set<String> plantIds,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Recipe recipe = recipeService.createRecipe(title, type, image, description,
                preparationTimeMinutes, difficulty, servings, ingredients, instructions,
                isPremium, plantIds, currentUser.getId().toString());
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @Operation(summary = "Update a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable UUID id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) RecipeType type,
            @RequestParam(required = false) String image,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Short preparationTimeMinutes,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) Short servings,
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false) String instructions,
            @RequestParam(required = false) Boolean isPremium,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Recipe recipe = recipeService.updateRecipe(id.toString(), title, type, image, description,
                preparationTimeMinutes, difficulty, servings, ingredients, instructions,
                isPremium, currentUser);
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Submit recipe for review")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/submit")
    public ResponseEntity<RecipeResponse> submitForReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Recipe recipe = recipeService.submitForReview(id.toString(), currentUser);
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Approve a recipe (Admin/Moderator only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<RecipeResponse> approveRecipe(@PathVariable UUID id) {
        Recipe recipe = recipeService.approveRecipe(id.toString());
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Archive a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/archive")
    public ResponseEntity<RecipeResponse> archiveRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Recipe recipe = recipeService.archiveRecipe(id.toString(), currentUser);
        RecipeResponse dto = recipeMapper.toDto(recipe);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Delete a recipe")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        recipeService.deleteRecipe(id.toString(), currentUser);
        return ResponseEntity.noContent().build();
    }
}
