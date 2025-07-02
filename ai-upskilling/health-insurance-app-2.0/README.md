# Health Insurance Microservices System

## High-Level Architecture Diagram

```
+-------------------+         +-------------------+         +-------------------+
|                   |         |                   |         |                   |
|   React Frontend  +-------->+   API Gateway     +-------->+  Microservices    |
|                   |  HTTPS  | (Spring Cloud)    |  REST   |                   |
+-------------------+         +-------------------+         +-------------------+
                                                           /    |    |    |    \
                                                          /     |    |    |     \
                                                +--------+  +---+ +--+ +--+ +----+
                                                |User    |  |Policy|Addon|Admin|Auth|
                                                |Service |  |Service|Svc |Svc |Svc |
                                                +--------+  +---+ +--+ +--+ +----+
                                                      |         |    |    |    |
                                                      v         v    v    v    v
                                                +---------------------------------+
                                                |         PostgreSQL DBs           |
                                                +---------------------------------+
```
- Notification Service (not shown) can be called by any service or the gateway for async notifications.

## Component Breakdown & Responsibilities

| Component         | Responsibilities                                                                 |
|-------------------|---------------------------------------------------------------------------------|
| **API Gateway**   | Central entry point, routing, JWT auth, request logging, rate limiting           |
| **User Service**  | User registration, profile, roles, user management                               |
| **Policy Service**| CRUD for insurance policies, policy search, linking to users                     |
| **Addon Service** | Manage add-ons (e.g., roadside assistance), CRUD, link to policies               |
| **Admin Service** | Admin authentication, admin management, system monitoring                        |
| **Auth Service**  | User/admin authentication, JWT issuing, password hashing, login/register         |
| **Notification**  | Send emails/SMS/notifications, async event handling                              |
| **Database(s)**   | Each service can have its own schema or DB (PostgreSQL recommended)              |
| **React Frontend**| User/admin dashboards, forms, policy management, claims, etc.                    |

## Database Schema Design (Sample)

**User Table**
| id | name | email | password | role   |
|----|------|-------|----------|--------|
| PK | str  | str   | str      | str    |

**Policy Table**
| id | policy_number | holder_name | years | price | user_id (FK) |
|----|--------------|-------------|-------|-------|--------------|
| PK | str          | str         | int   | float | FK->User.id  |

**Addon Table**
| id | name                | description   | price | policy_id (FK) |
|----|---------------------|--------------|-------|---------------|
| PK | str                 | str          | float | FK->Policy.id |

**Admin Table**
| id | name | email | password |
|----|------|-------|----------|
| PK | str  | str   | str      |

**Notification Table**
| id | recipient | message | sent_at           |
|----|-----------|---------|-------------------|
| PK | str       | str     | timestamp         |

**AuthUser Table** (if separate)
| id | email | password | role   |
|----|-------|----------|--------|
| PK | str   | str      | str    |

## API Endpoint Structure (Sample)

| Service         | Endpoint Example                | Method | Description                  |
|-----------------|--------------------------------|--------|------------------------------|
| User            | /api/users                     | GET    | List users                   |
|                 | /api/users/{id}                | GET    | Get user by ID               |
|                 | /api/users                     | POST   | Create user                  |
| Policy          | /api/policies                  | GET    | List policies                |
|                 | /api/policies/{id}             | GET    | Get policy by ID             |
|                 | /api/policies                  | POST   | Create policy                |
| Addon           | /api/addons                    | GET    | List add-ons                 |
|                 | /api/addons/{id}               | GET    | Get add-on by ID             |
|                 | /api/addons                    | POST   | Create add-on                |
| Admin           | /api/admins                    | GET    | List admins                  |
|                 | /api/admins/{id}               | GET    | Get admin by ID              |
| Auth            | /api/auth/register             | POST   | Register user/admin          |
|                 | /api/auth/login                | POST   | Login, returns JWT           |
| Notification    | /api/notifications             | POST   | Send notification            |
|                 | /api/notifications             | GET    | List notifications           |

- All endpoints (except `/api/auth/**`) are protected by JWT via the gateway.

## Technology Stack Recommendations (Java Backend)

