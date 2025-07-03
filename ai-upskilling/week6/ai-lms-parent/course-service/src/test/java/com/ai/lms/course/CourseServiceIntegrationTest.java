package com.ai.lms.course;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.http.MediaType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CourseServiceIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testCreateAndGetCourse() {
        // Create
        webTestClient.post().uri("/api/courses")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"title\":\"Integration Course\"," +
                "\"description\":\"Integration Test\"," +
                "\"contentUrl\":\"/test/url\"," +
                "\"tags\":\"test\"}")
            .exchange()
            .expectStatus().isCreated();

        // Get all
        webTestClient.get().uri("/api/courses")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].title").isNotEmpty();
    }
} 