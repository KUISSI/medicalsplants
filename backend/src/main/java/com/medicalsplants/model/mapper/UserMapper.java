package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.UserResponse;
import com.medicalsplants.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toDto(User user);
}
