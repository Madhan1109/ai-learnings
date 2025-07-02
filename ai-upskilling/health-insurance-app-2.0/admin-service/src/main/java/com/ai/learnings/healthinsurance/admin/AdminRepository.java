package com.ai.learnings.healthinsurance.admin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Additional query methods if needed
} 