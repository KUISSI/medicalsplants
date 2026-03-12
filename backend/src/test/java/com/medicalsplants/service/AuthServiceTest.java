package com.medicalsplants.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.medicalsplants.AbstractIntegrationTest;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.model.dto.request.RegisterRequest;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.UserStatus;
import com.medicalsplants.repository.UserRepository;

@DisplayName("AuthService - Tests d'intégration")
class AuthServiceTest extends AbstractIntegrationTest {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        validRequest = new RegisterRequest(
                "user@test.com", "Password1!", "Password1!", "testuser", "Test", "User");
    }

    //  Helpers 
    private User findUser() {
        return userRepository.findByEmailAndDeletedAtIsNull("user@test.com").orElseThrow();
    }

    private String registerAndGetToken() {
        authService.register(validRequest);
        return findUser().getEmailVerificationToken();
    }

    //  register() 
    @Test
    @DisplayName("register - succes : utilisateur sauvegardé avec statut PENDING et password hashé")
    void register_shouldPersistUser_withPendingStatus() {
        authService.register(validRequest);

        User saved = findUser();
        assertThat(saved.getStatus()).isEqualTo(UserStatus.PENDING);
        assertThat(saved.getIsEmailVerified()).isFalse();
        assertThat(saved.getEmailVerificationToken()).isNotNull();
        assertThat(saved.getPasswordHash()).doesNotContain("Password1!");
    }

    @Test
    @DisplayName("register - echec : mots de passe differents")
    void register_shouldThrow_whenPasswordsDoNotMatch() {
        validRequest.setConfirmPassword("AutreMotDePasse1!");

        assertThatThrownBy(() -> authService.register(validRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Passwords do not match");

        assertThat(userRepository.findAll()).isEmpty();
    }

    @Test
    @DisplayName("register - echec : email deja utilise")
    void register_shouldThrow_whenEmailAlreadyExists() {
        authService.register(validRequest);

        RegisterRequest duplicate = new RegisterRequest(
                "user@test.com", "Password1!", "Password1!", "autrepseudo", "Jane", "Doe");

        assertThatThrownBy(() -> authService.register(duplicate))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("email already exists");
    }

    @Test
    @DisplayName("register - echec : pseudo deja pris")
    void register_shouldThrow_whenPseudoAlreadyTaken() {
        authService.register(validRequest);

        RegisterRequest duplicate = new RegisterRequest(
                "autre@test.com", "Password1!", "Password1!", "testuser", "Jane", "Doe");

        assertThatThrownBy(() -> authService.register(duplicate))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("pseudo is already taken");
    }

    //  verifyEmail() 
    @Test
    @DisplayName("verifyEmail - succes : statut passe a ACTIVE et token supprime")
    void verifyEmail_shouldActivateUser_whenTokenIsValid() {
        String token = registerAndGetToken();

        authService.verifyEmail(token);

        User updated = findUser();
        assertThat(updated.getStatus()).isEqualTo(UserStatus.ACTIVE);
        assertThat(updated.getIsEmailVerified()).isTrue();
        assertThat(updated.getEmailVerificationToken()).isNull();
    }

    @Test
    @DisplayName("verifyEmail - echec : token invalide ou inexistant")
    void verifyEmail_shouldThrow_whenTokenIsInvalid() {
        assertThatThrownBy(() -> authService.verifyEmail("token-inexistant"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid or expired verification token");
    }

    @Test
    @DisplayName("verifyEmail - deuxieme appel avec meme token echoue")
    void verifyEmail_shouldThrow_whenCalledTwiceWithSameToken() {
        String token = registerAndGetToken();
        authService.verifyEmail(token);

        assertThatThrownBy(() -> authService.verifyEmail(token))
                .isInstanceOf(BadRequestException.class);
    }
}
