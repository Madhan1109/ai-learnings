# LMS Microservices Architecture

## Overview
This document describes the architecture, data flows, and rationale for the AI-Powered Learning Management System (LMS).

## System Diagram

```mermaid
graph TD
  A[API Gateway] -->|REST| B[User Service]
  A -->|REST| C[Course Service]
  A -->|REST| D[Enrollment Service]
  A -->|REST| E[Assessment Service]
  A -->|REST| F[Notification Service]
  B <--> |PostgreSQL| G[(PostgreSQL)]
  C <--> |PostgreSQL| G
  D <--> |PostgreSQL| G
  E <--> |PostgreSQL| G
  D <--> |RabbitMQ| H[(RabbitMQ)]
  E <--> |RabbitMQ| H
  F <--> |RabbitMQ| H
  E <--> |Redis| I[(Redis)]
  F <--> |Redis| I
  F <--> |WebSocket| J[Clients]
  E <--> |WebSocket| J
  F <--> |REST| J
  subgraph Monitoring
    K[Prometheus]
    L[Grafana]
  end
  B -->|Actuator/Micrometer| K
  C -->|Actuator/Micrometer| K
  D -->|Actuator/Micrometer| K
  E -->|Actuator/Micrometer| K
  F -->|Actuator/Micrometer| K
  A -->|Actuator/Micrometer| K
  K --> L
```

## Data Flows
- **User registration/authentication**: API Gateway → User Service → PostgreSQL
- **Course CRUD/search**: API Gateway → Course Service → PostgreSQL
- **Enrollment/progress**: API Gateway → Enrollment Service → PostgreSQL, RabbitMQ (for async events)
- **Assessment/quizzes**: API Gateway → Assessment Service → PostgreSQL, RabbitMQ, Redis (for live quiz)
- **Notifications/chat**: API Gateway → Notification Service → Redis (for chat/pubsub), WebSocket (for real-time)
- **Monitoring**: All services expose metrics to Prometheus, visualized in Grafana

## Technology Rationale
- **Spring Boot 3 + WebFlux**: Modern, reactive, scalable microservices
- **PostgreSQL**: Reliable, open-source relational database
- **Redis**: Fast in-memory store for real-time features and caching
- **RabbitMQ**: Robust message broker for async communication
- **Spring Cloud Gateway**: Centralized API gateway, routing, and resilience
- **Docker**: Containerization for portability and deployment
- **Prometheus + Grafana**: Monitoring and visualization
- **Resilience4j, Sleuth, Micrometer**: Fault tolerance, tracing, and metrics
- **Kubernetes (optional)**: For production orchestration 