package com.crm.apigateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/customer-service")
    public Mono<ResponseEntity<Map<String, Object>>> customerServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Customer Service is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "customer-service");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/sales-service")
    public Mono<ResponseEntity<Map<String, Object>>> salesServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Sales Service is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "sales-service");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/analytics-service")
    public Mono<ResponseEntity<Map<String, Object>>> analyticsServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Analytics Service is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "analytics-service");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/notification-service")
    public Mono<ResponseEntity<Map<String, Object>>> notificationServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Notification Service is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "notification-service");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/auth-service")
    public Mono<ResponseEntity<Map<String, Object>>> authServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Auth Service is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "auth-service");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/websocket")
    public Mono<ResponseEntity<Map<String, Object>>> websocketFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "WebSocket connection is temporarily unavailable");
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("service", "websocket");
        response.put("fallback", true);
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> gatewayHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "UP");
        response.put("service", "api-gateway");
        response.put("message", "API Gateway is running");
        
        return Mono.just(ResponseEntity.ok(response));
    }
} 