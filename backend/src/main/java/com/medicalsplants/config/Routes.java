package com.medicalsplants.config;

/**
 * Centralise les constantes de routes utilisées par la sécurité. Permet
 * d'éviter la duplication dans la configuration Spring Security.
 */
public final class Routes {

    private Routes() {
    }

    public static final String AUTH_BASE = "/api/v1/auth";
    public static final String[] AUTH_POST_PUBLIC = new String[]{
        AUTH_BASE + "/login",
        AUTH_BASE + "/register",
        AUTH_BASE + "/refresh",
        AUTH_BASE + "/forgot-password",
        AUTH_BASE + "/reset-password"
    };

    public static final String AUTH_VERIFY_EMAIL = AUTH_BASE + "/verify-email";

    public static final String[] DOCS_ACTUATOR = new String[]{
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/v3/api-docs/**",
        "/actuator/health",
        "/actuator/info",
        "/error"
    };

}
