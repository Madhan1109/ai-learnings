package com.ai.learnings.healthinsurance.policy.service;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import com.ai.learnings.healthinsurance.policy.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of PolicyService.
 */
@Service
public class PolicyServiceImpl implements PolicyService {
    private final PolicyRepository policyRepository;

    /**
     * Constructor for dependency injection.
     * @param policyRepository PolicyRepository instance
     */
    @Autowired
    public PolicyServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    /** {@inheritDoc} */
    @Override
    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    /** {@inheritDoc} */
    @Override
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    /** {@inheritDoc} */
    @Override
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    /** {@inheritDoc} */
    @Override
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }
} 