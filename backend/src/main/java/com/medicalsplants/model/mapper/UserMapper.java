package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.UserResponse;
import com.medicalsplants.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// Mapper for User entity. 
@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "createdAt", expression = "java(user. getCreatedAt() != null ? user.getCreatedAt().toString() : null)")
    UserResponse toResponse(User user);
}
