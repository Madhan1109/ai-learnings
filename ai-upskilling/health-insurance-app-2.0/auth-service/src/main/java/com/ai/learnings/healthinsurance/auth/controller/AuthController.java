package com.ai.learnings.healthinsurance.auth.controller;

import com.ai.learnings.healthinsurance.auth.model.AuthUser;
import com.ai.learnings.healthinsurance.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

/**
 * REST controller for authentication operations.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    /**
     * Constructor for dependency injection.
     * @param authService AuthService instance
     */
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user or admin.
     * @param user AuthUser to register
     * @return Registered AuthUser
     */
    @PostMapping("/register")
    public ResponseEntity<AuthUser> register(@RequestBody AuthUser user) {
        return ResponseEntity.ok(authService.register(user));
    }

    /**
     * Login with email and password.
     * @param user AuthUser with email and password
     * @return AuthUser if credentials are valid, 401 otherwise
     */
    @PostMapping("/login")
    public ResponseEntity<AuthUser> login(@RequestBody AuthUser user) {
        Optional<AuthUser> found = authService.login(user.getEmail(), user.getPassword());
        return found.map(ResponseEntity::ok).orElse(ResponseEntity.status(401).build());
    }
} 