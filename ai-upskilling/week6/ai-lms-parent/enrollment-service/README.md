# Enrollment Service

This is the Enrollment microservice for the AI-Powered Learning Management System (LMS).

## Features
- Reactive Spring Boot 3 (WebFlux)
- PostgreSQL (R2DBC)
- RabbitMQ for async updates
- Enrollment, progress tracking, certificate generation
- Actuator, Prometheus, Sleuth, Resilience4j
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/enrollment-service-*.jar
```

## Docker
```
docker build -t enrollment-service .
docker run -p 8083:8083 enrollment-service
```

## API Endpoints
- `POST /api/enrollments` — Enroll a user in a course
- `PUT /api/enrollments/{id}/complete?certificateUrl=...` — Mark enrollment as completed and attach certificate
- `GET /api/enrollments/user/{userId}` — Get enrollments by user
- `GET /api/enrollments/course/{courseId}` — Get enrollments by course
- `GET /api/enrollments/{id}` — Get enrollment by ID
- `GET /api/enrollments` — List all enrollments
- `POST /api/progress` — Mark lesson as completed (with quiz score)
- `GET /api/progress/enrollment/{enrollmentId}` — Get progress by enrollment
- `GET /api/progress/lesson/{lessonId}` — Get progress by lesson
- `GET /api/progress` — List all progress records

## Configuration
Edit `src/main/resources/application.yml` for DB, RabbitMQ, and port settings.

## Database
Run the schema in `src/main/resources/schema.sql` on your PostgreSQL instance.

--- 