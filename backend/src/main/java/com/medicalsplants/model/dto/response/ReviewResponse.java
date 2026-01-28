package com.medicalsplants.model.dto.response;

import java.util.UUID;

public class ReviewResponse {

    private UUID id;
    private String content;
    // Ajoutez d'autres champs nécessaires

    public ReviewResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    // Ajoutez d'autres getters/setters si besoin
}
