package com.ai.learnings.healthinsurance.policy.service;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import com.ai.learnings.healthinsurance.policy.repository.PolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PolicyServiceTest {
    @Mock
    private PolicyRepository policyRepository;

    @InjectMocks
    private PolicyService policyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSavePolicy() {
        Policy policy = Policy.builder().policyNumber("POL123").policyHolderName("Alice").years(2).price(10000).build();
        when(policyRepository.save(policy)).thenReturn(policy);
        Policy saved = policyService.savePolicy(policy);
        assertEquals("POL123", saved.getPolicyNumber());
    }

    @Test
    void testGetPolicyByNumber() {
        Policy policy = Policy.builder().policyNumber("POL123").policyHolderName("Alice").years(2).price(10000).build();
        when(policyRepository.findByPolicyNumber("POL123")).thenReturn(Optional.of(policy));
        Optional<Policy> found = policyService.getPolicyByNumber("POL123");
        assertTrue(found.isPresent());
        assertEquals("Alice", found.get().getPolicyHolderName());
    }
} 