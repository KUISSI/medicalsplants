package com.medicalsplants.service;

import java.time.Instant;
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
    // ... autres dépendances

    public UserService(UserRepository userRepository /*, autres dépendances */) {
        this.userRepository = userRepository;
        // ... initialisation autres dépendances
    }

    // ... autres méthodes
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