- **Spring Boot**: Microservice framework
- **Spring Cloud Gateway**: API Gateway
- **Spring Data JPA**: ORM for PostgreSQL
- **Spring Security**: Security, JWT integration
- **Lombok**: Boilerplate code reduction
- **JUnit & Mockito**: Testing
- **PostgreSQL**: Relational database
- **Flyway**: Database migrations
- **Redis** (optional): Caching/session management
- **SLF4J/Logback**: Logging
- **Docker**: Containerization (recommended for deployment)
- **OpenAPI/Swagger**: API documentation (optional but recommended)

---

## Setup & Run Instructions

1. **Clone the repository**
2. **Build all services**
   - `mvn clean install` (from the project root)
3. **Run services**
   - Each service can be started from its directory: `mvn spring-boot:run`
   - Or use Docker Compose (recommended for multi-service setup)
4. **Environment Variables/Config**
   - Set DB URLs, JWT secrets, and other configs in each service's `application.properties` or `application.yml`

## Testing

- Run unit and integration tests with:
  - `mvn test` (in each service directory)
- Tests use JUnit and Mockito

## Deployment

- **Docker:**
  - Each service can have its own `Dockerfile`
  - Use `docker-compose.yml` to orchestrate all services and dependencies (PostgreSQL, Redis, etc.)
- **Kubernetes:** (optional)
  - Helm charts or YAML manifests for scalable deployment
- **Cloud:**
  - Deploy to AWS ECS/EKS, Azure AKS, or Google GKE

## API Documentation

- Use **Swagger/OpenAPI** for documenting REST APIs
- Add `springdoc-openapi` or `springfox-swagger2` dependency to each service
- Access docs at `/swagger-ui.html` or `/v3/api-docs` (per service)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request
5. Follow code style and testing guidelines

## Contact/Support

- For questions, issues, or support, contact the project maintainer or open a GitHub issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 

## Code-Level Design

### Package Structure (per service)

```
com.ai.learnings.healthinsurance.[service]
│
├── controller
│   └── [Entity]Controller.java
├── service
│   ├── [Entity]Service.java (interface)
│   └── [Entity]ServiceImpl.java (implementation)
├── repository
│   └── [Entity]Repository.java
├── model
│   └── [Entity].java
├── exception
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
└── dto
    └── [Entity]Dto.java (optional)
```

### Example: Policy Service

#### Interface
```java
public interface PolicyService {
    Policy createPolicy(Policy policy);
    List<Policy> getAllPolicies();
    Optional<Policy> getPolicyById(Long id);
    void deletePolicy(Long id);
}
```

#### Implementation
```java
@Service
public class PolicyServiceImpl implements PolicyService {
    private final PolicyRepository policyRepository;
    @Autowired
    public PolicyServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }
    // ...methods
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/policies")
public class PolicyController {
    private final PolicyService policyService;
    @Autowired
    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }
    // ...endpoints
}
```

#### Repository
```java
public interface PolicyRepository extends JpaRepository<Policy, Long> {}
```

#### Exception Handling
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    // ...handlers for ResourceNotFoundException, validation, etc.
}
```

#### Unit Test
```java
@ExtendWith(MockitoExtension.class)
class PolicyServiceImplTest {
    @Mock PolicyRepository policyRepository;
    @InjectMocks PolicyServiceImpl policyService;
    // ...test methods
}
```

### Design Patterns Used

- **Dependency Injection** (Spring)
- **Repository Pattern** (Spring Data JPA)
- **Service Layer Pattern**
- **Controller/Resource Pattern** (REST)
- **Builder Pattern** (Lombok's @Builder)
- **Strategy/Template** (for extensible business logic, if needed)

### Error Handling

- Centralized with `@ControllerAdvice`
- Custom exceptions (e.g., `ResourceNotFoundException`)
- Proper HTTP status codes and error messages
- Logging via SLF4J

### Testability

- All business logic behind interfaces
- Constructor injection for easy mocking
- JUnit + Mockito for unit tests
- Controllers tested with `@WebMvcTest`

### Summary

- **System-level design**: Microservices, API gateway, PostgreSQL, React frontend, JWT security, async notifications.
- **Code-level design**: SOLID, interface-driven, layered, testable, and robust error handling.

If you want a concrete code example for a specific service or a diagram in another format, let me know! 