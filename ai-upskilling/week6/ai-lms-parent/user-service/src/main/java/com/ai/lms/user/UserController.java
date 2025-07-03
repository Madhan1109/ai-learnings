package com.ai.lms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<User> register(@RequestBody User user) {
        // In production, hash the password before saving!
        return userRepository.save(user);
    }

    @GetMapping("/by-username/{username}")
    public Mono<User> getByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/by-email/{email}")
    public Mono<User> getByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }
} 