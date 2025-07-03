package com.ai.lms.notification;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.http.MediaType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class NotificationServiceIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testSendAndGetNotification() {
        // Send notification
        webTestClient.post().uri("/api/notifications")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"userId\":\"1\"," +
                "\"message\":\"Integration Test\"," +
                "\"type\":\"INFO\"}")
            .exchange()
            .expectStatus().isCreated();

        // Get all
        webTestClient.get().uri("/api/notifications")
            .exchange()
            .expectStatus().isOk();
    }
} 