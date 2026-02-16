package com.medicalsplants.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.UserStatus;

@Repository
public interface UserRepository extends JpaRepository<User, java.util.UUID> {

    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    Optional<User> findByPseudoAndDeletedAtIsNull(String pseudo);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    boolean existsByPseudoAndDeletedAtIsNull(String pseudo);

    Optional<User> findByEmailVerificationTokenAndDeletedAtIsNull(String token);

    Optional<User> findByPasswordResetTokenAndDeletedAtIsNull(String token);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :lastLoginAt WHERE u.id = :userId")
    void updateLastLoginAt(@Param("userId") java.util.UUID userId, @Param("lastLoginAt") Instant lastLoginAt);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    void updateStatus(@Param("userId") java.util.UUID userId, @Param("status") UserStatus status);
}
