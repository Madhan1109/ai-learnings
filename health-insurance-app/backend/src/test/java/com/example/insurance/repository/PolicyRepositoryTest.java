package com.example.insurance.repository;

import com.example.insurance.model.Policy;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class PolicyRepositoryTest {
    @Autowired
    private PolicyRepository repository;

    @Test
    void testSaveAndFindByPolicyNumber() {
        Policy policy = Policy.builder()
                .policyNumber("POL456")
                .holderName("Jane Doe")
                .age(28)
                .gender("Female")
                .planType("Basic")
                .sumInsured(300000)
                .premium(8000)
                .build();

        repository.save(policy);

        Optional<Policy> found = repository.findByPolicyNumber("POL456");
        assertTrue(found.isPresent());
        assertEquals("Jane Doe", found.get().getHolderName());
    }
} 