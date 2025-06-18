# Health Insurance Web Application Backend

## Architecture Overview

This backend is built with **Spring Boot (Java)**, **PostgreSQL**, **Spring Security (JWT)**, and follows the MVC pattern. It supports user registration, authentication, and CRUD operations for health insurance policies. Passwords are securely hashed with BCrypt, and all endpoints are protected with JWT-based authentication.

### Main Components
- **Model**: JPA entities for User, Role, Policy
- **Repository**: Spring Data JPA interfaces
- **Service**: Business logic for users, roles, and policies
- **Controller**: REST endpoints for authentication, user, and policy management
- **Security**: JWT authentication, password hashing, and authorization
- **Exception Handling**: Global and custom exception handlers
- **Logging**: SLF4J logging in services and controllers
- **Database Migration**: Flyway for schema management
- **Testing**: JUnit tests for all layers

## Folder Structure
```
backend/
├── pom.xml
├── README.md
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/insurance/
│   │   │       ├── controller/
│   │   │       ├── exception/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       ├── service/
│   │   │       ├── AppConstants.java
│   │   │       └── InsuranceApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/V1__init.sql
│   └── test/
│       └── java/com/example/insurance/
│           ├── controller/
│           ├── model/
│           ├── repository/
│           └── service/
```

## Prerequisites
- Java 11 or higher
- Maven
- PostgreSQL

## Setup & Execution

1. **Clone or copy the project to your machine**

2. **Configure the database**
   - Start PostgreSQL
   - Create the database and user:
     ```sql
     CREATE DATABASE insurance_db;
     CREATE USER your_db_user WITH PASSWORD 'your_db_password';
     GRANT ALL PRIVILEGES ON DATABASE insurance_db TO your_db_user;
     ```
   - Update `src/main/resources/application.properties` with your DB credentials

3. **Build and run the application**
   ```sh
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   - The app will start on [http://localhost:8080](http://localhost:8080)
   - Flyway will auto-create the schema

4. **Run tests**
   ```sh
   mvn test
   ```

5. **API Usage**
   - Register: `POST /api/auth/register` (JSON: username, email, password)
   - Login: `POST /api/auth/login` (JSON: username, password) → returns JWT
   - Use JWT as `Authorization: Bearer <token>` for all other endpoints
   - Get current user: `GET /api/users/me`
   - Create policy: `POST /api/policies`
   - Get policy: `GET /api/policies/{id}`
   - List policies: `GET /api/policies`

## Notes
- All passwords are stored hashed (BCrypt)
- All endpoints except `/api/auth/*` require JWT authentication
- Logging is enabled for key actions
- Exception handling is global and returns JSON errors

## Extending
- Add more endpoints, validation, or business logic as needed
- Integrate with a frontend (React, etc.)

---

**For any issues, copy error messages here for help!** 