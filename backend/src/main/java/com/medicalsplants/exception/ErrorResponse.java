package com.medicalsplants.exception;

import java.util.List;

public class ErrorResponse {

    private boolean success;
    private ErrorDetails error;
    private String timestamp;

    public ErrorResponse() {
    }

    public ErrorResponse(boolean success, ErrorDetails error, String timestamp) {
        this.success = success;
        this.error = error;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public ErrorDetails getError() {
        return error;
    }

    public void setError(ErrorDetails error) {
        this.error = error;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public static class ErrorDetails {

        private String code;
        private String message;
        private List<FieldErrorDetails> details;

        public ErrorDetails() {
        }

        public ErrorDetails(String code, String message, List<FieldErrorDetails> details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<FieldErrorDetails> getDetails() {
            return details;
        }

        public void setDetails(List<FieldErrorDetails> details) {
            this.details = details;
        }
    }

    public static class FieldErrorDetails {

        private String field;
        private String message;

        public FieldErrorDetails() {
        }

        public FieldErrorDetails(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
