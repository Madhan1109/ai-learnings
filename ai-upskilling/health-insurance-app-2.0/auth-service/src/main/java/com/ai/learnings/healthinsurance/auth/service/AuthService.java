package com.ai.learnings.healthinsurance.auth.service;

import com.ai.learnings.healthinsurance.auth.model.AuthUser;
import java.util.Optional;

/**
 * Service contract for authentication operations.
 */
public interface AuthService {
    /**
     * Register a new user or admin.
     * @param user AuthUser to register
     * @return Registered AuthUser
     */
    AuthUser register(AuthUser user);

    /**
     * Login with email and password.
     * @param email Email address
     * @param password Plain password
     * @return Optional AuthUser if credentials are valid
     */
    Optional<AuthUser> login(String email, String password);

    /**
     * Find a user by email.
     * @param email Email address
     * @return Optional AuthUser
     */
    Optional<AuthUser> findByEmail(String email);
} 