package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.InteractionResponse;
import com.medicalsplants.model.entity.Interaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DateMapper.class})
public interface InteractionMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "recipeId", source = "recipe.id")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    InteractionResponse toDto(Interaction entity);
}
