package com.medicalsplants.util;
import com.github.f4b6a3.ulid.UlidCreator;

import org.springframework.stereotype.Component;

// ULID (Universally Unique Lexicographically Sortable Identifier) generator.
// ULIDs are sortable and URL-safe, making them ideal for database IDs.
@Component
public class UlidGenerator {
//  Generates a new ULID string.
// @return 26-character ULID string

    public String generate() {
        return UlidCreator.getMonotonicUlid().toString();
    }
}
