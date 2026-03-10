package com.medicalsplants.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;

@Service
public class UserService {

    private final UserRepository userRepository;
    // private final VerificationTokenRepository tokenRepository; // Si tu utilises un repo de tokens

    public UserService(UserRepository userRepository /*, VerificationTokenRepository tokenRepository */) {
        this.userRepository = userRepository;
        // this.tokenRepository = tokenRepository;
    }

    // Création d'un nouvel utilisateur non vérifié
    @Transactional
    public User createUser(User user) {
        user.setEmailVerified(false);
        user.setCreatedAt(Instant.now());
        // ... autres initialisations
        return userRepository.save(user);
    }

    // Validation de l'email à partir du token
    @Transactional
    public boolean verifyUserEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationTokenAndDeletedAtIsNull(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null); // Corrigé : le champ s'appelle emailVerificationToken
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // Suppression d'un utilisateur (soft ou hard delete selon le rôle)
    @Transactional
    public void deleteUser(UUID userId, CustomUserDetails currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        boolean isSelf = user.getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.isAdmin();

        if (isAdmin) {
            userRepository.delete(user); // Suppression physique
        } else if (isSelf) {
            user.setDeletedAt(Instant.now()); // Soft delete
            userRepository.save(user);
        } else {
            throw new ForbiddenException("You can only delete your own account");
        }
    }
}
