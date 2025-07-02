package com.ai.learnings.healthinsurance.admin.controller;

import com.ai.learnings.healthinsurance.admin.model.Admin;
import com.ai.learnings.healthinsurance.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for Admin operations.
 */
@RestController
@RequestMapping("/api/admins")
public class AdminController {
    private final AdminService adminService;

    /**
     * Constructor for dependency injection.
     * @param adminService AdminService instance
     */
    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Create a new admin.
     * @param admin Admin to create
     * @return Created Admin
     */
    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    /**
     * Get all admins.
     * @return List of admins
     */
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    /**
     * Get an admin by ID.
     * @param id Admin ID
     * @return Admin if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an admin by ID.
     * @param id Admin ID
     * @return No content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
} 