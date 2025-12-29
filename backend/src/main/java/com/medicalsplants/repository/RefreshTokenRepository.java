package com.medicalsplants.repository;

import com.medicalsplants.model.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

// Repository for RefreshToken entity operations.
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

// Finds a refresh token by its value.
    Optional<RefreshToken> findByToken(String token);

// Revokes all tokens for a user.
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.user. id = :userId")
    void revokeAllByUserId(@Param("userId") String userId);

    // Deletes expired tokens.
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < : now")
    int deleteExpiredTokens(@Param("now") Instant now);
}
