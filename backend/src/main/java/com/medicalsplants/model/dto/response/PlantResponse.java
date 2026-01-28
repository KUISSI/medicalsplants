package com.medicalsplants.model.dto.response;

import java.util.UUID;

public class PlantResponse {

    private UUID id;
    private String title;
    // Ajoutez d'autres champs nécessaires

    public PlantResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    // Ajoutez d'autres getters/setters si besoin
}
