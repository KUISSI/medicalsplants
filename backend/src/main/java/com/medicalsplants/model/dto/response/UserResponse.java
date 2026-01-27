package com.medicalsplants.model.dto.response;

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

    public UserResponse() {
    }

    public UserResponse(java.util.UUID id, String email, String pseudo, String firstname, String lastname, String avatar, String role, Boolean isEmailVerified, String createdAt) {
        this.id = id;
        this.email = email;
        this.pseudo = pseudo;
        this.firstname = firstname;
        this.lastname = lastname;
        this.avatar = avatar;
        this.role = role;
        this.isEmailVerified = isEmailVerified;
        this.createdAt = createdAt;
    }

    public java.util.UUID getId() {
        return id;
    }

    public void setId(java.util.UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
