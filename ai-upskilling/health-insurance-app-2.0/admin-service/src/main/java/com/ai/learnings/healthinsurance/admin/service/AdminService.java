package com.ai.learnings.healthinsurance.admin.service;

import com.ai.learnings.healthinsurance.admin.model.Admin;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for Admin operations.
 */
public interface AdminService {
    /**
     * Create a new admin.
     * @param admin Admin to create
     * @return Created Admin
     */
    Admin createAdmin(Admin admin);

    /**
     * Get all admins.
     * @return List of admins
     */
    List<Admin> getAllAdmins();

    /**
     * Get an admin by its ID.
     * @param id Admin ID
     * @return Optional Admin
     */
    Optional<Admin> getAdminById(Long id);

    /**
     * Delete an admin by its ID.
     * @param id Admin ID
     */
    void deleteAdmin(Long id);
} 