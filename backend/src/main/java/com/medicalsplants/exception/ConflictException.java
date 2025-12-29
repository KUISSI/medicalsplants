package com.medicalsplants.exception;

import org.springframework.http.HttpStatus;

// Exception thrown when there is a conflict (e.g., duplicate resource).
public class ConflictException extends BaseException {

    public ConflictException(String message) {
        super(message, "CONFLICT", HttpStatus.CONFLICT);
    }
}
