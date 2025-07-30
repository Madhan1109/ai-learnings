package com.crm.notificationservice.repository;

import com.crm.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Basic queries
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);
    List<Notification> findByRecipientIdAndIsReadTrueOrderByCreatedAtDesc(Long recipientId);
    List<Notification> findByType(String type);
    List<Notification> findByPriority(String priority);
    List<Notification> findByIsReadFalse();
    List<Notification> findByIsSentTrue();

    // Time-based queries
    List<Notification> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Notification> findByCreatedAtAfter(LocalDateTime since);
    List<Notification> findByExpiresAtBefore(LocalDateTime before);

    // Search queries
    @Query("SELECT n FROM Notification n WHERE n.title LIKE %:keyword% OR n.message LIKE %:keyword%")
    List<Notification> searchByKeyword(@Param("keyword") String keyword);

    // Analytics queries
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.isRead = false")
    Long countByIsReadFalse();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.isSent = true")
    Long countByIsSentTrue();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId")
    Long countByRecipientId(@Param("recipientId") Long recipientId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId AND n.isRead = false")
    Long countByRecipientIdAndIsReadFalse(@Param("recipientId") Long recipientId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId AND n.isRead = true")
    Long countByRecipientIdAndIsReadTrue(@Param("recipientId") Long recipientId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId AND n.createdAt >= :since")
    Long countByRecipientIdAndCreatedAtAfter(@Param("recipientId") Long recipientId, @Param("since") LocalDateTime since);

    // Advanced analytics
    @Query("SELECT n.type, COUNT(n) FROM Notification n GROUP BY n.type")
    List<Object[]> getNotificationCountByType();

    @Query("SELECT n.priority, COUNT(n) FROM Notification n GROUP BY n.priority")
    List<Object[]> getNotificationCountByPriority();

    @Query("SELECT n.recipientId, COUNT(n) FROM Notification n GROUP BY n.recipientId ORDER BY COUNT(n) DESC")
    List<Object[]> getNotificationCountByRecipient();

    @Query("SELECT DATE(n.createdAt), COUNT(n) FROM Notification n WHERE n.createdAt >= :startDate GROUP BY DATE(n.createdAt) ORDER BY DATE(n.createdAt)")
    List<Object[]> getNotificationCountByDate(@Param("startDate") LocalDateTime startDate);

    // Performance queries
    @Query("SELECT n FROM Notification n WHERE n.createdAt < :date AND n.isRead = true")
    List<Notification> findOldReadNotifications(@Param("date") LocalDateTime date);

    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt < :now")
    List<Notification> findExpiredNotifications(@Param("now") LocalDateTime now);

    // Priority-based queries
    @Query("SELECT n FROM Notification n WHERE n.priority = 'URGENT' AND n.isRead = false")
    List<Notification> findUrgentUnreadNotifications();

    @Query("SELECT n FROM Notification n WHERE n.priority = 'HIGH' AND n.isRead = false")
    List<Notification> findHighPriorityUnreadNotifications();

    // Source-based queries
    @Query("SELECT n FROM Notification n WHERE n.sourceService = :sourceService")
    List<Notification> findBySourceService(@Param("sourceService") String sourceService);

    @Query("SELECT n FROM Notification n WHERE n.sourceId = :sourceId")
    List<Notification> findBySourceId(@Param("sourceId") String sourceId);

    // Summary statistics
    @Query("SELECT COUNT(n), COUNT(CASE WHEN n.isRead = true THEN 1 END), COUNT(CASE WHEN n.isSent = true THEN 1 END), COUNT(CASE WHEN n.priority = 'URGENT' THEN 1 END) FROM Notification n")
    Object[] getSummaryStatistics();

    @Query("SELECT n.type, COUNT(n), COUNT(CASE WHEN n.isRead = true THEN 1 END) FROM Notification n GROUP BY n.type")
    List<Object[]> getNotificationStatisticsByType();

    @Query("SELECT n.priority, COUNT(n), COUNT(CASE WHEN n.isRead = true THEN 1 END) FROM Notification n GROUP BY n.priority")
    List<Object[]> getNotificationStatisticsByPriority();
} 