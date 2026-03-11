package com.medicalsplants.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.medicalsplants.security.JwtAccessDeniedHandler;
import com.medicalsplants.security.JwtAuthenticationEntryPoint;
import com.medicalsplants.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint,
            JwtAccessDeniedHandler accessDeniedHandler,
            UserDetailsService userDetailsService,
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Code d'activation du CSRF avec des exceptions pour les endpoints d'authentification et de reviews
                // .csrf(csrf -> csrf
                // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                // .ignoringRequestMatchers(
                //         "/api/v1/auth/login",
                //         "/api/v1/auth/register",
                //         "/api/v1/auth/forgot-password",
                //         "/api/v1/auth/verify-email",
                //         "/api/v1/auth/resend-verification",
                //         "/api/v1/reviews"
                // )
                // )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler))
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, Routes.AUTH_POST_PUBLIC).permitAll()
                .requestMatchers(HttpMethod.GET, Routes.AUTH_VERIFY_EMAIL).permitAll()
                .requestMatchers(Routes.DOCS_ACTUATOR).permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
