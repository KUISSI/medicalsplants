package com.medicalsplants.security;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// Custom UserDetails implementation for Spring Security.
@Getter
@Builder
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final String id;
    private final String email;
    private final String password;
    private final String pseudo;
    private final String firstname;
    private final String lastname;
    private final Role role;
    private final UserStatus status;
    private final Boolean isActive;
    private final Boolean isEmailVerified;

    // Creates CustomUserDetails from a User entity.
    public static CustomUserDetails fromUser(User user) {
        return CustomUserDetails.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .pseudo(user.getPseudo())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .role(user.getRole())
                .status(user.getStatus())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && status == UserStatus.ACTIVE;
    }

    // Checks if user is admin.
    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    // Checks if user is premium or admin.
    public boolean isPremium() {
        return role == Role.PREMIUM || role == Role.ADMIN;
    }

    // Gets the user's full name.
    public String getFullName() {
        if (firstname != null && lastname != null) {
            return firstname + " " + lastname;
        }
        return pseudo;
    }
}
