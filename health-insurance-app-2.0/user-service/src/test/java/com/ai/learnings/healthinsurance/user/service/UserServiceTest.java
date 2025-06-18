package com.ai.learnings.healthinsurance.user.service;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveUser() {
        User user = User.builder().mobileNumber("1234567890").name("John").dob("1990-01-01").build();
        when(userRepository.save(user)).thenReturn(user);
        User saved = userService.saveUser(user);
        assertEquals("1234567890", saved.getMobileNumber());
    }

    @Test
    void testGetUserByMobileNumber() {
        User user = User.builder().mobileNumber("1234567890").name("John").dob("1990-01-01").build();
        when(userRepository.findByMobileNumber("1234567890")).thenReturn(Optional.of(user));
        Optional<User> found = userService.getUserByMobileNumber("1234567890");
        assertTrue(found.isPresent());
        assertEquals("John", found.get().getName());
    }
} 