package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.request.RecipeRequest;
import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.model.entity.Recipe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PlantMapper.class, ReviewMapper.class, UserMapper.class, DateMapper.class})
public interface RecipeMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "preparationTime", source = "preparationTime")
    @Mapping(target = "difficulty", source = "difficulty")
    @Mapping(target = "servings", source = "servings")
    @Mapping(target = "ingredients", source = "ingredients")
    @Mapping(target = "instructions", source = "instructions")
    @Mapping(target = "premium", source = "premium")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "publishedAt", source = "publishedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "author", source = "author")
    @Mapping(target = "plants", source = "plants")
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "reviewCount", source = "reviewCount")
    @Mapping(target = "averageRating", source = "averageRating")
    @Mapping(target = "image", source = "imageUrl")
    RecipeResponse toDto(Recipe entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "plants", ignore = true) // <--- IGNORE plants, handled in service
    Recipe toEntity(RecipeRequest recipeRequest);
}
