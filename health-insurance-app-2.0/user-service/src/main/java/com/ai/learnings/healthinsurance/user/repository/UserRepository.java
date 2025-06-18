package com.ai.learnings.healthinsurance.user.repository;

import com.ai.learnings.healthinsurance.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobileNumber(String mobileNumber);
} 