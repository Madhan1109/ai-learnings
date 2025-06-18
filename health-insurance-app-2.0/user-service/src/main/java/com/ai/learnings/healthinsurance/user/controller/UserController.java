package com.ai.learnings.healthinsurance.user.controller;

import com.ai.learnings.healthinsurance.user.model.User;
import com.ai.learnings.healthinsurance.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping("/mobile/{mobileNumber}")
    public ResponseEntity<User> getUserByMobile(@PathVariable String mobileNumber) {
        Optional<User> user = userService.getUserByMobileNumber(mobileNumber);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
} 