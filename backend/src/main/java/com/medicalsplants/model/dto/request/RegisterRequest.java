package com.medicalsplants.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Registration request")
public class RegisterRequest {
    
    @Schema(description = "User first name", example = "John")
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @Schema(description = "User last name", example = "Doe")
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @Schema(description = "User pseudo (username)", example = "johndoe")
    @NotBlank(message = "Pseudo is required")
    @Size(min = 3, max = 20, message = "Pseudo must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Pseudo can only contain letters, numbers and underscores")
    private String pseudo;
    
    @Schema(description = "User email address", example = "user@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Schema(description = "User password", example = "Password123!")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$",
        message = "Password must contain at least one digit, one lowercase, one uppercase, one special character and no spaces"
    )
    private String password;
    
    @Schema(description = "Phone number", example = "+33123456789")
    private String phone;
}
