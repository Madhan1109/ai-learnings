package com.ai.learnings.healthinsurance.notification.controller;

import com.ai.learnings.healthinsurance.notification.model.Notification;
import com.ai.learnings.healthinsurance.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for Notification operations.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    /**
     * Constructor for dependency injection.
     * @param notificationService NotificationService instance
     */
    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Send a notification.
     * @param recipient Recipient email or phone
     * @param message Message content
     * @return Sent Notification
     */
    @PostMapping
    public ResponseEntity<Notification> sendNotification(@RequestParam String recipient, @RequestParam String message) {
        return ResponseEntity.ok(notificationService.sendNotification(recipient, message));
    }

    /**
     * Get all notifications.
     * @return List of notifications
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    /**
     * Get a notification by ID.
     * @param id Notification ID
     * @return Notification if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 