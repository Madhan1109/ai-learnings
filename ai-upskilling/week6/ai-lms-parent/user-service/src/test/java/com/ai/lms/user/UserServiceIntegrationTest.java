package com.ai.lms.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.http.MediaType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserServiceIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testUserRegistrationAndLogin() {
        // Register
        webTestClient.post().uri("/api/users/register")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"username\":\"integrationuser\"," +
                "\"email\":\"integrationuser@example.com\"," +
                "\"password\":\"password123\"}")
            .exchange()
            .expectStatus().isCreated();

        // Login
        webTestClient.post().uri("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{" +
                "\"username\":\"integrationuser\"," +
                "\"password\":\"password123\"}")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.token").exists();
    }
} 