package com.medicalsplants.service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Recipe getRecipeEntityById(UUID id) {
        if (id == null) {
            throw new BadRequestException("Recipe id cannot be null");
        }
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id.toString()));
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getPublishedRecipes(boolean canSeePremium, Pageable pageable) {
        return recipeRepository.findPublished(canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getRecipesByPlantId(UUID plantId, boolean canSeePremium, Pageable pageable) {
        return recipeRepository.findPublishedByPlantId(plantId, canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public RecipeResponse getRecipeById(UUID id, CustomUserDetails currentUser) {
        Recipe recipe = getRecipeEntityById(id);

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
    public List<RecipeResponse> getpendingRecipes() {
        return recipeRepository.findpendingRecipes()
                .stream()
                .map(recipeMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getRecipesByAuthor(UUID authorId, Pageable pageable) {
        return recipeRepository.findByAuthorId(authorId, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> searchRecipes(String search, boolean canSeePremium, Pageable pageable) {
        return recipeRepository.searchByTitle(search, canSeePremium, pageable)
                .map(recipeMapper::toDto);
    }

    @Transactional
    public RecipeResponse createRecipe(RecipeRequest request, UUID authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId.toString()));

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

        // Association des plantes (UUID direct)
        Set<UUID> plantIds = request.getPlantIds();
        if (plantIds != null && !plantIds.isEmpty()) {
            Set<Plant> plants = plantService.resolvePlants(plantIds);
            recipe.setPlants(plants);
        }

        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse updateRecipe(UUID id, RecipeRequest request, CustomUserDetails currentUser) {
        Recipe recipe = getRecipeEntityById(id);

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

        // Mise à jour des plantes (UUID direct)
        Set<UUID> plantIds = request.getPlantIds();
        if (plantIds != null && !plantIds.isEmpty()) {
            Set<Plant> plants = plantService.resolvePlants(plantIds);
            recipe.setPlants(plants);
        }

        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse submitForReview(UUID id, CustomUserDetails currentUser) {
        Recipe recipe = getRecipeEntityById(id);

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
    public RecipeResponse approveRecipe(UUID id) {
        Recipe recipe = getRecipeEntityById(id);

        if (recipe.getStatus() != RecipeStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be approved");
        }

        recipe.publish();
        Recipe saved = recipeRepository.save(recipe);
        return recipeMapper.toDto(saved);
    }

    @Transactional
    public RecipeResponse archiveRecipe(UUID id, CustomUserDetails currentUser) {
        Recipe recipe = getRecipeEntityById(id);

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
    public void deleteRecipe(UUID id, CustomUserDetails currentUser) {
        Recipe recipe = getRecipeEntityById(id);

        boolean isOwner = recipe.getAuthor() != null
                && recipe.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.isAdmin();

        if (isAdmin) {
            recipeRepository.delete(recipe); // Suppression physique
        } else if (isOwner) {
            recipe.setDeletedAt(Instant.now()); // Soft delete
            recipeRepository.save(recipe);
        } else {
            throw new ForbiddenException("You can only delete your own recipes");
        }
    }

    @Transactional(readOnly = true)
    public Page<RecipeResponse> getAllRecipes(String status, Pageable pageable) {
        if (status == null || status.isEmpty()) {
            return recipeRepository.findAllByDeletedAtIsNull(pageable)
                    .map(recipeMapper::toDto);
        } else {
            return recipeRepository.findByStatusAndDeletedAtIsNull(RecipeStatus.valueOf(status), pageable)
                    .map(recipeMapper::toDto);
        }
    }
}
