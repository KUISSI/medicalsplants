package com.medicalsplants.service;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.dto.request.RecipeRequest;
import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Recipe;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.RecipeStatus;
import com.medicalsplants.model.enums.RecipeType;
import com.medicalsplants.model.mapper.RecipeMapper;
import com.medicalsplants.repository.RecipeRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;
    private final PlantService plantService;

    public RecipeService(
            RecipeRepository recipeRepository,
            UserRepository userRepository,
            RecipeMapper recipeMapper,
            PlantService plantService
    ) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.recipeMapper = recipeMapper;
        this.plantService = plantService;
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getPublishedRecipes(boolean canSeePremium, Pageable pageable) {
        return recipeRepository.findPublished(canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getRecipesByPlantId(String plantId, boolean canSeePremium, Pageable pageable) {
        UUID uuid = UUID.fromString(plantId);
        return recipeRepository.findPublishedByPlantId(uuid, canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public RecipeResponse getRecipeById(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
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

        if (recipe.premium() && currentUser != null && !currentUser.premium()) {
            throw new ForbiddenException("This is a premium recipe. Please upgrade your account.");
        }

        return recipeMapper.toDto(recipe);
    }

    @Transactional(readOnly = true)
    public List<RecipeResponse> getPendingRecipes() {
        return recipeRepository.findPendingRecipes()
                .stream()
                .map(recipeMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getRecipesByAuthor(String authorId, Pageable pageable) {
        UUID uuid = UUID.fromString(authorId);
        return recipeRepository.findByAuthorId(uuid, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> searchRecipes(String search, boolean canSeePremium, Pageable pageable) {
        return recipeRepository.searchByTitle(search, canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional
    public RecipeResponse createRecipe(RecipeRequest request, String authorId) {
        UUID authorUuid = UUID.fromString(authorId);
        User author = userRepository.findById(authorUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Recipe recipe = new Recipe();
        recipe.setId(UUID.randomUUID());
        recipe.setTitle(request.getTitle());
        recipe.setType(RecipeType.valueOf(request.getType()));
        recipe.setDescription(request.getDescription());
        recipe.setPreparationTime(request.getPreparationTime());
        recipe.setDifficulty(request.getDifficulty());
        recipe.setServings(request.getServings());
        recipe.setIngredients(request.getIngredients());
        recipe.setInstructions(request.getInstructions());
        recipe.setPremium(request.getPremium() != null ? request.getPremium() : false);
        recipe.setStatus(RecipeStatus.DRAFT);
        recipe.setAuthor(author);

        // Association des plantes (DRY, via PlantService)
        if (request.getPlantIds() != null && !request.getPlantIds().isEmpty()) {
            Set<Plant> plants = plantService.resolvePlants(request.getPlantIds());
            recipe.setPlants(plants);
        }

        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse updateRecipe(String id, RecipeRequest request, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        // Check ownership
        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own recipes");
        }

        if (request.getTitle() != null) {
            recipe.setTitle(request.getTitle());
        }
        if (request.getType() != null) {
            recipe.setType(RecipeType.valueOf(request.getType()));
        }
        if (request.getDescription() != null) {
            recipe.setDescription(request.getDescription());
        }
        if (request.getPreparationTime() != null) {
            recipe.setPreparationTime(request.getPreparationTime());
        }
        if (request.getDifficulty() != null) {
            recipe.setDifficulty(request.getDifficulty());
        }
        if (request.getServings() != null) {
            recipe.setServings(request.getServings());
        }
        if (request.getIngredients() != null) {
            recipe.setIngredients(request.getIngredients());
        }
        if (request.getInstructions() != null) {
            recipe.setInstructions(request.getInstructions());
        }
        if (request.getPremium() != null) {
            recipe.setPremium(request.getPremium());
        }

        // Mise à jour des plantes (DRY, via PlantService)
        if (request.getPlantIds() != null) {
            Set<Plant> plants = plantService.resolvePlants(request.getPlantIds());
            recipe.setPlants(plants);
        }

        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse submitForReview(String id, CustomUserDetails currentUser) {
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
        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse approveRecipe(String id) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        if (recipe.getStatus() != RecipeStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be approved");
        }

        recipe.publish();
        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse archiveRecipe(String id, CustomUserDetails currentUser) {
        UUID uuid = UUID.fromString(id);
        Recipe recipe = recipeRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));

        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only archive your own recipes");
        }

        recipe.setStatus(RecipeStatus.ARCHIVED);
        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
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
