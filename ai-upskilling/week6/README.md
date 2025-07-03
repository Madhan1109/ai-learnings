# AI-Powered Learning Management System (LMS)

A production-ready, microservices-based LMS with AI-powered features, real-time collaboration, and full observability.

---

## 🚀 Project Overview
- **Backend:** Java 21, Spring Boot 3, WebFlux, PostgreSQL, Redis, RabbitMQ, Resilience4j, Sleuth, Micrometer
- **Frontend:** React + TypeScript, Material-UI, Redux, WebSocket (STOMP)
- **Microservices:** User, Course, Enrollment, Assessment, Notification, API Gateway
- **Observability:** Prometheus, Grafana, distributed tracing
- **Orchestration:** Docker, Docker Compose, Kubernetes-ready

---

## 🏗️ Architecture
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for diagrams, data flows, and rationale.
- See [`API-SPECS.md`](./API-SPECS.md) for REST API details.
- See [`REALTIME.md`](./REALTIME.md) for real-time protocol and event flows.
- See [`CACHING-DB-OPTIMIZATION.md`](./CACHING-DB-OPTIMIZATION.md) for performance/caching strategies.

---

## 🖥️ Backend Setup

### Prerequisites
- Java 21
- Maven 3.9+
- Docker & Docker Compose

### Build All Microservices
```bash
cd ai-lms-parent
mvn clean package -DskipTests
```

### Run All Services (Recommended: Docker Compose)
```bash
docker-compose up --build
```
- This will start all microservices, PostgreSQL, Redis, RabbitMQ, Prometheus, and Grafana.
- See [`docker-compose.yml`](./docker-compose.yml) for service details.

### Run a Single Service (Dev)
```bash
cd ai-lms-parent/user-service
mvn spring-boot:run
```

---

## 🖥️ Frontend Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
cd lms-frontend
npm install
npm start
```
- App runs at [http://localhost:3000](http://localhost:3000)
- Configure API endpoints in `lms-frontend/src/api/index.ts` if needed.

---

## 🛠️ Environment Variables
- Backend: see each service's `application.yml` for DB, Redis, RabbitMQ, JWT, etc.
- Frontend: see `.env` in `lms-frontend` for API base URLs (if used).

---

## 📊 Monitoring & Observability
- **Prometheus:** [http://localhost:9090](http://localhost:9090)
- **Grafana:** [http://localhost:3001](http://localhost:3001) (import `grafana-lms-dashboard.json`)
- **Distributed Tracing:** Sleuth/Zipkin (if enabled)
- See [`prometheus.yml`](./prometheus.yml) and [`grafana-lms-dashboard.json`](./grafana-lms-dashboard.json)

---

## 🔗 Other Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API-SPECS.md](./API-SPECS.md)
- [REALTIME.md](./REALTIME.md)
- [CACHING-DB-OPTIMIZATION.md](./CACHING-DB-OPTIMIZATION.md)
- [NEWRELIC-INTEGRATION.md](./NEWRELIC-INTEGRATION.md)
- [APPLICATION-INSIGHTS-INTEGRATION.md](./APPLICATION-INSIGHTS-INTEGRATION.md)

---

## 🧪 Testing & Coverage
- Backend: `mvn verify` (JaCoCo reports per service)
- Frontend: `npm test` (React Testing Library)

---

## 📝 Quick Start (All-in-One)
```bash
# 1. Build backend
cd ai-lms-parent
mvn clean package -DskipTests

# 2. Start everything
cd ..
docker-compose up --build

# 3. Start frontend (in a new terminal)
cd lms-frontend
npm install
npm start
```

---

## 📣 Support
For issues, see the documentation above or contact the project maintainer. 