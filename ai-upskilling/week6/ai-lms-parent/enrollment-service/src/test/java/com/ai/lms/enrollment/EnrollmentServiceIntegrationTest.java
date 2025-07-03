package com.ai.lms.enrollment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.http.MediaType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class EnrollmentServiceIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testEnrollAndGet() {
        // Enroll
        webTestClient.post().uri("/api/enrollments")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"userId\":1," +
                "\"courseId\":1}")
            .exchange()
            .expectStatus().isCreated();

        // Get all
        webTestClient.get().uri("/api/enrollments")
            .exchange()
            .expectStatus().isOk();
    }
} 