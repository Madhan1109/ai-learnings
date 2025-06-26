package com.ai.learnings.healthinsurance.policy.service;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import com.ai.learnings.healthinsurance.policy.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for Policy operations.
 */
public interface PolicyService {
    /**
     * Create a new policy.
     * @param policy Policy to create
     * @return Created Policy
     */
    Policy createPolicy(Policy policy);

    /**
     * Get all policies.
     * @return List of policies
     */
    List<Policy> getAllPolicies();

    /**
     * Get a policy by its ID.
     * @param id Policy ID
     * @return Optional Policy
     */
    Optional<Policy> getPolicyById(Long id);

    /**
     * Delete a policy by its ID.
     * @param id Policy ID
     */
    void deletePolicy(Long id);
}

@Service
public class PolicyServiceImpl implements PolicyService {
    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    @Override
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    @Override
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }
} 