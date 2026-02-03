package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.UserResponse;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", source = "role", qualifiedByName = "roleToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToString")
    UserResponse toDto(User user);

    @Named("roleToString")
    default String roleToString(Role role) {
        return role != null ? role.name() : null;
    }

    @Named("instantToString")
    default String instantToString(Instant instant) {
        if (instant == null) {
            return null;
        }
        return DateTimeFormatter.ISO_LOCAL_DATE_TIME
                .withZone(ZoneId.systemDefault())
                .format(instant);
    }
}
