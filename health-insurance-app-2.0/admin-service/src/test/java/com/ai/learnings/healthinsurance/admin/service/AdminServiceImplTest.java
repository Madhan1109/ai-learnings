package com.ai.learnings.healthinsurance.admin.service;

import com.ai.learnings.healthinsurance.admin.model.Admin;
import com.ai.learnings.healthinsurance.admin.repository.AdminRepository;
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

class AdminServiceImplTest {
    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAdmin() {
        Admin admin = Admin.builder().name("John").build();
        when(adminRepository.save(admin)).thenReturn(admin);
        Admin saved = adminService.createAdmin(admin);
        assertEquals("John", saved.getName());
    }

    @Test
    void testGetAllAdmins() {
        List<Admin> admins = Arrays.asList(Admin.builder().name("A").build(), Admin.builder().name("B").build());
        when(adminRepository.findAll()).thenReturn(admins);
        List<Admin> result = adminService.getAllAdmins();
        assertEquals(2, result.size());
    }

    @Test
    void testGetAdminById() {
        Admin admin = Admin.builder().name("John").build();
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        Optional<Admin> found = adminService.getAdminById(1L);
        assertTrue(found.isPresent());
        assertEquals("John", found.get().getName());
    }

    @Test
    void testDeleteAdmin() {
        adminService.deleteAdmin(1L);
        verify(adminRepository, times(1)).deleteById(1L);
    }
} 