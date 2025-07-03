# User Service

This is the User microservice for the AI-Powered Learning Management System (LMS).

## Features
- Reactive Spring Boot 3 (WebFlux)
- PostgreSQL (R2DBC)
- JWT authentication
- BCrypt password hashing
- Actuator, Prometheus, Sleuth, Resilience4j
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/user-service-*.jar
```

## Docker
```
docker build -t user-service .
docker run -p 8081:8081 user-service
```

## API Endpoints
- `POST /api/users/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token
- `GET /api/users/by-username/{username}` — Get user by username (JWT required)
- `GET /api/users/by-email/{email}` — Get user by email (JWT required)

## Configuration
Edit `src/main/resources/application.yml` for DB and port settings.

## Database
Run the schema in `src/main/resources/schema.sql` on your PostgreSQL instance.

--- 