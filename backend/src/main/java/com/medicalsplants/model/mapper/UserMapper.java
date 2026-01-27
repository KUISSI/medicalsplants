package com.medicalsplants.model.mapper;

import com.medicalsplants.model.dto.response.UserResponse;
import com.medicalsplants.model.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getPseudo(),
                user.getFirstname(),
                user.getLastname(),
                user.getAvatar(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getIsEmailVerified(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }
}
