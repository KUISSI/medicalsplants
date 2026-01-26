package com.medicalsplants.exception;

import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class BadRequestException extends BaseException {

    public BadRequestException(String message) {
        super(message, "BAD_REQUEST", HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, "BAD_REQUEST", HttpStatus.BAD_REQUEST, cause);
    }
}
