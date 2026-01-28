package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.ReceiptResponse;
import com.medicalsplants.model.entity.Receipt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring", uses = {PlantMapper.class, ReviewMapper.class, UserMapper.class})
public interface ReceiptMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "plants", source = "plants")
    @Mapping(target = "reviews", source = "reviews")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "premium", source = "isPremium")
    ReceiptResponse toDto(Receipt entity);

    @Named("instantToLocalDateTime")
    static LocalDateTime instantToLocalDateTime(Instant value) {
        return value == null ? null : LocalDateTime.ofInstant(value, ZoneId.systemDefault());
    }
    // Ajoutez d'autres mappings si besoin
}
