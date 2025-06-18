package com.example.insurance.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PolicyTest {
    @Test
    void testPolicyBuilderAndGetters() {
        Policy policy = Policy.builder()
                .policyNumber("POL123")
                .holderName("John Doe")
                .age(30)
                .gender("Male")
                .planType("Premium")
                .sumInsured(500000)
                .premium(12000)
                .build();

        assertEquals("POL123", policy.getPolicyNumber());
        assertEquals("John Doe", policy.getHolderName());
        assertEquals(30, policy.getAge());
        assertEquals("Male", policy.getGender());
        assertEquals("Premium", policy.getPlanType());
        assertEquals(500000, policy.getSumInsured());
        assertEquals(12000, policy.getPremium());
    }
} 