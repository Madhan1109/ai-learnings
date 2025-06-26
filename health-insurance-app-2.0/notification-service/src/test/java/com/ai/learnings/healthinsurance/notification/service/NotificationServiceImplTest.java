package com.ai.learnings.healthinsurance.notification.service;

import com.ai.learnings.healthinsurance.notification.model.Notification;
import com.ai.learnings.healthinsurance.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationServiceImplTest {
    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendNotification() {
        Notification notification = Notification.builder().recipient("user@example.com").message("Test").build();
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        Notification sent = notificationService.sendNotification("user@example.com", "Test");
        assertEquals("user@example.com", sent.getRecipient());
    }

    @Test
    void testGetAllNotifications() {
        List<Notification> notifications = Arrays.asList(Notification.builder().recipient("A").build(), Notification.builder().recipient("B").build());
        when(notificationRepository.findAll()).thenReturn(notifications);
        List<Notification> result = notificationService.getAllNotifications();
        assertEquals(2, result.size());
    }

    @Test
    void testGetNotificationById() {
        Notification notification = Notification.builder().recipient("user@example.com").message("Test").build();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        Optional<Notification> found = notificationService.getNotificationById(1L);
        assertTrue(found.isPresent());
        assertEquals("user@example.com", found.get().getRecipient());
    }
} 