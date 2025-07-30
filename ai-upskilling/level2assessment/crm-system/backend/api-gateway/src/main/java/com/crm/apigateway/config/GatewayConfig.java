package com.crm.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Customer Service Routes
                .route("customer-service", r -> r
                        .path("/api/customers/**")
                        .filters(f -> f
                                .rewritePath("/api/customers/(?<segment>.*)", "/api/customers/${segment}")
                                .circuitBreaker(config -> config
                                        .setName("customer-service-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/customer-service"))
                                .requestRateLimiter(config -> config
                                        .setRateLimiter(redisRateLimiter())
                                        .setKeyResolver(userKeyResolver())))
                        .uri("lb://customer-service"))
                
                // Sales Service Routes
                .route("sales-service", r -> r
                        .path("/api/sales/**")
                        .filters(f -> f
                                .rewritePath("/api/sales/(?<segment>.*)", "/api/sales/${segment}")
                                .circuitBreaker(config -> config
                                        .setName("sales-service-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/sales-service"))
                                .requestRateLimiter(config -> config
                                        .setRateLimiter(redisRateLimiter())
                                        .setKeyResolver(userKeyResolver())))
                        .uri("lb://sales-service"))
                
                // Analytics Service Routes
                .route("analytics-service", r -> r
                        .path("/api/analytics/**")
                        .filters(f -> f
                                .rewritePath("/api/analytics/(?<segment>.*)", "/api/analytics/${segment}")
                                .circuitBreaker(config -> config
                                        .setName("analytics-service-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/analytics-service"))
                                .requestRateLimiter(config -> config
                                        .setRateLimiter(redisRateLimiter())
                                        .setKeyResolver(userKeyResolver())))
                        .uri("lb://analytics-service"))
                
                // Notification Service Routes
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .filters(f -> f
                                .rewritePath("/api/notifications/(?<segment>.*)", "/api/notifications/${segment}")
                                .circuitBreaker(config -> config
                                        .setName("notification-service-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/notification-service"))
                                .requestRateLimiter(config -> config
                                        .setRateLimiter(redisRateLimiter())
                                        .setKeyResolver(userKeyResolver())))
                        .uri("lb://notification-service"))
                
                // Auth Service Routes
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f
                                .rewritePath("/api/auth/(?<segment>.*)", "/api/auth/${segment}")
                                .circuitBreaker(config -> config
                                        .setName("auth-service-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/auth-service"))
                                .requestRateLimiter(config -> config
                                        .setRateLimiter(redisRateLimiter())
                                        .setKeyResolver(userKeyResolver())))
                        .uri("lb://auth-service"))
                
                // WebSocket Routes
                .route("websocket-route", r -> r
                        .path("/ws/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("websocket-circuit-breaker")
                                        .setFallbackUri("forward:/fallback/websocket")))
                        .uri("lb://notification-service"))
                
                .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20); // 10 requests per second, 20 burst capacity
    }

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                return Mono.just(token.substring(7));
            }
            return Mono.just("anonymous");
        };
    }
} 