package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.RecipeResponse;
import com.medicalsplants.model.entity.Recipe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring", uses = {PlantMapper.class, ReviewMapper.class, UserMapper.class})
public interface RecipeMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "plants", source = "plants")
    @Mapping(target = "reviews", source = "reviews")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "publishedAt", source = "publishedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "premium", source = "isPremium")
    RecipeResponse toDto(Recipe entity);

    @Named("instantToLocalDateTime")
    static LocalDateTime instantToLocalDateTime(Instant value) {
        return value == null ? null : LocalDateTime.ofInstant(value, ZoneId.systemDefault());
    }
}
