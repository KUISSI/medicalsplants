package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.model.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ReviewMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "recipeId", source = "recipe.id")
    @Mapping(target = "parentId", source = "parent.id")
    @Mapping(target = "replies", source = "replies")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    ReviewResponse toDto(Review entity);

    Review toEntity(ReviewResponse dto);

    @Named("instantToLocalDateTime")
    static LocalDateTime instantToLocalDateTime(Instant value) {
        return value == null ? null : LocalDateTime.ofInstant(value, ZoneId.systemDefault());
    }
}
