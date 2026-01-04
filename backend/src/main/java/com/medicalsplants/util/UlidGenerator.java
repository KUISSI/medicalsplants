package com.medicalsplants.util;

import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.stereotype.Component;

/**
 * Générateur d'ULID (Universally Unique Lexicographically Sortable Identifier).
 *
 * Avantages par rapport aux UUID : - Triable chronologiquement - 26 caractères
 * (vs 36 pour UUID) - Compatible avec les index de base de données
 */
@Component
public class UlidGenerator {

    /**
     * Génère un nouvel ULID.
     *
     * @return ULID sous forme de String (26 caractères)
     */
    public String generate() {
        return UlidCreator.getUlid().toString();
    }

    /**
     * Valide si une chaîne est un ULID valide.
     *
     * @param ulid La chaîne à valider
     * @return true si valide, false sinon
     */
    public boolean isValid(String ulid) {
        if (ulid == null || ulid.length() != 26) {
            return false;
        }
        try {
            UlidCreator.getUlid().toString();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
