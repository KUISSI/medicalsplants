package com.medicalsplants.model.dto.response;

public class UserResponse {

    private String id;
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {

        private final UserResponse response = new UserResponse();

        public UserResponseBuilder id(String id) {
            response.id = id;
            return this;
        }

        public UserResponseBuilder email(String email) {
            response.email = email;
            return this;
        }

        public UserResponseBuilder pseudo(String pseudo) {
            response.pseudo = pseudo;
            return this;
        }

        public UserResponseBuilder firstname(String firstname) {
            response.firstname = firstname;
            return this;
        }

        public UserResponseBuilder lastname(String lastname) {
            response.lastname = lastname;
            return this;
        }

        public UserResponseBuilder avatar(String avatar) {
            response.avatar = avatar;
            return this;
        }

        public UserResponseBuilder role(String role) {
            response.role = role;
            return this;
        }

        public UserResponseBuilder isEmailVerified(Boolean isEmailVerified) {
            response.isEmailVerified = isEmailVerified;
            return this;
        }

        public UserResponseBuilder createdAt(String createdAt) {
            response.createdAt = createdAt;
            return this;
        }

        public UserResponse build() {
            return response;
        }
    }
}
