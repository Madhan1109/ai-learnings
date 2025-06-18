package com.example.insurance.service;

import com.example.insurance.model.Policy;
import com.example.insurance.repository.PolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PolicyServiceTest {
    @Mock
    private PolicyRepository repository;

    @InjectMocks
    private PolicyService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatePolicy() {
        Policy policy = Policy.builder().policyNumber("POL789").build();
        when(repository.save(policy)).thenReturn(policy);

        Policy saved = service.createPolicy(policy);
        assertEquals("POL789", saved.getPolicyNumber());
    }

    @Test
    void testGetPolicyById() {
        Policy policy = Policy.builder().policyNumber("POL789").build();
        when(repository.findById(1L)).thenReturn(Optional.of(policy));

        Optional<Policy> found = service.getPolicyById(1L);
        assertTrue(found.isPresent());
        assertEquals("POL789", found.get().getPolicyNumber());
    }
} 