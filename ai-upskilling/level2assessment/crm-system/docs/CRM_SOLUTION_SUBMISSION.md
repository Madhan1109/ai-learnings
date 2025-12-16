## AI Upskilling Program - Solution Submission (CRM System)


1. Problem Statement
- The solution implements a Customer Relationship Management (CRM) system to manage leads, accounts, contacts, and opportunities end-to-end.
- It enables sales teams to capture, qualify, and track the lifecycle of leads to opportunities with basic analytics and role-based access.


2. Solution Approach & Tools
- Approach:
  - The system is a microservices-based CRM with clear domain separation: `auth-service`, `customer-service`, `sales-service`, `analytics-service`, `notification-service`, fronted by `api-gateway`, and discovered via `eureka-service`.
  - Services are implemented with Spring Boot, expose RESTful APIs, and use PostgreSQL for persistence; Redis is used for caching; Kafka is provisioned for event streaming.
  - The frontend is a React + TypeScript SPA that consumes the API Gateway, with charts, dashboards, and AI insight components.
  - Containerized with Docker and orchestrated via `docker-compose.yml`; startup scripts are provided for Windows and Linux/macOS.
  - Environment-specific configuration is handled via Spring `application.yml` and container env vars; CORS is configured at the gateway for `http://localhost:3000`.
  - Client-side ML (TensorFlow.js) powers predictive analytics components.

- Common Tech Stack (concrete):
  - Java (Spring Boot Microservices)
  - Database: PostgreSQL
  - Frontend: React + TypeScript
  - Messaging: Apache Kafka (with Zookeeper)
  - Cache: Redis
  - Containerization: Docker, Docker Compose

- AI Tools:
  - Cursor

3. Architecture / Workflow Diagram
- High-level flow:
  1) Frontend (React SPA) →
  2) API Gateway (Spring Cloud Gateway) →
  3) Microservices (Auth, Customer, Sales, Analytics, Notification) discovered via Eureka →
  4) Data stores (PostgreSQL, Redis) and streaming (Kafka) →
  5) Monitoring/health endpoints via Spring Actuator

- Diagram: see `docs/ARCHITECTURE_DIAGRAM.md` (and `docs/ARCHITECTURE_DESIGN.md` for details).

4. Key Files / Entry Point
- Repository Link: `C:\ai-learnings\ai-learnings\ai-upskilling\level2assessment\crm-system`
  - If remote, add Git URL: [https://...]

- Backend entry classes:
  - `backend/api-gateway/src/main/java/com/crm/apigateway/ApiGatewayApplication.java`
  - `backend/eureka-service/src/main/java/com/crm/eurekaservice/EurekaServiceApplication.java`
  - `backend/auth-service/src/main/java/com/crm/authservice/AuthServiceApplication.java`
  - `backend/customer-service/src/main/java/com/crm/customerservice/CustomerServiceApplication.java`
  - `backend/sales-service/src/main/java/com/crm/salesservice/SalesServiceApplication.java`
  - `backend/analytics-service/src/main/java/com/crm/analyticsservice/AnalyticsServiceApplication.java`
  - `backend/notification-service/src/main/java/com/crm/notificationservice/NotificationServiceApplication.java`

- Frontend entry:
  - `frontend/src/index.tsx` (React app bootstrap)

- Important folders:
  - `backend/` — microservice code (each with `pom.xml`, `src/main/java`, `src/main/resources/application.yml`)
  - `frontend/` — React + TS SPA (`package.json`, `src/` pages/components/services)
  - `docs/` — architecture, API docs, deployment, user guide
  - `start-up-scripts/` — Windows and Linux/macOS startup, health, and stop scripts
  - Root `docker-compose.yml` — orchestrates DB, cache, Kafka, gateway, services, and frontend

5. Instructions to Run

Option 1: Start everything via scripts (recommended)
```cmd
# Windows (from repo root)
start-up-scripts\start-backend-sequential.bat

# Or
start-up-scripts\start-backend.bat
```
```bash
# Linux/macOS (from repo root)
chmod +x start-up-scripts/start-backend.sh
./start-up-scripts/start-backend.sh
```

Option 2: Docker Compose directly
```bash
docker-compose up -d
```

Option 3: Run services individually (development)
```bash
# Example: run selected services
cd backend/customer-service && ./mvnw spring-boot:run
cd backend/sales-service && ./mvnw spring-boot:run
cd backend/analytics-service && ./mvnw spring-boot:run

# Frontend
cd frontend && npm install && npm start
```

Service endpoints (defaults):
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761
- Kafka: localhost:9092
- Postgres: localhost:5432
- Redis: localhost:6379

Environment variables (typical, already provided by Docker Compose):
```bash
# Backend (examples)
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/crm_system
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
SPRING_REDIS_HOST=redis
JWT_SECRET=your-gateway-secret-key-here

# Frontend
REACT_APP_API_URL=http://localhost:8080
```

If execution is not possible, add a short demo or screenshots in `docs/demo/` and link here:
- Demo link/path: docs/demo/

6. Known Limitations
- Health checks are disabled for some services in `docker-compose.yml` (customer-service, sales-service) during testing.
- First-time startup may be slow due to Docker image pulls and Maven builds.
- Local developer startup requires Docker Desktop and available ports (3000, 8080, 8761, 5432, 6379, 9092).
- Test coverage for end-to-end flows can be expanded.

7. Self-Assessment
- Confidence: High. Core CRM flows (customers, sales pipeline, auth, analytics, notifications) work end-to-end via the gateway; infra is reproducible via scripts/Compose.
- Areas for SME feedback: production readiness of Kafka usage, caching strategies, and horizontal scaling under load; security hardening and observability depth.

Challenges faced and mitigations:
- Orchestrating multiple services and dependencies → standardized Docker Compose with health checks and startup scripts.
- Cross-origin and routing with SPA + gateway → explicit CORS config at gateway and proxy settings in frontend.
- Environment drift between local and containerized runs → centralized env via Compose and Spring profiles.

Implementation timeline:
- Estimated effort: Between 2 to 3 days.

---

