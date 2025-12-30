package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;

    @NotBlank(message = "Pseudo is required")
    @Size(min = 3, max = 50, message = "Pseudo must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Pseudo can only contain letters, numbers, and underscores")
    private String pseudo;

    @Size(max = 100, message = "Firstname cannot exceed 100 characters")
    private String firstname;

    @Size(max = 100, message = "Lastname cannot exceed 100 characters")
    private String lastname;

    public RegisterRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
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

    public static RegisterRequestBuilder builder() {
        return new RegisterRequestBuilder();
    }

    public static class RegisterRequestBuilder {

        private String email;
        private String password;
        private String confirmPassword;
        private String pseudo;
        private String firstname;
        private String lastname;

        public RegisterRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public RegisterRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public RegisterRequestBuilder confirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
            return this;
        }

        public RegisterRequestBuilder pseudo(String pseudo) {
            this.pseudo = pseudo;
            return this;
        }

        public RegisterRequestBuilder firstname(String firstname) {
            this.firstname = firstname;
            return this;
        }

        public RegisterRequestBuilder lastname(String lastname) {
            this.lastname = lastname;
            return this;
        }

        public RegisterRequest build() {
            RegisterRequest request = new RegisterRequest();
            request.email = this.email;
            request.password = this.password;
            request.confirmPassword = this.confirmPassword;
            request.pseudo = this.pseudo;
            request.firstname = this.firstname;
            request.lastname = this.lastname;
            return request;
        }
    }
}
