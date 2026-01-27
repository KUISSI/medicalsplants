package com.medicalsplants.exception;

import org.springframework.http.HttpStatus;

public abstract class BaseException extends RuntimeException {

    private final String code;
    private final HttpStatus status;

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    protected BaseException(String message, String code, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

    protected BaseException(String message, String code, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.status = status;
    }
}
