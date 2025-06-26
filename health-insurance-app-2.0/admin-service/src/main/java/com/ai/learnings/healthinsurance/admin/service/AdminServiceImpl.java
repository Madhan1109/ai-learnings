package com.ai.learnings.healthinsurance.admin.service;

import com.ai.learnings.healthinsurance.admin.model.Admin;
import com.ai.learnings.healthinsurance.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of AdminService.
 */
@Service
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;

    /**
     * Constructor for dependency injection.
     * @param adminRepository AdminRepository instance
     */
    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    /** {@inheritDoc} */
    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    /** {@inheritDoc} */
    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    /** {@inheritDoc} */
    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    /** {@inheritDoc} */
    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
} 