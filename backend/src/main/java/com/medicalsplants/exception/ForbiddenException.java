package com.medicalsplants.exception;

import org.springframework.http.HttpStatus;

// Exception thrown when access is forbidden. 
public class ForbiddenException extends BaseException {

    public ForbiddenException(String message) {
        super(message, "FORBIDDEN", HttpStatus.FORBIDDEN);
    }
}
