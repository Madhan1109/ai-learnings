package com.example.insurance.service;

import com.example.insurance.model.Policy;
import com.example.insurance.model.User;
import com.example.insurance.repository.PolicyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyService {
    private static final Logger logger = LoggerFactory.getLogger(PolicyService.class);
    @Autowired
    private PolicyRepository policyRepository;

    public Policy createPolicy(Policy policy) {
        logger.info("Creating policy: {}", policy.getPolicyNumber());
        return policyRepository.save(policy);
    }

    public Optional<Policy> getPolicyById(Long id) {
        logger.debug("Getting policy by id: {}", id);
        return policyRepository.findById(id);
    }

    public Optional<Policy> getPolicyByPolicyNumber(String policyNumber) {
        logger.debug("Getting policy by policyNumber: {}", policyNumber);
        return policyRepository.findByPolicyNumber(policyNumber);
    }

    public List<Policy> getPoliciesByUserId(Long userId) {
        logger.debug("Getting policies by userId: {}", userId);
        return policyRepository.findByUserId(userId);
    }

    public List<Policy> getAllPolicies() {
        logger.debug("Getting all policies");
        return policyRepository.findAll();
    }
} 