package com.medicalsplants.repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.UserStatus;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    Optional<User> findByPseudoAndDeletedAtIsNull(String pseudo);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    boolean existsByPseudoAndDeletedAtIsNull(String pseudo);

    Optional<User> findByEmailVerificationTokenAndDeletedAtIsNull(String token);

    Optional<User> findByPasswordResetTokenAndDeletedAtIsNull(String token);

    Page<User> findByEmailContainingIgnoreCaseOrPseudoContainingIgnoreCase(
            String email, String pseudo, Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :lastLoginAt WHERE u.id = :userId")
    void updateLastLoginAt(@Param("userId") UUID userId, @Param("lastLoginAt") Instant lastLoginAt);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    void updateStatus(@Param("userId") UUID userId, @Param("status") UserStatus status);

    @Modifying
    @Query("UPDATE User u SET u.isEmailVerified = :isEmailVerified, u.emailVerificationToken = :verificationToken WHERE u.id = :userId")
    void updateEmailVerification(@Param("userId") UUID userId,
            @Param("isEmailVerified") Boolean isEmailVerified,
            @Param("verificationToken") String verificationToken);

    @Modifying
    @Query("UPDATE User u SET u.deletedAt = :deletedAt WHERE u.id = :userId")
    void softDelete(@Param("userId") UUID userId, @Param("deletedAt") Instant deletedAt);
}