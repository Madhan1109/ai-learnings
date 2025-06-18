package com.example.insurance.controller;

import com.example.insurance.model.Policy;
import com.example.insurance.model.User;
import com.example.insurance.service.PolicyService;
import com.example.insurance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    @Autowired
    private PolicyService policyService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createPolicy(@RequestBody Policy policy, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> user = userService.findByUsername(userDetails.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        policy.setUser(user.get());
        Policy created = policyService.createPolicy(policy);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPolicy(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<Policy> policy = policyService.getPolicyById(id);
        return policy.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Policy> getAllPolicies(@AuthenticationPrincipal UserDetails userDetails) {
        return policyService.getAllPolicies();
    }
} 