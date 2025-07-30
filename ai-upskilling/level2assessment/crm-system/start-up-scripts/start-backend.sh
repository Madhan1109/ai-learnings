#!/bin/bash

echo "========================================"
echo "   CRM System Backend Startup Script"
echo "========================================"
echo

# Check if Docker is running
echo "[1/8] Checking Docker status..."
if ! docker version >/dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi
echo "✓ Docker is running"

# Check if Java is installed
echo "[2/8] Checking Java installation..."
if ! java -version >/dev/null 2>&1; then
    echo "ERROR: Java is not installed or not in PATH!"
    exit 1
fi
echo "✓ Java is installed"

# Check if Maven is installed
echo "[3/8] Checking Maven installation..."
if ! mvn -version >/dev/null 2>&1; then
    echo "ERROR: Maven is not installed or not in PATH!"
    exit 1
fi
echo "✓ Maven is installed"

# Build all backend services
echo "[4/8] Building all backend services..."
echo "Building Customer Service..."
cd backend/customer-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Customer Service!"
    exit 1
fi

echo "Building Sales Service..."
cd ../sales-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Sales Service!"
    exit 1
fi

echo "Building Auth Service..."
cd ../auth-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Auth Service!"
    exit 1
fi

echo "Building Analytics Service..."
cd ../analytics-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Analytics Service!"
    exit 1
fi

echo "Building Notification Service..."
cd ../notification-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Notification Service!"
    exit 1
fi

echo "Building API Gateway..."
cd ../api-gateway
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build API Gateway!"
    exit 1
fi

echo "Building Eureka Service..."
cd ../eureka-service
if ! mvn clean install -DskipTests; then
    echo "ERROR: Failed to build Eureka Service!"
    exit 1
fi

cd ../..
echo "✓ All backend services built successfully"

# Start infrastructure services
echo "[5/8] Starting infrastructure services..."
echo "Starting PostgreSQL, Redis, Kafka, Zookeeper..."
if ! docker-compose up -d postgres redis zookeeper kafka; then
    echo "ERROR: Failed to start infrastructure services!"
    exit 1
fi
echo "✓ Infrastructure services started"

# Wait for infrastructure to be ready
echo "[6/8] Waiting for infrastructure to be ready..."
sleep 10
echo "✓ Infrastructure is ready"

# Start Eureka Service Discovery
echo "[7/8] Starting Eureka Service Discovery..."
if ! docker-compose up -d eureka; then
    echo "ERROR: Failed to start Eureka service!"
    exit 1
fi
echo "✓ Eureka Service Discovery started"

# Wait for Eureka to be ready
echo "Waiting for Eureka to be ready..."
sleep 15

# Start all backend services
echo "[8/8] Starting all backend services..."
echo "Starting Customer Service, Sales Service, Auth Service, Analytics Service, Notification Service, API Gateway..."

if ! docker-compose up -d customer-service sales-service auth-service analytics-service notification-service api-gateway; then
    echo "ERROR: Failed to start backend services!"
    exit 1
fi
echo "✓ All backend services started"

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 20

# Display service status
echo
echo "========================================"
echo "   Service Status"
echo "========================================"
docker-compose ps

echo
echo "========================================"
echo "   Service URLs"
echo "========================================"
echo "Eureka Dashboard:     http://localhost:8761"
echo "API Gateway:          http://localhost:8080"
echo "Customer Service:     http://localhost:8081"
echo "Sales Service:        http://localhost:8082"
echo "Auth Service:         http://localhost:8083"
echo "Analytics Service:    http://localhost:8084"
echo "Notification Service: http://localhost:8085"
echo

echo "========================================"
echo "   Health Check Commands"
echo "========================================"
echo "API Gateway Health:   curl http://localhost:8080/actuator/health"
echo "Customer Service:     curl http://localhost:8081/api/customers/actuator/health"
echo "Sales Service:        curl http://localhost:8082/api/sales/actuator/health"
echo "Auth Service:         curl http://localhost:8083/api/auth/actuator/health"
echo

echo "========================================"
echo "   Backend Services Started Successfully!"
echo "========================================"
echo
echo "To stop all services, run: ./scripts/stop-backend.sh"
echo "To view logs, run: docker-compose logs -f"
echo 