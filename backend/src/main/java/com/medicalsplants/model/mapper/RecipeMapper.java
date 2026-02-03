package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.model.entity.Recipe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PlantMapper.class, ReviewMapper.class, UserMapper.class, DateMapper.class})
public interface RecipeMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "plants", source = "plants")
    @Mapping(target = "reviews", source = "reviews")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "publishedAt", source = "publishedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "premium", source = "isPremium")
    @Mapping(target = "image", source = "imageUrl")
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    RecipeResponse toDto(Recipe entity);
}
