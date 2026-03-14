package com.medicalsplants.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(User user) {
        user.setEmailVerified(false);
        user.setCreatedAt(Instant.now());
        return userRepository.save(user);
    }

    @Transactional
    public boolean verifyUserEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationTokenAndDeletedAtIsNull(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public void deleteUser(UUID userId, CustomUserDetails currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        boolean isSelf = user.getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.isAdmin();

        if (isAdmin) {
            userRepository.delete(user);
        } else if (isSelf) {
            user.setDeletedAt(Instant.now());
            userRepository.save(user);
        } else {
            throw new ForbiddenException("You can only delete your own account");
        }
    }

    // === METHODES ADMIN ===
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(int page, int size, String search) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isBlank()) {
            return userRepository.findByEmailContainingIgnoreCaseOrPseudoContainingIgnoreCase(
                    search, search, pageable);
        }
        return userRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional
    public User updateUserRole(UUID id, Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserStatus(UUID id, UserStatus status) {
        User user = getUserById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }
}
