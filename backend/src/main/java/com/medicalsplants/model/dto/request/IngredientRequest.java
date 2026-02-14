package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO représentant un ingrédient dans une recette.
 */
public class IngredientRequest {

    /**
     * Nom de l'ingrédient (obligatoire).
     */
    @NotBlank(message = "Ingredient name is required")
    @Size(max = 100, message = "Ingredient name must be at most 100 characters")
    private String name;

    /**
     * Quantité de l'ingrédient (obligatoire).
     */
    @NotBlank(message = "Quantity is required")
    @Size(max = 50, message = "Quantity must be at most 50 characters")
    private String quantity;

    /**
     * Unité de mesure (optionnelle).
     */
    @Size(max = 30, message = "Unit must be at most 30 characters")
    private String unit;

    public IngredientRequest() {
    }

    public IngredientRequest(String name, String quantity, String unit) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
