package com.medicalsplants.repository;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

// Repository for User entity operations.
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Finds a user by email.
    Optional<User> findByEmail(String email);

    // Finds a user by pseudo.
    Optional<User> findByPseudo(String pseudo);

    // Checks if email exists.
    boolean existsByEmail(String email);

    // Checks if pseudo exists.
    boolean existsByPseudo(String pseudo);

    // Finds user by email verification token.
    Optional<User> findByEmailVerificationToken(String token);

    // Finds user by password reset token.
    Optional<User> findByPasswordResetToken(String token);

    // Updates last login timestamp.
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = : lastLoginAt WHERE u. id = :userId")
    void updateLastLoginAt(@Param("userId") String userId, @Param("lastLoginAt") Instant lastLoginAt);

    // Updates user status.
    @Modifying
    @Query("UPDATE User u SET u.status = :status, u.updatedAt = CURRENT_TIMESTAMP WHERE u.id = : userId")
    void updateStatus(@Param("userId") String userId, @Param("status") UserStatus status);
}
