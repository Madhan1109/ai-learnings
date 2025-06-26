package com.ai.learnings.healthinsurance.user.service;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for User operations.
 */
public interface UserService {
    /**
     * Create a new user.
     * @param user User to create
     * @return Created User
     */
    User createUser(User user);

    /**
     * Get all users.
     * @return List of users
     */
    List<User> getAllUsers();

    /**
     * Get a user by its ID.
     * @param id User ID
     * @return Optional User
     */
    Optional<User> getUserById(Long id);

    /**
     * Delete a user by its ID.
     * @param id User ID
     */
    void deleteUser(Long id);
}
