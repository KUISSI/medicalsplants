package com.medicalsplants.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.model.entity.Review;

@Mapper(componentModel = "spring", uses = {UserMapper.class, DateMapper.class})
public interface ReviewMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "recipeId", source = "recipe.id")
    @Mapping(target = "parentReviewId", source = "parent.id")
    @Mapping(target = "replies", source = "replies")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "rating", source = "rating")
    ReviewResponse toDto(Review entity);
}
