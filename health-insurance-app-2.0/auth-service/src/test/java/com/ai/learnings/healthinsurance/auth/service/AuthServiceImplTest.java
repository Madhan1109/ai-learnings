package com.ai.learnings.healthinsurance.auth.service;

import com.ai.learnings.healthinsurance.auth.model.AuthUser;
import com.ai.learnings.healthinsurance.auth.repository.AuthUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {
    @Mock
    private AuthUserRepository authUserRepository;
    @Mock
    private BCryptPasswordEncoder passwordEncoder;
    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister() {
        AuthUser user = AuthUser.builder().email("test@example.com").password("pass").role("USER").build();
        when(passwordEncoder.encode("pass")).thenReturn("hashed");
        when(authUserRepository.save(any(AuthUser.class))).thenReturn(user);
        AuthUser saved = authService.register(user);
        assertNotNull(saved);
    }

    @Test
    void testLogin() {
        AuthUser user = AuthUser.builder().email("test@example.com").password("hashed").role("USER").build();
        when(authUserRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);
        Optional<AuthUser> found = authService.login("test@example.com", "pass");
        assertTrue(found.isPresent());
    }

    @Test
    void testFindByEmail() {
        AuthUser user = AuthUser.builder().email("test@example.com").build();
        when(authUserRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        Optional<AuthUser> found = authService.findByEmail("test@example.com");
        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
    }
} 