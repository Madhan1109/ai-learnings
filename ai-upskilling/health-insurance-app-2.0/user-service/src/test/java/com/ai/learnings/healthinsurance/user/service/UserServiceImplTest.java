package com.ai.learnings.healthinsurance.user.service;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        User user = User.builder().name("Alice").build();
        when(userRepository.save(user)).thenReturn(user);
        User saved = userService.createUser(user);
        assertEquals("Alice", saved.getName());
    }

    @Test
    void testGetAllUsers() {
        List<User> users = Arrays.asList(User.builder().name("A").build(), User.builder().name("B").build());
        when(userRepository.findAll()).thenReturn(users);
        List<User> result = userService.getAllUsers();
        assertEquals(2, result.size());
    }

    @Test
    void testGetUserById() {
        User user = User.builder().name("Alice").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Optional<User> found = userService.getUserById(1L);
        assertTrue(found.isPresent());
        assertEquals("Alice", found.get().getName());
    }

    @Test
    void testDeleteUser() {
        userService.deleteUser(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }
} 