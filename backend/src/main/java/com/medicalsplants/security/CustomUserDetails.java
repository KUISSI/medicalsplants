package com.medicalsplants.security;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

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

    public CustomUserDetails(String id, String email, String password, String pseudo,
            String firstname, String lastname, Role role, UserStatus status,
            Boolean isActive, Boolean isEmailVerified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.pseudo = pseudo;
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = role;
        this.status = status;
        this.isActive = isActive;
        this.isEmailVerified = isEmailVerified;
    }

    public static CustomUserDetails fromUser(User user) {
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getPseudo(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole(),
                user.getStatus(),
                user.getIsActive(),
                user.getIsEmailVerified()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
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

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPseudo() {
        return pseudo;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public Role getRole() {
        return role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isPremium() {
        return role == Role.PREMIUM || role == Role.ADMIN;
    }

    public String getFullName() {
        if (firstname != null && lastname != null) {
            return firstname + " " + lastname;
        }
        return pseudo;
    }

    public static CustomUserDetailsBuilder builder() {
        return new CustomUserDetailsBuilder();
    }

    public static class CustomUserDetailsBuilder {

        private String id;
        private String email;
        private String password;
        private String pseudo;
        private String firstname;
        private String lastname;
        private Role role;
        private UserStatus status;
        private Boolean isActive;
        private Boolean isEmailVerified;

        public CustomUserDetailsBuilder id(String id) {
            this.id = id;
            return this;
        }

        public CustomUserDetailsBuilder email(String email) {
            this.email = email;
            return this;
        }

        public CustomUserDetailsBuilder password(String password) {
            this.password = password;
            return this;
        }

        public CustomUserDetailsBuilder pseudo(String pseudo) {
            this.pseudo = pseudo;
            return this;
        }

        public CustomUserDetailsBuilder firstname(String firstname) {
            this.firstname = firstname;
            return this;
        }

        public CustomUserDetailsBuilder lastname(String lastname) {
            this.lastname = lastname;
            return this;
        }

        public CustomUserDetailsBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public CustomUserDetailsBuilder status(UserStatus status) {
            this.status = status;
            return this;
        }

        public CustomUserDetailsBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public CustomUserDetailsBuilder isEmailVerified(Boolean isEmailVerified) {
            this.isEmailVerified = isEmailVerified;
            return this;
        }

        public CustomUserDetails build() {
            return new CustomUserDetails(id, email, password, pseudo, firstname, lastname,
                    role, status, isActive, isEmailVerified);
        }
    }
}
