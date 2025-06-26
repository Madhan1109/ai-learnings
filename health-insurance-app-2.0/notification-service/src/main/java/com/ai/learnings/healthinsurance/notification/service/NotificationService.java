package com.ai.learnings.healthinsurance.notification.service;

import com.ai.learnings.healthinsurance.notification.model.Notification;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for Notification operations.
 */
public interface NotificationService {
    /**
     * Send a notification to a recipient.
     * @param recipient Recipient email or phone
     * @param message Message content
     * @return Sent Notification
     */
    Notification sendNotification(String recipient, String message);

    /**
     * Get all notifications.
     * @return List of notifications
     */
    List<Notification> getAllNotifications();

    /**
     * Get a notification by its ID.
     * @param id Notification ID
     * @return Optional Notification
     */
    Optional<Notification> getNotificationById(Long id);
} 