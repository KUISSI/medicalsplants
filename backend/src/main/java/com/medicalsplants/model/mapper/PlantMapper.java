package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.PlantResponse;
import com.medicalsplants.model.entity.Plant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlantMapper {

    PlantResponse toDto(Plant entity);

    Plant toEntity(PlantResponse dto);
}
