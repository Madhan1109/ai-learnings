package com.ai.lms.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final ReactiveRedisTemplate<String, Notification> redisTemplate;
    private final ReactiveValueOperations<String, Notification> valueOps;

    @Autowired
    public NotificationController(ReactiveRedisTemplate<String, Notification> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.valueOps = redisTemplate.opsForValue();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Notification> sendNotification(@RequestBody Notification notification) {
        notification.setId(UUID.randomUUID().toString());
        return valueOps.set(notification.getId(), notification)
                .thenReturn(notification);
    }

    @GetMapping("/{id}")
    public Mono<Notification> getNotification(@PathVariable String id) {
        return valueOps.get(id);
    }

    @GetMapping
    public Flux<Notification> getAllNotifications() {
        // For demo: scan all keys (not recommended for production scale)
        return redisTemplate.keys("*")
                .flatMap(valueOps::get);
    }
} 