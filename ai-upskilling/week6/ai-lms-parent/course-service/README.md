# Course Service

This is the Course microservice for the AI-Powered Learning Management System (LMS).

## Features
- Reactive Spring Boot 3 (WebFlux)
- PostgreSQL (R2DBC)
- CRUD, versioning, search
- Actuator, Prometheus, Sleuth, Resilience4j
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/course-service-*.jar
```

## Docker
```
docker build -t course-service .
docker run -p 8082:8082 course-service
```

## API Endpoints
- `POST /api/courses` — Create a new course
- `PUT /api/courses/{id}` — Update a course (increments version)
- `DELETE /api/courses/{id}` — Delete a course
- `GET /api/courses/{id}` — Get course by ID
- `GET /api/courses` — List all courses
- `GET /api/courses/search?title=...` — Search by title
- `GET /api/courses/search?tag=...` — Search by tag

## Configuration
Edit `src/main/resources/application.yml` for DB and port settings.

## Database
Run the schema in `src/main/resources/schema.sql` on your PostgreSQL instance.

--- 