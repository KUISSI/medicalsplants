package com.medicalsplants.model.dto.response;

import java.time.Instant;

public class MessageResponse {

    private boolean success;
    private String message;
    private String timestamp;

    public MessageResponse() {
    }

    public MessageResponse(boolean success, String message, String timestamp) {
        this.success = success;
        this.message = message;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public static MessageResponse of(String message) {
        return new MessageResponse(true, message, Instant.now().toString());
    }

    public static MessageResponse error(String message) {
        return new MessageResponse(false, message, Instant.now().toString());
    }

    public static MessageResponseBuilder builder() {
        return new MessageResponseBuilder();
    }

    public static class MessageResponseBuilder {

        private boolean success;
        private String message;
        private String timestamp;

        public MessageResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public MessageResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public MessageResponseBuilder timestamp(String timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public MessageResponse build() {
            return new MessageResponse(success, message, timestamp);
        }
    }
}
