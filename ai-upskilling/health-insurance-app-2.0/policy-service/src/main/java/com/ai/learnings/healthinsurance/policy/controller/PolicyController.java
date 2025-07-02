package com.ai.learnings.healthinsurance.policy.controller;

import com.ai.learnings.healthinsurance.policy.model.Policy;
import com.ai.learnings.healthinsurance.policy.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    @Autowired
    private PolicyService policyService;

    @PostMapping
    public ResponseEntity<Policy> createPolicy(@RequestBody Policy policy) {
        return ResponseEntity.ok(policyService.savePolicy(policy));
    }

    @GetMapping("/number/{policyNumber}")
    public ResponseEntity<Policy> getPolicyByNumber(@PathVariable String policyNumber) {
        Optional<Policy> policy = policyService.getPolicyByNumber(policyNumber);
        return policy.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Policy> getAllPolicies() {
        return policyService.getAllPolicies();
    }
} 