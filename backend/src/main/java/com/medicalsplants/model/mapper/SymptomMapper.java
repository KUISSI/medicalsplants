package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.SymptomResponse;
import com.medicalsplants.model.dto.request.SymptomRequest;
import com.medicalsplants.model.entity.Symptom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DateMapper.class})
public interface SymptomMapper {

    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "family", source = "family")
    @Mapping(target = "description", source = "description")
    SymptomResponse toDto(Symptom entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "properties", ignore = true)
    Symptom toEntity(SymptomRequest request);
}
