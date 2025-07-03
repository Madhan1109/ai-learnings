package com.ai.lms.assessment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.http.MediaType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AssessmentServiceIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testCreateAndGetQuiz() {
        // Create
        webTestClient.post().uri("/api/quizzes")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"courseId\":1," +
                "\"title\":\"Integration Quiz\"," +
                "\"description\":\"Integration Test\"}")
            .exchange()
            .expectStatus().isCreated();

        // Get all
        webTestClient.get().uri("/api/quizzes")
            .exchange()
            .expectStatus().isOk();
    }
} 