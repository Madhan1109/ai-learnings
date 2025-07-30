package com.crm.authservice.repository;

import com.crm.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Basic queries
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByIsActiveTrue();
    List<User> findByIsLockedTrue();
    List<User> findByIsActiveAndIsLocked(Boolean isActive, Boolean isLocked);

    // Role-based queries
    List<User> findByRolesContaining(String role);
    List<User> findByRolesIn(List<String> roles);

    // Time-based queries
    List<User> findByCreatedAtAfter(LocalDateTime since);
    List<User> findByLastLoginAfter(LocalDateTime since);
    List<User> findByPasswordChangedAtBefore(LocalDateTime before);

    // Security queries
    List<User> findByFailedLoginAttemptsGreaterThan(Integer attempts);
    List<User> findByAccountExpiresAtBefore(LocalDateTime before);

    // Search queries
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.email LIKE %:keyword% OR u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword%")
    List<User> searchByKeyword(@Param("keyword") String keyword);

    // Analytics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Long countByIsActiveTrue();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isLocked = true")
    Long countByIsLockedTrue();

    @Query("SELECT COUNT(u) FROM User u WHERE u.failedLoginAttempts > 0")
    Long countByFailedLoginAttemptsGreaterThanZero();

    @Query("SELECT u.roles, COUNT(u) FROM User u GROUP BY u.roles")
    List<Object[]> getUserCountByRole();

    @Query("SELECT DATE(u.createdAt), COUNT(u) FROM User u WHERE u.createdAt >= :startDate GROUP BY DATE(u.createdAt) ORDER BY DATE(u.createdAt)")
    List<Object[]> getUserRegistrationByDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT DATE(u.lastLogin), COUNT(u) FROM User u WHERE u.lastLogin >= :startDate GROUP BY DATE(u.lastLogin) ORDER BY DATE(u.lastLogin)")
    List<Object[]> getUserLoginByDate(@Param("startDate") LocalDateTime startDate);

    // Advanced analytics
    @Query("SELECT AVG(u.failedLoginAttempts) FROM User u")
    Double getAverageFailedLoginAttempts();

    @Query("SELECT COUNT(u) FROM User u WHERE u.twoFactorEnabled = true")
    Long countByTwoFactorEnabledTrue();

    @Query("SELECT u.roles, AVG(u.failedLoginAttempts) FROM User u GROUP BY u.roles")
    List<Object[]> getAverageFailedAttemptsByRole();

    // Security analytics
    @Query("SELECT COUNT(u) FROM User u WHERE u.passwordChangedAt < :date")
    Long countByPasswordChangedBefore(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.accountExpiresAt < :date")
    Long countByAccountExpiresBefore(@Param("date") LocalDateTime date);

    // Performance queries
    @Query("SELECT u FROM User u WHERE u.lastLogin IS NULL OR u.lastLogin < :date")
    List<User> findInactiveUsers(@Param("date") LocalDateTime date);

    @Query("SELECT u FROM User u WHERE u.failedLoginAttempts >= 3")
    List<User> findUsersWithHighFailedAttempts();

    // Role management queries
    @Query("SELECT DISTINCT u.roles FROM User u")
    List<String> findAllRoles();

    @Query("SELECT u FROM User u WHERE u.roles LIKE %:role%")
    List<User> findByRoleContaining(@Param("role") String role);

    // User status queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.isLocked = false")
    Long countActiveAndUnlockedUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = false OR u.isLocked = true")
    Long countInactiveOrLockedUsers();

    // Time-based analytics
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt <= :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :startDate AND u.lastLogin <= :endDate")
    Long countByLastLoginBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Summary statistics
    @Query("SELECT COUNT(u), COUNT(CASE WHEN u.isActive = true THEN 1 END), COUNT(CASE WHEN u.isLocked = true THEN 1 END), COUNT(CASE WHEN u.twoFactorEnabled = true THEN 1 END) FROM User u")
    Object[] getSummaryStatistics();
} 