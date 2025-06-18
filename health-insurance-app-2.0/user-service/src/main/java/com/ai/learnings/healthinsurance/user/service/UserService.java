package com.ai.learnings.healthinsurance.user.service;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByMobileNumber(String mobileNumber) {
        return userRepository.findByMobileNumber(mobileNumber);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
