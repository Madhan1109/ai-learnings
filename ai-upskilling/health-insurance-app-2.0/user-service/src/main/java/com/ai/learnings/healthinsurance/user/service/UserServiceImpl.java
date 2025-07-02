package com.ai.learnings.healthinsurance.user.service;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of UserService.
 */
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    /**
     * Constructor for dependency injection.
     * @param userRepository UserRepository instance
     */
    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** {@inheritDoc} */
    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /** {@inheritDoc} */
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** {@inheritDoc} */
    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /** {@inheritDoc} */
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
} 