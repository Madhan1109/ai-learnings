#!/bin/bash

echo "========================================"
echo "   CRM System Individual Service Startup"
echo "========================================"
echo

# Check prerequisites
echo "[1/9] Checking prerequisites..."
if ! docker version >/dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

if ! java -version >/dev/null 2>&1; then
    echo "ERROR: Java is not installed!"
    exit 1
fi

if ! mvn -version >/dev/null 2>&1; then
    echo "ERROR: Maven is not installed!"
    exit 1
fi
echo "✓ All prerequisites are installed"

# Start infrastructure
echo "[2/9] Starting infrastructure services..."
if ! docker-compose up -d postgres redis zookeeper kafka; then
    echo "ERROR: Failed to start infrastructure!"
    exit 1
fi
echo "✓ Infrastructure started"

# Wait for infrastructure
echo "Waiting for infrastructure to be ready..."
sleep 10

# Build all services
echo "[3/9] Building all services..."
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
echo "✓ All services built successfully"

# Start Eureka first
echo "[4/9] Starting Eureka Service Discovery..."
echo "Starting Eureka Service in background..."
cd backend/eureka-service
nohup java -jar target/eureka-service-1.0.0.jar > eureka.log 2>&1 &
cd ../..
echo "✓ Eureka Service started"

# Wait for Eureka
echo "Waiting for Eureka to be ready..."
sleep 15

# Start Customer Service
echo "[5/9] Starting Customer Service..."
echo "Starting Customer Service in background..."
cd backend/customer-service
nohup java -jar target/customer-service-1.0.0.jar > customer.log 2>&1 &
cd ../..
echo "✓ Customer Service started"

# Wait for Customer Service
sleep 10

# Start Sales Service
echo "[6/9] Starting Sales Service..."
echo "Starting Sales Service in background..."
cd backend/sales-service
nohup java -jar target/sales-service-1.0.0.jar > sales.log 2>&1 &
cd ../..
echo "✓ Sales Service started"

# Wait for Sales Service
sleep 10

# Start Auth Service
echo "[7/9] Starting Auth Service..."
echo "Starting Auth Service in background..."
cd backend/auth-service
nohup java -jar target/auth-service-1.0.0.jar > auth.log 2>&1 &
cd ../..
echo "✓ Auth Service started"

# Wait for Auth Service
sleep 10

# Start Analytics Service
echo "[8/9] Starting Analytics Service..."
echo "Starting Analytics Service in background..."
cd backend/analytics-service
nohup java -jar target/analytics-service-1.0.0.jar > analytics.log 2>&1 &
cd ../..
echo "✓ Analytics Service started"

# Wait for Analytics Service
sleep 10

# Start Notification Service
echo "[9/9] Starting Notification Service..."
echo "Starting Notification Service in background..."
cd backend/notification-service
nohup java -jar target/notification-service-1.0.0.jar > notification.log 2>&1 &
cd ../..
echo "✓ Notification Service started"

# Wait for Notification Service
sleep 10

# Start API Gateway
echo "Starting API Gateway..."
echo "Starting API Gateway in background..."
cd backend/api-gateway
nohup java -jar target/api-gateway-1.0.0.jar > gateway.log 2>&1 &
cd ../..
echo "✓ API Gateway started"

echo
echo "========================================"
echo "   All Services Started Successfully!"
echo "========================================"
echo
echo "Service URLs:"
echo "Eureka Dashboard:     http://localhost:8761"
echo "API Gateway:          http://localhost:8080"
echo "Customer Service:     http://localhost:8081"
echo "Sales Service:        http://localhost:8082"
echo "Auth Service:         http://localhost:8083"
echo "Analytics Service:    http://localhost:8084"
echo "Notification Service: http://localhost:8085"
echo
echo "All services are running in background."
echo "Check logs in backend/*/logs/ directories."
echo "To stop services, use: pkill -f java"
echo 