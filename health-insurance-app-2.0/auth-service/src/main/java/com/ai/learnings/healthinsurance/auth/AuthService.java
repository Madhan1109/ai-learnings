package com.ai.learnings.healthinsurance.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public AuthUser register(AuthUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return authUserRepository.save(user);
    }

    public Optional<AuthUser> login(String email, String password) {
        Optional<AuthUser> userOpt = authUserRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public Optional<AuthUser> findByEmail(String email) {
        return authUserRepository.findByEmail(email);
    }
} 