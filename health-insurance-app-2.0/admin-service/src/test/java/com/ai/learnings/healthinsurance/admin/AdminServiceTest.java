package com.ai.learnings.healthinsurance.admin;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {
    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAdmin() {
        Admin admin = Admin.builder().name("John Doe").email("john@example.com").password("pass").build();
        when(adminRepository.save(admin)).thenReturn(admin);
        Admin saved = adminService.saveAdmin(admin);
        assertEquals("John Doe", saved.getName());
    }

    @Test
    void testGetAdminById() {
        Admin admin = Admin.builder().name("John Doe").email("john@example.com").password("pass").build();
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        Optional<Admin> found = adminService.getAdminById(1L);
        assertTrue(found.isPresent());
        assertEquals("John Doe", found.get().getName());
    }
} 