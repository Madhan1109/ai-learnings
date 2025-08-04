package com.crm.authservice.service;

import com.crm.authservice.entity.User;
import com.crm.authservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // ========== AUTHENTICATION ==========

    public Map<String, Object> authenticate(String username, String password) {
        logger.info("=== AUTHENTICATION START ===");
        logger.info("Login attempt for username: {}", username);
        
        Map<String, Object> response = new HashMap<>();
        
        // Step 1: Find user by username
        logger.info("Step 1: Looking up user in database...");
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            logger.warn("User not found: {}", username);
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

        User user = userOpt.get();
        logger.info("User found: ID={}, Username={}, Email={}", user.getId(), user.getUsername(), user.getEmail());
        logger.info("Stored password hash: {}", user.getPassword());
        
        // Step 2: Check if account is locked
        logger.info("Step 2: Checking if account is locked...");
        if (user.getIsLocked()) {
            logger.warn("Account is locked for user: {}", username);
            response.put("success", false);
            response.put("message", "Account is locked");
            return response;
        }
        logger.info("Account is not locked");

        // Step 3: Check if account is active
        logger.info("Step 3: Checking if account is active...");
        if (!user.getIsActive()) {
            logger.warn("Account is deactivated for user: {}", username);
            response.put("success", false);
            response.put("message", "Account is deactivated");
            return response;
        }
        logger.info("Account is active");

        // Step 4: Check if account is expired
        logger.info("Step 4: Checking if account is expired...");
        if (!user.isAccountNonExpired()) {
            logger.warn("Account has expired for user: {}", username);
            response.put("success", false);
            response.put("message", "Account has expired");
            return response;
        }
        logger.info("Account is not expired");

        // Step 5: Verify password
        logger.info("Step 5: Verifying password...");
        logger.info("Input password: {}", password);
        logger.info("Stored hash: {}", user.getPassword());
        
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        logger.info("Password match result: {}", passwordMatches);
        
        if (!passwordMatches) {
            logger.warn("Password verification failed for user: {}", username);
            // Increment failed login attempts
            int currentAttempts = user.getFailedLoginAttempts();
            user.setFailedLoginAttempts(currentAttempts + 1);
            logger.info("Failed login attempts: {} -> {}", currentAttempts, user.getFailedLoginAttempts());
            
            // Lock account after 5 failed attempts
            if (user.getFailedLoginAttempts() >= 5) {
                user.setIsLocked(true);
                logger.warn("Account locked due to too many failed attempts: {}", username);
            }
            
            userRepository.save(user);
            
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

        logger.info("Password verification successful!");
        
        // Step 6: Success - Reset failed attempts and generate tokens
        logger.info("Step 6: Processing successful login...");
        user.setFailedLoginAttempts(0);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        logger.info("User login time updated and failed attempts reset");

        // Generate tokens
        logger.info("Generating JWT tokens...");
        String accessToken = jwtService.generateToken(user.getUsername(), user.getRoles());
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());
        logger.info("Tokens generated successfully");

        // Store refresh token in Redis
        logger.info("Storing refresh token in Redis...");
        redisTemplate.opsForValue().set("refresh_token:" + user.getUsername(), refreshToken);
        logger.info("Refresh token stored in Redis");

        response.put("success", true);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", createUserResponse(user));
        
        logger.info("=== AUTHENTICATION SUCCESS ===");
        return response;
    }

    // ========== USER MANAGEMENT ==========

    public User createUser(User user) {
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        
        // Set default role if none provided
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.addRole("USER");
        }
        
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Update basic info
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setEmail(userDetails.getEmail());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setIsActive(userDetails.getIsActive());
            user.setPreferences(userDetails.getPreferences());
            
            // Update password if provided
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                user.setPasswordChangedAt(LocalDateTime.now());
            }
            
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ========== TOKEN MANAGEMENT ==========

    public Map<String, Object> refreshToken(String refreshToken) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = jwtService.extractUsername(refreshToken);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid refresh token");
                return response;
            }

            User user = userOpt.get();
            
            // Verify refresh token is stored in Redis
            String storedRefreshToken = (String) redisTemplate.opsForValue().get("refresh_token:" + username);
            if (!refreshToken.equals(storedRefreshToken)) {
                response.put("success", false);
                response.put("message", "Invalid refresh token");
                return response;
            }

            // Generate new tokens
            String newAccessToken = jwtService.generateToken(user.getUsername(), user.getRoles());
            String newRefreshToken = jwtService.generateRefreshToken(user.getUsername());

            // Update stored refresh token
            redisTemplate.opsForValue().set("refresh_token:" + username, newRefreshToken);

            response.put("success", true);
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid refresh token");
        }
        
        return response;
    }

    public void logout(String username) {
        // Remove refresh token from Redis
        redisTemplate.delete("refresh_token:" + username);
    }

    public Map<String, Object> validateToken(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> tokenInfo = jwtService.getTokenInfo(token);
            if ((Boolean) tokenInfo.get("valid")) {
                response.put("valid", true);
                response.put("username", tokenInfo.get("username"));
                response.put("roles", tokenInfo.get("roles"));
            } else {
                response.put("valid", false);
                response.put("message", "Invalid token");
            }
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Invalid token");
        }
        
        return response;
    }

    // ========== ROLE MANAGEMENT ==========

    public User addRoleToUser(Long userId, String role) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.addRole(role);
            return userRepository.save(user);
        }
        return null;
    }

    public User removeRoleFromUser(Long userId, String role) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.removeRole(role);
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    // ========== SECURITY FEATURES ==========

    public User lockUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsLocked(true);
            return userRepository.save(user);
        }
        return null;
    }

    public User unlockUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsLocked(false);
            user.setFailedLoginAttempts(0);
            return userRepository.save(user);
        }
        return null;
    }

    public User deactivateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(false);
            return userRepository.save(user);
        }
        return null;
    }

    public User activateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(true);
            return userRepository.save(user);
        }
        return null;
    }

    // ========== PASSWORD MANAGEMENT ==========

    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Verify old password
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return false;
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setPasswordChangedAt(LocalDateTime.now());
            userRepository.save(user);
            
            return true;
        }
        return false;
    }

    public boolean resetPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Generate temporary password
            String tempPassword = generateTemporaryPassword();
            user.setPassword(passwordEncoder.encode(tempPassword));
            user.setPasswordChangedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // TODO: Send email with temporary password
            return true;
        }
        return false;
    }

    // ========== ANALYTICS ==========

    public CompletableFuture<Map<String, Object>> getAuthAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> analytics = new HashMap<>();
            
            analytics.put("totalUsers", userRepository.count());
            analytics.put("activeUsers", userRepository.countByIsActiveTrue());
            analytics.put("lockedUsers", userRepository.countByIsLockedTrue());
            analytics.put("usersByRole", userRepository.getUserCountByRole());
            
            return analytics;
        });
    }

    // ========== HELPER METHODS ==========

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("roles", user.getRoles());
        userResponse.put("isActive", user.getIsActive());
        userResponse.put("lastLogin", user.getLastLogin());
        userResponse.put("twoFactorEnabled", user.getTwoFactorEnabled());
        
        return userResponse;
    }

    private String generateTemporaryPassword() {
        // Generate a random 8-character password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    // ========== SEARCH AND FILTER ==========

    public List<User> searchUsers(String keyword) {
        return userRepository.searchByKeyword(keyword);
    }

    public List<User> getUsersByStatus(Boolean isActive, Boolean isLocked) {
        return userRepository.findByIsActiveAndIsLocked(isActive, isLocked);
    }

    public List<User> getRecentUsers(LocalDateTime since) {
        return userRepository.findByCreatedAtAfter(since);
    }
} 