package com.medicalsplants.exception;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Méthode utilitaire pour construire une réponse d'erreur
    private ResponseEntity<ErrorResponse> buildErrorResponse(String code, String message, HttpStatus status) {
        return buildErrorResponse(code, message, null, status);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(String code, String message,
            List<ErrorResponse.FieldErrorDetails> details, HttpStatus status) {
        ErrorResponse.ErrorDetails errorDetails = new ErrorResponse.ErrorDetails();
        errorDetails.setCode(code);
        errorDetails.setMessage(message);
        errorDetails.setDetails(details);
        ErrorResponse response = new ErrorResponse();
        response.setSuccess(false);
        response.setError(errorDetails);
        response.setTimestamp(Instant.now().toString());
        return new ResponseEntity<>(response, java.util.Objects.requireNonNull(status, "HttpStatus cannot be null"));
    }

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
        return buildErrorResponse(ex.getCode(), ex.getMessage(), ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<ErrorResponse.FieldErrorDetails> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> {
                    ErrorResponse.FieldErrorDetails fed = new ErrorResponse.FieldErrorDetails();
                    fed.setField(error.getField());
                    fed.setMessage(error.getDefaultMessage());
                    return fed;
                })
                .toList();

        return buildErrorResponse("VALIDATION_ERROR", "Validation failed", fieldErrors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleAuthenticationException(Exception ex) {
        return buildErrorResponse("UNAUTHORIZED", "Authentication failed: " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse("FORBIDDEN", ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        return buildErrorResponse("INTERNAL_ERROR", "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String name = ex.getName();
        Object value = ex.getValue();
        String message = String.format("Invalid value for '%s': '%s'. Expected a valid UUID.", name, value);
        return buildErrorResponse("BAD_REQUEST", message, HttpStatus.BAD_REQUEST);
    }
}
