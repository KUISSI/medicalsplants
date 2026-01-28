package com.medicalsplants.security;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;

public class CustomUserDetails implements UserDetails {

    public UUID getId() {
        return id;
    }

    private UUID id;
    private String email;
    private String password;
    private String pseudo;
    private String firstname;
    private String lastname;
    private Role role;
    private UserStatus status;
    private Boolean isActive;
    private Boolean isEmailVerified;

    public CustomUserDetails() {
    }

    public CustomUserDetails(UUID id, String email, String password, String pseudo, String firstname, String lastname, Role role, UserStatus status, Boolean isActive, Boolean isEmailVerified) {
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

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
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
}
