package com.crm.notificationservice.service;

import com.crm.notificationservice.entity.Notification;
import com.crm.notificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // ========== NOTIFICATION MANAGEMENT ==========

    public Notification createNotification(Notification notification) {
        // Set default values
        if (notification.getPriority() == null) {
            notification.setPriority("MEDIUM");
        }
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        if (notification.getIsSent() == null) {
            notification.setIsSent(false);
        }

        Notification savedNotification = notificationRepository.save(notification);
        
        // Send real-time notification
        sendRealTimeNotification(savedNotification);
        
        return savedNotification;
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    public List<Notification> getUnreadNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId);
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setTitle(notificationDetails.getTitle());
            notification.setMessage(notificationDetails.getMessage());
            notification.setType(notificationDetails.getType());
            notification.setPriority(notificationDetails.getPriority());
            notification.setActionUrl(notificationDetails.getActionUrl());
            notification.setActionText(notificationDetails.getActionText());
            notification.setMetadata(notificationDetails.getMetadata());
            
            return notificationRepository.save(notification);
        }
        return null;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // ========== REAL-TIME NOTIFICATIONS ==========

    public void sendRealTimeNotification(Notification notification) {
        // Send to specific user
        messagingTemplate.convertAndSendToUser(
            notification.getRecipientId().toString(),
            "/queue/notifications",
            createNotificationPayload(notification)
        );

        // Send to general topic for broadcasting
        messagingTemplate.convertAndSend(
            "/topic/notifications",
            createNotificationPayload(notification)
        );

        // Mark as sent
        notification.markAsSent();
        notificationRepository.save(notification);
    }

    public void sendBulkNotification(List<Long> recipientIds, Notification notification) {
        for (Long recipientId : recipientIds) {
            Notification individualNotification = new Notification(
                recipientId,
                notification.getTitle(),
                notification.getMessage(),
                notification.getType()
            );
            individualNotification.setPriority(notification.getPriority());
            individualNotification.setActionUrl(notification.getActionUrl());
            individualNotification.setActionText(notification.getActionText());
            individualNotification.setMetadata(notification.getMetadata());
            
            createNotification(individualNotification);
        }
    }

    public void broadcastNotification(Notification notification) {
        // Send to all connected users
        messagingTemplate.convertAndSend(
            "/topic/broadcast",
            createNotificationPayload(notification)
        );
    }

    // ========== NOTIFICATION ACTIONS ==========

    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.markAsRead();
            return notificationRepository.save(notification);
        }
        return null;
    }

    public void markAllAsRead(Long recipientId) {
        List<Notification> unreadNotifications = getUnreadNotificationsByRecipient(recipientId);
        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    public void markAsSent(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.markAsSent();
            notificationRepository.save(notification);
        }
    }

    // ========== NOTIFICATION TYPES ==========

    public Notification createSystemNotification(Long recipientId, String title, String message) {
        Notification notification = new Notification(recipientId, title, message, "SYSTEM");
        notification.setPriority("LOW");
        return createNotification(notification);
    }

    public Notification createAlertNotification(Long recipientId, String title, String message) {
        Notification notification = new Notification(recipientId, title, message, "ALERT");
        notification.setPriority("HIGH");
        return createNotification(notification);
    }

    public Notification createUrgentNotification(Long recipientId, String title, String message) {
        Notification notification = new Notification(recipientId, title, message, "URGENT");
        notification.setPriority("URGENT");
        return createNotification(notification);
    }

    public Notification createTaskNotification(Long recipientId, String title, String message, String taskId) {
        Notification notification = new Notification(recipientId, title, message, "TASK");
        notification.setActionUrl("/tasks/" + taskId);
        notification.setActionText("View Task");
        notification.setSourceId(taskId);
        return createNotification(notification);
    }

    public Notification createSalesNotification(Long recipientId, String title, String message, String opportunityId) {
        Notification notification = new Notification(recipientId, title, message, "SALES");
        notification.setActionUrl("/opportunities/" + opportunityId);
        notification.setActionText("View Opportunity");
        notification.setSourceId(opportunityId);
        return createNotification(notification);
    }

    // ========== ANALYTICS ==========

    public CompletableFuture<Map<String, Object>> getNotificationAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> analytics = new HashMap<>();
            
            analytics.put("totalNotifications", notificationRepository.count());
            analytics.put("unreadNotifications", notificationRepository.countByIsReadFalse());
            analytics.put("sentNotifications", notificationRepository.countByIsSentTrue());
            analytics.put("notificationsByType", notificationRepository.getNotificationCountByType());
            analytics.put("notificationsByPriority", notificationRepository.getNotificationCountByPriority());
            
            return analytics;
        });
    }

    public Map<String, Object> getRecipientAnalytics(Long recipientId) {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalNotifications", notificationRepository.countByRecipientId(recipientId));
        analytics.put("unreadNotifications", notificationRepository.countByRecipientIdAndIsReadFalse(recipientId));
        analytics.put("readNotifications", notificationRepository.countByRecipientIdAndIsReadTrue(recipientId));
        analytics.put("recentNotifications", notificationRepository.countByRecipientIdAndCreatedAtAfter(recipientId, LocalDateTime.now().minusDays(7)));
        
        return analytics;
    }

    // ========== SEARCH AND FILTER ==========

    public List<Notification> searchNotifications(String keyword) {
        return notificationRepository.searchByKeyword(keyword);
    }

    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByType(type);
    }

    public List<Notification> getNotificationsByPriority(String priority) {
        return notificationRepository.findByPriority(priority);
    }

    public List<Notification> getNotificationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return notificationRepository.findByCreatedAtBetween(startDate, endDate);
    }

    // ========== BULK OPERATIONS ==========

    public List<Notification> createNotifications(List<Notification> notifications) {
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        
        // Send real-time notifications
        for (Notification notification : savedNotifications) {
            sendRealTimeNotification(notification);
        }
        
        return savedNotifications;
    }

    public void deleteExpiredNotifications() {
        List<Notification> expiredNotifications = notificationRepository.findByExpiresAtBefore(LocalDateTime.now());
        notificationRepository.deleteAll(expiredNotifications);
    }

    // ========== HELPER METHODS ==========

    private Map<String, Object> createNotificationPayload(Notification notification) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", notification.getId());
        payload.put("recipientId", notification.getRecipientId());
        payload.put("title", notification.getTitle());
        payload.put("message", notification.getMessage());
        payload.put("type", notification.getType());
        payload.put("priority", notification.getPriority());
        payload.put("actionUrl", notification.getActionUrl());
        payload.put("actionText", notification.getActionText());
        payload.put("createdAt", notification.getCreatedAt());
        payload.put("timestamp", System.currentTimeMillis());
        
        return payload;
    }

    // ========== CACHE MANAGEMENT ==========

    public void clearNotificationCache() {
        redisTemplate.delete("notifications");
    }

    // ========== ADVANCED FEATURES ==========

    public void sendScheduledNotification(Notification notification, LocalDateTime scheduledTime) {
        // Store in Redis for scheduled delivery
        String key = "scheduled_notification:" + notification.getId();
        redisTemplate.opsForValue().set(key, notification);
        
        // TODO: Implement scheduler to send at scheduled time
    }

    public void sendPeriodicNotification(Long recipientId, String title, String message, String cronExpression) {
        // TODO: Implement periodic notification using cron expressions
    }

    public void sendConditionalNotification(Long recipientId, String title, String message, String condition) {
        // TODO: Implement conditional notification based on business rules
    }
} 