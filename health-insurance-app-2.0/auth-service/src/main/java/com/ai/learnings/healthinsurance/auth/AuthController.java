package com.ai.learnings.healthinsurance.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthUser> register(@RequestBody AuthUser user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthUser> login(@RequestBody AuthUser user) {
        Optional<AuthUser> found = authService.login(user.getEmail(), user.getPassword());
        return found.map(ResponseEntity::ok).orElse(ResponseEntity.status(401).build());
    }
} 