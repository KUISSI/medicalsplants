package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.ReviewResponse;
import com.medicalsplants.model.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewResponse toDto(Review entity);
}
