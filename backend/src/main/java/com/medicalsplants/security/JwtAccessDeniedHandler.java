package com.medicalsplants.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicalsplants.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component

public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public JwtAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ErrorResponse.ErrorDetails details = new ErrorResponse.ErrorDetails(
                "FORBIDDEN",
                "Access denied.  Insufficient permissions.",
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
