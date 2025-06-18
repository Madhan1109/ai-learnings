package com.ai.learnings.healthinsurance.policy.service;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import com.ai.learnings.healthinsurance.policy.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyService {
    @Autowired
    private PolicyRepository policyRepository;

    public Policy savePolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    public Optional<Policy> getPolicyByNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber);
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
} 