package com.crm.notificationservice.controller;

import com.crm.notificationservice.entity.Notification;
import com.crm.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ========== NOTIFICATION MANAGEMENT ENDPOINTS ==========

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.createNotification(notification);
        return ResponseEntity.ok(createdNotification);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipient(@PathVariable Long recipientId) {
        List<Notification> notifications = notificationService.getNotificationsByRecipient(recipientId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByRecipient(@PathVariable Long recipientId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByRecipient(recipientId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        Notification updatedNotification = notificationService.updateNotification(id, notification);
        if (updatedNotification != null) {
            return ResponseEntity.ok(updatedNotification);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // ========== NOTIFICATION ACTIONS ==========

    @PostMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        if (notification != null) {
            return ResponseEntity.ok(notification);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/recipient/{recipientId}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable Long recipientId) {
        notificationService.markAllAsRead(recipientId);
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "All notifications marked as read"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/sent")
    public ResponseEntity<Map<String, Object>> markAsSent(@PathVariable Long id) {
        notificationService.markAsSent(id);
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Notification marked as sent"
        );
        return ResponseEntity.ok(response);
    }

    // ========== BULK NOTIFICATIONS ==========

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> sendBulkNotification(
            @RequestBody Map<String, Object> bulkRequest) {
        List<Long> recipientIds = (List<Long>) bulkRequest.get("recipientIds");
        Notification notification = new Notification();
        notification.setTitle((String) bulkRequest.get("title"));
        notification.setMessage((String) bulkRequest.get("message"));
        notification.setType((String) bulkRequest.get("type"));
        notification.setPriority((String) bulkRequest.get("priority"));
        notification.setActionUrl((String) bulkRequest.get("actionUrl"));
        notification.setActionText((String) bulkRequest.get("actionText"));
        notification.setMetadata((String) bulkRequest.get("metadata"));

        notificationService.sendBulkNotification(recipientIds, notification);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Bulk notification sent to " + recipientIds.size() + " recipients"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/broadcast")
    public ResponseEntity<Map<String, Object>> broadcastNotification(@RequestBody Notification notification) {
        notificationService.broadcastNotification(notification);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Notification broadcasted to all users"
        );
        return ResponseEntity.ok(response);
    }

    // ========== NOTIFICATION TYPES ==========

    @PostMapping("/system")
    public ResponseEntity<Notification> createSystemNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        
        Notification notification = notificationService.createSystemNotification(recipientId, title, message);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/alert")
    public ResponseEntity<Notification> createAlertNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        
        Notification notification = notificationService.createAlertNotification(recipientId, title, message);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/urgent")
    public ResponseEntity<Notification> createUrgentNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        
        Notification notification = notificationService.createUrgentNotification(recipientId, title, message);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/task")
    public ResponseEntity<Notification> createTaskNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        String taskId = (String) request.get("taskId");
        
        Notification notification = notificationService.createTaskNotification(recipientId, title, message, taskId);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/sales")
    public ResponseEntity<Notification> createSalesNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        String opportunityId = (String) request.get("opportunityId");
        
        Notification notification = notificationService.createSalesNotification(recipientId, title, message, opportunityId);
        return ResponseEntity.ok(notification);
    }

    // ========== ANALYTICS ENDPOINTS ==========

    @GetMapping("/analytics")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> getNotificationAnalytics() {
        return notificationService.getNotificationAnalyticsAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/recipient/{recipientId}")
    public ResponseEntity<Map<String, Object>> getRecipientAnalytics(@PathVariable Long recipientId) {
        Map<String, Object> analytics = notificationService.getRecipientAnalytics(recipientId);
        return ResponseEntity.ok(analytics);
    }

    // ========== SEARCH AND FILTER ENDPOINTS ==========

    @GetMapping("/search")
    public ResponseEntity<List<Notification>> searchNotifications(@RequestParam String keyword) {
        List<Notification> notifications = notificationService.searchNotifications(keyword);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(@PathVariable String type) {
        List<Notification> notifications = notificationService.getNotificationsByType(type);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Notification>> getNotificationsByPriority(@PathVariable String priority) {
        List<Notification> notifications = notificationService.getNotificationsByPriority(priority);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Notification>> getNotificationsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Notification> notifications = notificationService.getNotificationsByDateRange(startDate, endDate);
        return ResponseEntity.ok(notifications);
    }

    // ========== BULK OPERATIONS ==========

    @PostMapping("/bulk-create")
    public ResponseEntity<List<Notification>> createNotifications(@RequestBody List<Notification> notifications) {
        List<Notification> createdNotifications = notificationService.createNotifications(notifications);
        return ResponseEntity.ok(createdNotifications);
    }

    @DeleteMapping("/expired")
    public ResponseEntity<Map<String, Object>> deleteExpiredNotifications() {
        notificationService.deleteExpiredNotifications();
        
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Expired notifications deleted"
        );
        return ResponseEntity.ok(response);
    }

    // ========== HEALTH CHECK ==========

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Notification Service is running!");
    }

    // ========== WEBSOCKET ENDPOINTS ==========

    @GetMapping("/websocket-info")
    public ResponseEntity<Map<String, Object>> getWebSocketInfo() {
        Map<String, Object> info = Map.of(
            "websocketEndpoint", "/ws",
            "userDestination", "/user/{userId}/queue/notifications",
            "broadcastTopic", "/topic/notifications",
            "broadcastTopic", "/topic/broadcast"
        );
        return ResponseEntity.ok(info);
    }

    // ========== NOTIFICATION SUMMARY ==========

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getNotificationSummary() {
        Map<String, Object> summary = Map.of(
            "totalNotifications", notificationService.getNotificationAnalyticsAsync().join().get("totalNotifications"),
            "unreadNotifications", notificationService.getNotificationAnalyticsAsync().join().get("unreadNotifications"),
            "sentNotifications", notificationService.getNotificationAnalyticsAsync().join().get("sentNotifications"),
            "realTimeEnabled", true,
            "websocketSupported", true
        );
        return ResponseEntity.ok(summary);
    }

    // ========== ADVANCED FEATURES ==========

    @PostMapping("/scheduled")
    public ResponseEntity<Map<String, Object>> scheduleNotification(
            @RequestBody Map<String, Object> request) {
        // TODO: Implement scheduled notification
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Scheduled notification feature coming soon"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/periodic")
    public ResponseEntity<Map<String, Object>> createPeriodicNotification(
            @RequestBody Map<String, Object> request) {
        // TODO: Implement periodic notification
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Periodic notification feature coming soon"
        );
        return ResponseEntity.ok(response);
    }

    // ========== CACHE MANAGEMENT ==========

    @DeleteMapping("/cache/clear")
    public ResponseEntity<Map<String, Object>> clearCache() {
        notificationService.clearNotificationCache();
        
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Notification cache cleared"
        );
        return ResponseEntity.ok(response);
    }
} 