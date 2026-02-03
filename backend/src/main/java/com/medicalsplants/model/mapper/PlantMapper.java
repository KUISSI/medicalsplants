package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.request.PlantRequest;
import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.model.entity.Plant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PropertyMapper.class, DateMapper.class})
public interface PlantMapper {

    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "properties", source = "properties")
    PlantResponse toDto(Plant entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "properties", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    Plant toEntity(PlantRequest request);
}
