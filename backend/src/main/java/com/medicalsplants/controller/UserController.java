package com.medicalsplants.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    // ... autres dépendances

    public UserController(UserService userService /*, autres dépendances */) {
        this.userService = userService;
        // ... initialisation autres dépendances
    }

    // Suppression hard (admin uniquement)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserAsAdmin(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        userService.deleteUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    // Suppression soft (l’utilisateur sur lui-même)
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteOwnAccount(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        userService.deleteUser(currentUser.getId(), currentUser);
        return ResponseEntity.noContent().build();
    }

}
