# Assessment Service

This is the Assessment microservice for the AI-Powered Learning Management System (LMS).

## Features
- Reactive Spring Boot 3 (WebFlux)
- PostgreSQL (R2DBC)
- RabbitMQ for async updates
- Redis for real-time quiz and chat
- Quiz and question management
- Actuator, Prometheus, Sleuth, Resilience4j
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/assessment-service-*.jar
```

## Docker
```
docker build -t assessment-service .
docker run -p 8084:8084 assessment-service
```

## API Endpoints
- `POST /api/quizzes` — Create a new quiz
- `PUT /api/quizzes/{id}` — Update a quiz
- `DELETE /api/quizzes/{id}` — Delete a quiz
- `GET /api/quizzes/{id}` — Get quiz by ID
- `GET /api/quizzes/course/{courseId}` — Get quizzes by course
- `GET /api/quizzes` — List all quizzes
- `POST /api/questions` — Create a new question
- `PUT /api/questions/{id}` — Update a question
- `DELETE /api/questions/{id}` — Delete a question
- `GET /api/questions/{id}` — Get question by ID
- `GET /api/questions/quiz/{quizId}` — Get questions by quiz
- `GET /api/questions` — List all questions

## Configuration
Edit `src/main/resources/application.yml` for DB, RabbitMQ, Redis, and port settings.

## Database
Run the schema in `src/main/resources/schema.sql` on your PostgreSQL instance.

--- 