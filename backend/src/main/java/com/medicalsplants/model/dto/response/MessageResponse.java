package com.medicalsplants.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private boolean success;
    private String message;
    private String timestamp;

    // Méthodes utilitaires statiques
    public static MessageResponse of(String message) {
        return new MessageResponse(true, message, Instant.now().toString());
    }

    public static MessageResponse error(String message) {
        return new MessageResponse(false, message, Instant.now().toString());
    }
}
