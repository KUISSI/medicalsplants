package com.medicalsplants.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.medicalsplants.config.JwtProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final JwtProperties jwtProperties;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService, JwtProperties jwtProperties) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                String userIdStr = tokenProvider.getUserIdFromToken(jwt);
                UUID userId = UUID.fromString(userIdStr);
                UserDetails userDetails = userDetailsService.loadUserById(userId);

                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Log error silently
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // 1. Essaye d'abord le header Authorization
        String bearerToken = request.getHeader(jwtProperties.getHeaderName());
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtProperties.getTokenPrefix())) {
            return bearerToken.substring(jwtProperties.getTokenPrefix().length());
        }
        // 2. Sinon, essaye le cookie "jwt"
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/auth/login")
                || path.startsWith("/api/v1/auth/register")
                || path.startsWith("/api/v1/auth/verify-email")
                || path.startsWith("/api/v1/auth/forgot-password")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/actuator");
    }
}
