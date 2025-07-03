# Notification Service

This is the Notification microservice for the AI-Powered Learning Management System (LMS).

## Features
- Reactive Spring Boot 3 (WebFlux)
- Redis for real-time chat and pub/sub
- RabbitMQ for async messaging
- WebSocket (STOMP) for real-time chat and announcements
- REST API for notifications
- Actuator, Prometheus, Sleuth, Resilience4j
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/notification-service-*.jar
```

## Docker
```
docker build -t notification-service .
docker run -p 8085:8085 notification-service
```

## WebSocket Endpoints
- `/ws` — WebSocket handshake endpoint (SockJS supported)
- `/topic/public` — Chat messages
- `/topic/announcements` — Announcements
- Send to `/app/chat.sendMessage` or `/app/chat.announce`

## REST API Endpoints
- `POST /api/notifications` — Send a notification
- `GET /api/notifications/{id}` — Get notification by ID
- `GET /api/notifications` — List all notifications

## Configuration
Edit `src/main/resources/application.yml` for Redis, RabbitMQ, and port settings.

--- 