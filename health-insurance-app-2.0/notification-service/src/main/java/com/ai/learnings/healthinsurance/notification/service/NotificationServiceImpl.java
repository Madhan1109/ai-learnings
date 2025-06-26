package com.ai.learnings.healthinsurance.notification.service;

import com.ai.learnings.healthinsurance.notification.model.Notification;
import com.ai.learnings.healthinsurance.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of NotificationService.
 */
@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    /**
     * Constructor for dependency injection.
     * @param notificationRepository NotificationRepository instance
     */
    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /** {@inheritDoc} */
    @Override
    public Notification sendNotification(String recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .sentAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    /** {@inheritDoc} */
    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    /** {@inheritDoc} */
    @Override
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }
} 