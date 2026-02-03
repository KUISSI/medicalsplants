package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.request.PropertyRequest;
import com.medicalsplants.model.dto.response.PropertyResponse;
import com.medicalsplants.model.entity.Property;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {SymptomMapper.class, DateMapper.class})
public interface PropertyMapper {

    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "symptoms", source = "symptoms")
    PropertyResponse toDto(Property entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "symptoms", ignore = true)
    @Mapping(target = "plants", ignore = true)
    Property toEntity(PropertyRequest request);
}
