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

    public static ErrorResponseBuilder builder() {
        return new ErrorResponseBuilder();
    }

    public static class ErrorResponseBuilder {

        private boolean success;
        private ErrorDetails error;
        private String timestamp;

        public ErrorResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public ErrorResponseBuilder error(ErrorDetails error) {
            this.error = error;
            return this;
        }

        public ErrorResponseBuilder timestamp(String timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ErrorResponse build() {
            return new ErrorResponse(success, error, timestamp);
        }
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

        public static ErrorDetailsBuilder builder() {
            return new ErrorDetailsBuilder();
        }

        public static class ErrorDetailsBuilder {

            private String code;
            private String message;
            private List<FieldErrorDetails> details;

            public ErrorDetailsBuilder code(String code) {
                this.code = code;
                return this;
            }

            public ErrorDetailsBuilder message(String message) {
                this.message = message;
                return this;
            }

            public ErrorDetailsBuilder details(List<FieldErrorDetails> details) {
                this.details = details;
                return this;
            }

            public ErrorDetails build() {
                return new ErrorDetails(code, message, details);
            }
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

        public static FieldErrorDetailsBuilder builder() {
            return new FieldErrorDetailsBuilder();
        }

        public static class FieldErrorDetailsBuilder {

            private String field;
            private String message;

            public FieldErrorDetailsBuilder field(String field) {
                this.field = field;
                return this;
            }

            public FieldErrorDetailsBuilder message(String message) {
                this.message = message;
                return this;
            }

            public FieldErrorDetails build() {
                return new FieldErrorDetails(field, message);
            }
        }
    }
}
