package com.ai.learnings.healthinsurance.policy.repository;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByPolicyNumber(String policyNumber);
} 