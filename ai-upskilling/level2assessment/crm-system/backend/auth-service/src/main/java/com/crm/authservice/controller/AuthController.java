package com.crm.authservice.controller;

import com.crm.authservice.entity.User;
import com.crm.authservice.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    // ========== AUTHENTICATION ENDPOINTS ==========

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        logger.info("=== LOGIN REQUEST RECEIVED ===");
        logger.info("Request body: {}", loginRequest);
        
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        logger.info("Extracted username: {}", username);
        logger.info("Extracted password: {}", password != null ? "***HIDDEN***" : "NULL");
        
        Map<String, Object> response = authService.authenticate(username, password);
        
        logger.info("Authentication response: {}", response);
        logger.info("=== LOGIN REQUEST COMPLETED ===");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> refreshRequest) {
        String refreshToken = refreshRequest.get("refreshToken");
        Map<String, Object> response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody Map<String, String> logoutRequest) {
        try {
            String username = logoutRequest.get("username");
            
            if (username == null || username.trim().isEmpty()) {
                logger.warn("Logout request received with null or empty username");
                Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Username is required for logout"
                );
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Logout request received for user: {}", username);
            authService.logout(username);
            
            Map<String, Object> response = Map.of("success", true, "message", "Logged out successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error during logout request", e);
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error during logout"
            );
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> tokenRequest) {
        String token = tokenRequest.get("token");
        Map<String, Object> response = authService.validateToken(token);
        return ResponseEntity.ok(response);
    }

    // ========== USER MANAGEMENT ENDPOINTS ==========

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = authService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = authService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = authService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = authService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = authService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // ========== ROLE MANAGEMENT ENDPOINTS ==========

    @PostMapping("/users/{id}/roles/{role}")
    public ResponseEntity<User> addRoleToUser(@PathVariable Long id, @PathVariable String role) {
        User user = authService.addRoleToUser(id, role);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}/roles/{role}")
    public ResponseEntity<User> removeRoleFromUser(@PathVariable Long id, @PathVariable String role) {
        User user = authService.removeRoleFromUser(id, role);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = authService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    // ========== SECURITY ENDPOINTS ==========

    @PostMapping("/users/{id}/lock")
    public ResponseEntity<User> lockUser(@PathVariable Long id) {
        User user = authService.lockUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users/{id}/unlock")
    public ResponseEntity<User> unlockUser(@PathVariable Long id) {
        User user = authService.unlockUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        User user = authService.deactivateUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = authService.activateUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== PASSWORD MANAGEMENT ENDPOINTS ==========

    @PostMapping("/users/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordRequest) {
        String oldPassword = passwordRequest.get("oldPassword");
        String newPassword = passwordRequest.get("newPassword");
        
        boolean success = authService.changePassword(id, oldPassword, newPassword);
        Map<String, Object> response = Map.of(
            "success", success,
            "message", success ? "Password changed successfully" : "Invalid old password"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> resetRequest) {
        String email = resetRequest.get("email");
        boolean success = authService.resetPassword(email);
        Map<String, Object> response = Map.of(
            "success", success,
            "message", success ? "Password reset email sent" : "Email not found"
        );
        return ResponseEntity.ok(response);
    }

    // ========== SEARCH AND FILTER ENDPOINTS ==========

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        List<User> users = authService.searchUsers(keyword);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/status")
    public ResponseEntity<List<User>> getUsersByStatus(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isLocked) {
        List<User> users = authService.getUsersByStatus(isActive, isLocked);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/recent")
    public ResponseEntity<List<User>> getRecentUsers(@RequestParam(defaultValue = "7") Integer daysAgo) {
        LocalDateTime since = LocalDateTime.now().minusDays(daysAgo);
        List<User> users = authService.getRecentUsers(since);
        return ResponseEntity.ok(users);
    }

    // ========== ANALYTICS ENDPOINTS ==========

    @GetMapping("/analytics")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> getAuthAnalytics() {
        return authService.getAuthAnalyticsAsync()
                .thenApply(ResponseEntity::ok);
    }

    // ========== HEALTH CHECK ==========

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth Service is running!");
    }

    // ========== SECURITY SUMMARY ==========

    @GetMapping("/security/summary")
    public ResponseEntity<Map<String, Object>> getSecuritySummary() {
        Map<String, Object> summary = Map.of(
            "totalUsers", authService.getAllUsers().size(),
            "activeUsers", authService.getAllUsers().stream().filter(User::getIsActive).count(),
            "lockedUsers", authService.getAllUsers().stream().filter(User::getIsLocked).count(),
            "twoFactorEnabled", authService.getAllUsers().stream().filter(User::getTwoFactorEnabled).count(),
            "recentLogins", authService.getAllUsers().stream().filter(u -> u.getLastLogin() != null && 
                u.getLastLogin().isAfter(LocalDateTime.now().minusDays(7))).count()
        );
        return ResponseEntity.ok(summary);
    }

    // ========== TOKEN INFO ENDPOINT ==========

    @GetMapping("/token/info")
    public ResponseEntity<Map<String, Object>> getTokenInfo(@RequestParam String token) {
        Map<String, Object> tokenInfo = authService.validateToken(token);
        return ResponseEntity.ok(tokenInfo);
    }

    // ========== USER PROFILE ENDPOINTS ==========

    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long id) {
        Optional<User> userOpt = authService.getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("fullName", user.getFullName());
            profile.put("roles", user.getRoles());
            profile.put("isActive", user.getIsActive());
            profile.put("lastLogin", user.getLastLogin());
            profile.put("twoFactorEnabled", user.getTwoFactorEnabled());
            profile.put("preferences", user.getPreferences());
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody User profile) {
        User updatedUser = authService.updateUser(id, profile);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== BULK OPERATIONS ==========

    @PostMapping("/users/bulk")
    public ResponseEntity<List<User>> createUsers(@RequestBody List<User> users) {
        List<User> createdUsers = users.stream()
                .map(authService::createUser)
                .toList();
        return ResponseEntity.ok(createdUsers);
    }

    // ========== ADMIN ENDPOINTS ==========

    @GetMapping("/admin/users/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        List<User> users = authService.getAllUsers().stream()
                .filter(User::getIsActive)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/locked")
    public ResponseEntity<List<User>> getLockedUsers() {
        List<User> users = authService.getAllUsers().stream()
                .filter(User::getIsLocked)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/inactive")
    public ResponseEntity<List<User>> getInactiveUsers() {
        List<User> users = authService.getAllUsers().stream()
                .filter(u -> !u.getIsActive())
                .toList();
        return ResponseEntity.ok(users);
    }
} 