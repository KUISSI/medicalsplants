package com.medicalsplants.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicalsplants.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ErrorResponse.ErrorDetails details = new ErrorResponse.ErrorDetails(
                "UNAUTHORIZED",
                "Authentication required.  Please login.",
                null
        );
        ErrorResponse errorResponse = new ErrorResponse(
                false,
                details,
                Instant.now().toString()
        );

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
