package com.medicalsplants.model.dto.response;

public class AuthResponse {

    private boolean success;
    private AuthData data;
    private String message;
    private String timestamp;

    public AuthResponse() {
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public AuthData getData() {
        return data;
    }

    public void setData(AuthData data) {
        this.data = data;
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

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {

        private final AuthResponse response = new AuthResponse();

        public AuthResponseBuilder success(boolean success) {
            response.success = success;
            return this;
        }

        public AuthResponseBuilder data(AuthData data) {
            response.data = data;
            return this;
        }

        public AuthResponseBuilder message(String message) {
            response.message = message;
            return this;
        }

        public AuthResponseBuilder timestamp(String timestamp) {
            response.timestamp = timestamp;
            return this;
        }

        public AuthResponse build() {
            return response;
        }
    }

    public static class AuthData {

        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private long expiresIn;
        private UserResponse user;

        public AuthData() {
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }

        public String getTokenType() {
            return tokenType;
        }

        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }

        public long getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(long expiresIn) {
            this.expiresIn = expiresIn;
        }

        public UserResponse getUser() {
            return user;
        }

        public void setUser(UserResponse user) {
            this.user = user;
        }

        public static AuthDataBuilder builder() {
            return new AuthDataBuilder();
        }

        public static class AuthDataBuilder {

            private final AuthData data = new AuthData();

            public AuthDataBuilder accessToken(String accessToken) {
                data.accessToken = accessToken;
                return this;
            }

            public AuthDataBuilder refreshToken(String refreshToken) {
                data.refreshToken = refreshToken;
                return this;
            }

            public AuthDataBuilder tokenType(String tokenType) {
                data.tokenType = tokenType;
                return this;
            }

            public AuthDataBuilder expiresIn(long expiresIn) {
                data.expiresIn = expiresIn;
                return this;
            }

            public AuthDataBuilder user(UserResponse user) {
                data.user = user;
                return this;
            }

            public AuthData build() {
                return data;
            }
        }
    }
}
