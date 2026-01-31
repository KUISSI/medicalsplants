package com.medicalsplants.util;

import com.medicalsplants.exception.BadRequestException;

import java.util.UUID;

public final class UuidUtils {

    private UuidUtils() {
    }

    public static UUID parse(String name, String value) {
        if (value == null) {
            throw new BadRequestException(name + " must be provided");
        }
        try {
            return UUID.fromString(value);
        } catch (Exception ex) {
            throw new BadRequestException(String.format("%s must be a valid UUID: '%s'", name, value));
        }
    }
}
