package com.medicalsplants.service;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ConflictException;
import com.medicalsplants.exception.UnauthorizedException;
import com.medicalsplants.model.dto.request.LoginRequest;
import com.medicalsplants.model.dto.request.RegisterRequest;
import com.medicalsplants.model.dto.response.AuthResponse;
import com.medicalsplants.model.dto.response.MessageResponse;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.Role;
import com.medicalsplants.model.enums.UserStatus;
import com.medicalsplants.model.mapper.UserMapper;
import com.medicalsplants.repository.RefreshTokenRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.security.JwtTokenProvider;
// import com.medicalsplants.util.UlidGenerator; // Removed: not used and does not exist
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"))
                .email("test@example. com")
                .passwordHash("hashedPassword")
                .pseudo("TestUser")
                .firstname("Test")
                .lastname("User")
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .isActive(true)
                .isEmailVerified(true)
                .build();
    }

    @Nested
    @DisplayName("Register Tests")
    class RegisterTests {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() {
            // Given
            RegisterRequest request = RegisterRequest.builder()
                    .email("newuser@example.com")
                    .password("Password123!")
                    .confirmPassword("Password123!")
                    .pseudo("NewUser")
                    .firstname("New")
                    .lastname("User")
                    .build();

            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.existsByPseudo(anyString())).thenReturn(false);
            // id généré automatiquement par le service
            when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            MessageResponse response = authService.register(request);

            // Then
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getMessage()).contains("Registration successful");
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when passwords don't match")
        void shouldThrowExceptionWhenPasswordsDontMatch() {
            // Given
            RegisterRequest request = RegisterRequest.builder()
                    .email("test@example.com")
                    .password("Password123!")
                    .confirmPassword("DifferentPassword!")
                    .pseudo("TestUser")
                    .build();

            // When/Then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Passwords do not match");
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            // Given
            RegisterRequest request = RegisterRequest.builder()
                    .email("existing@example.com")
                    .password("Password123!")
                    .confirmPassword("Password123!")
                    .pseudo("NewUser")
                    .build();

            when(userRepository.existsByEmail(anyString())).thenReturn(true);

            // When/Then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("email already exists");
        }

        @Test
        @DisplayName("Should throw exception when pseudo already exists")
        void shouldThrowExceptionWhenPseudoExists() {
            // Given
            RegisterRequest request = RegisterRequest.builder()
                    .email("new@example.com")
                    .password("Password123!")
                    .confirmPassword("Password123!")
                    .pseudo("ExistingPseudo")
                    .build();

            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.existsByPseudo(anyString())).thenReturn(true);

            // When/Then
            assertThatThrownBy(() -> authService.register(request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("pseudo is already taken");
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfully() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .email("test@example.com")
                    .password("Password123!")
                    .build();

            CustomUserDetails userDetails = CustomUserDetails.fromUser(testUser);
            UsernamePasswordAuthenticationToken authentication
                    = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            when(authenticationManager.authenticate(any())).thenReturn(authentication);
            when(jwtTokenProvider.generateAccessToken(any(CustomUserDetails.class))).thenReturn("accessToken");
            when(jwtTokenProvider.generateRefreshToken(any(CustomUserDetails.class))).thenReturn("refreshToken");
            when(jwtTokenProvider.getExpirationInSeconds()).thenReturn(900L);
            when(jwtTokenProvider.getRefreshExpirationInSeconds()).thenReturn(604800L);
            when(userRepository.findById(any(java.util.UUID.class))).thenReturn(Optional.of(testUser));
            // id généré automatiquement par le service

            // When
            AuthResponse response = authService.login(request);

            // Then
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getData().getAccessToken()).isEqualTo("accessToken");
            assertThat(response.getData().getRefreshToken()).isEqualTo("refreshToken");
            verify(userRepository).updateLastLoginAt(eq(testUser.getId()), any());
        }

        @Test
        @DisplayName("Should throw exception with invalid credentials")
        void shouldThrowExceptionWithInvalidCredentials() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .email("test@example.com")
                    .password("WrongPassword!")
                    .build();

            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When/Then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessageContaining("Invalid email or password");
        }
    }

    @Nested
    @DisplayName("Logout Tests")
    class LogoutTests {

        @Test
        @DisplayName("Should logout successfully")
        void shouldLogoutSuccessfully() {
            // When
            MessageResponse response = authService.logout("someRefreshToken");

            // Then
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getMessage()).contains("Logged out");
        }

        @Test
        @DisplayName("Should handle null refresh token gracefully")
        void shouldHandleNullRefreshToken() {
            // When
            MessageResponse response = authService.logout(null);

            // Then
            assertThat(response.isSuccess()).isTrue();
        }
    }
}
