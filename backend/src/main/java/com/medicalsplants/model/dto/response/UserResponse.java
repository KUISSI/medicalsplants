package com.medicalsplants.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private java.util.UUID id;
    private String email;
    private String pseudo;
    private String firstname;
    private String lastname;
    private String avatar;
    private String role;
    private Boolean isEmailVerified;
    private String createdAt;
}
