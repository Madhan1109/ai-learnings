package com.crm.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeExchange(authz -> authz
                // Public endpoints
                .pathMatchers("/api/auth/**", "/auth-service/**", "/actuator/health", "/fallback/**", "/api/customers/**", "/api/notifications/**").permitAll()
                // WebSocket endpoints
                .pathMatchers("/ws/**").permitAll()
                // All other endpoints require authentication
                .anyExchange().authenticated()
            );
        
        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Use specific origins instead of wildcard when allowCredentials is true
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:3000",  // React frontend
            "http://localhost:3001",  // Alternative frontend port
            "http://127.0.0.1:3000", // Localhost alternative
            "http://127.0.0.1:3001"  // Localhost alternative
        );
        corsConfig.setAllowedOrigins(allowedOrigins);
        
        // For development, you can also use patterns (but be more specific)
        // corsConfig.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    public org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Use specific origins instead of wildcard when allowCredentials is true
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:3000",  // React frontend
            "http://localhost:3001",  // Alternative frontend port
            "http://127.0.0.1:3000", // Localhost alternative
            "http://127.0.0.1:3001"  // Localhost alternative
        );
        configuration.setAllowedOrigins(allowedOrigins);
        
        // For development, you can also use patterns (but be more specific)
        // configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = 
            new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 