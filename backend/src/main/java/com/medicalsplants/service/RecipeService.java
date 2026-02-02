package com.medicalsplants.service;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.RecipeStatus;
import com.medicalsplants.model.enums.RecipeType;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.RecipeRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    public RecipeService(RecipeRepository recipeRepository, PlantRepository plantRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getPublishedRecipes(boolean canSeePremium, Pageable pageable) {
        return recipeRepository.findPublished(canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getRecipesByPlantId(String plantId, boolean canSeePremium, Pageable pageable) {
        UUID uuid = UUID.fromString(plantId);
        return recipeRepository.findPublishedByPlantId(uuid, canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Recipe getRecipeById(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Recipe id cannot be null");
        }
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        // Check access
        if (recipe.getStatus() != RecipeStatus.PUBLISHED) {
            if (currentUser == null) {
                throw new ForbiddenException("This recipe is not published");
            }
            boolean isOwner = recipe.getAuthor() != null
                    && recipe.getAuthor().getId().equals(currentUser.getId());
            if (!isOwner && !currentUser.isAdmin()) {
                throw new ForbiddenException("You don't have access to this recipe");
            }
        }

        if (recipe.getIsPremium() && currentUser != null && !currentUser.isPremium()) {
            throw new ForbiddenException("This is a premium recipe. Please upgrade your account.");
        }

        return recipe;
    }

    @Transactional(readOnly = true)
    public List<Recipe> getPendingRecipes() {
        return recipeRepository.findPendingRecipes();
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getRecipesByAuthor(String authorId, Pageable pageable) {
        UUID uuid = UUID.fromString(authorId);
        return recipeRepository.findByAuthorId(uuid, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> searchRecipes(String search, boolean canSeePremium, Pageable pageable) {
        return recipeRepository.searchByTitle(search, canSeePremium, pageable);
    }

    @Transactional
    public Recipe createRecipe(String title, RecipeType type, String description,
            Short preparationTimeMinutes, String difficulty, Short servings,
            String ingredients, String instructions,
            Boolean isPremium, Set<String> plantIds, String authorId) {

        UUID authorUuid = UUID.fromString(authorId);
        User author = userRepository.findById(authorUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Recipe recipe = new Recipe();
        recipe.setId(UUID.randomUUID());
        recipe.setTitle(title);
        recipe.setType(type);
        recipe.setDescription(description);
        recipe.setPreparationTimeMinutes(preparationTimeMinutes);
        recipe.setDifficulty(difficulty);
        recipe.setServings(servings);
        recipe.setIngredients(ingredients);
        recipe.setInstructions(instructions);
        recipe.setIsPremium(isPremium != null ? isPremium : false);
        recipe.setStatus(RecipeStatus.DRAFT);
        recipe.setAuthor(author);

        if (plantIds != null && !plantIds.isEmpty()) {
            for (String plantId : plantIds) {
                UUID plantUuid = UUID.fromString(plantId);
                Plant plant = plantRepository.findById(plantUuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));
                recipe.getPlants().add(plant);
            }
        }

        return recipeRepository.save(recipe);
    }

    @Transactional
    public Recipe updateRecipe(String id, String title, RecipeType type,
            String description, Short preparationTimeMinutes, String difficulty,
            Short servings, String ingredients, String instructions,
            Boolean isPremium, CustomUserDetails currentUser) {

        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        // Check ownership
        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own recipes");
        }

        if (title != null) {
            recipe.setTitle(title);
        }
        if (type != null) {
            recipe.setType(type);
        }
        if (description != null) {
            recipe.setDescription(description);
        }
        if (preparationTimeMinutes != null) {
            recipe.setPreparationTimeMinutes(preparationTimeMinutes);
        }
        if (difficulty != null) {
            recipe.setDifficulty(difficulty);
        }
        if (servings != null) {
            recipe.setServings(servings);
        }
        if (ingredients != null) {
            recipe.setIngredients(ingredients);
        }
        if (instructions != null) {
            recipe.setInstructions(instructions);
        }
        if (isPremium != null) {
            recipe.setIsPremium(isPremium);
        }

        return recipeRepository.save(recipe);
    }

    @Transactional
    public Recipe submitForReview(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner) {
            throw new ForbiddenException("You can only submit your own recipes");
        }

        if (recipe.getStatus() != RecipeStatus.DRAFT) {
            throw new BadRequestException("Only draft recipes can be submitted for review");
        }

        recipe.setStatus(RecipeStatus.PENDING);
        return recipeRepository.save(recipe);
    }

    @Transactional
    public Recipe approveRecipe(String id) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        if (recipe.getStatus() != RecipeStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be approved");
        }

        recipe.setStatus(RecipeStatus.PUBLISHED);
        recipe.setPublishedAt(Instant.now());
        return recipeRepository.save(recipe);
    }

    @Transactional
    public Recipe archiveRecipe(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only archive your own recipes");
        }

        recipe.setStatus(RecipeStatus.ARCHIVED);
        return recipeRepository.save(recipe);
    }

    @Transactional
    public void deleteRecipe(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own recipes");
        }

        recipeRepository.delete(recipe);
    }
}
