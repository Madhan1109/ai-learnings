#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo "   CRM System Backend Startup Script"
echo "========================================"
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found! Please run this script from the CRM system root directory."
    exit 1
fi

# Check prerequisites
echo "[1/8] Checking prerequisites..."

# Check Docker
echo "Checking Docker..."
if ! docker version >/dev/null 2>&1; then
    print_error "Docker is not running! Please start Docker Desktop and try again."
    exit 1
fi
print_status "Docker is running"

# Check Java
echo "Checking Java..."
if ! java -version >/dev/null 2>&1; then
    print_error "Java is not installed or not in PATH!"
    exit 1
fi
print_status "Java is installed"

# Check Maven
echo "Checking Maven..."
if ! mvn -version >/dev/null 2>&1; then
    print_error "Maven is not installed or not in PATH!"
    exit 1
fi
print_status "Maven is installed"

# Check required directories
echo "[2/8] Validating project structure..."

echo "Checking customer-service..."
if [ ! -d "backend/customer-service" ]; then
    print_error "Directory backend/customer-service not found!"
    exit 1
fi
if [ ! -f "backend/customer-service/pom.xml" ]; then
    print_error "File backend/customer-service/pom.xml not found!"
    exit 1
fi
print_status "customer-service validated"

echo "Checking sales-service..."
if [ ! -d "backend/sales-service" ]; then
    print_error "Directory backend/sales-service not found!"
    exit 1
fi
if [ ! -f "backend/sales-service/pom.xml" ]; then
    print_error "File backend/sales-service/pom.xml not found!"
    exit 1
fi
print_status "sales-service validated"

echo "Checking auth-service..."
if [ ! -d "backend/auth-service" ]; then
    print_error "Directory backend/auth-service not found!"
    exit 1
fi
if [ ! -f "backend/auth-service/pom.xml" ]; then
    print_error "File backend/auth-service/pom.xml not found!"
    exit 1
fi
print_status "auth-service validated"

echo "Checking analytics-service..."
if [ ! -d "backend/analytics-service" ]; then
    print_error "Directory backend/analytics-service not found!"
    exit 1
fi
if [ ! -f "backend/analytics-service/pom.xml" ]; then
    print_error "File backend/analytics-service/pom.xml not found!"
    exit 1
fi
print_status "analytics-service validated"

echo "Checking notification-service..."
if [ ! -d "backend/notification-service" ]; then
    print_error "Directory backend/notification-service not found!"
    exit 1
fi
if [ ! -f "backend/notification-service/pom.xml" ]; then
    print_error "File backend/notification-service/pom.xml not found!"
    exit 1
fi
print_status "notification-service validated"

echo "Checking api-gateway..."
if [ ! -d "backend/api-gateway" ]; then
    print_error "Directory backend/api-gateway not found!"
    exit 1
fi
if [ ! -f "backend/api-gateway/pom.xml" ]; then
    print_error "File backend/api-gateway/pom.xml not found!"
    exit 1
fi
print_status "api-gateway validated"

echo "Checking eureka-service..."
if [ ! -d "backend/eureka-service" ]; then
    print_error "Directory backend/eureka-service not found!"
    exit 1
fi
if [ ! -f "backend/eureka-service/pom.xml" ]; then
    print_error "File backend/eureka-service/pom.xml not found!"
    exit 1
fi
print_status "eureka-service validated"

print_status "Project structure validated"

# Clean previous builds
echo "[3/8] Cleaning previous builds..."
docker-compose down --remove-orphans >/dev/null 2>&1
print_status "Previous containers stopped"

# Build all Maven projects (parallel for Linux/macOS)
echo "[4/8] Building Maven projects (parallel)..."

# Function to build a service
build_service() {
    local service=$1
    local dir_name=$2
    echo "Building $service..."
    cd "backend/$dir_name"
    if mvn clean install -DskipTests -q; then
        print_status "$service built successfully"
    else
        print_error "Failed to build $service"
        exit 1
    fi
    cd ../..
}

# Build all services in parallel
pids=()
# Service names for Docker builds
docker_services=("customer-service" "sales-service" "auth-service" "analytics-service" "notification-service" "api-gateway" "eureka")
# Directory names for Maven builds
dir_names=("customer-service" "sales-service" "auth-service" "analytics-service" "notification-service" "api-gateway" "eureka-service")

for i in "${!docker_services[@]}"; do
    build_service "${docker_services[$i]}" "${dir_names[$i]}" &
    pids+=($!)
done

# Wait for all builds to complete
for pid in "${pids[@]}"; do
    wait $pid
    if [ $? -ne 0 ]; then
        print_error "One or more Maven builds failed!"
        exit 1
    fi
done

print_status "All Maven projects built successfully"

# Build all Docker images (parallel for Linux/macOS)
echo "[5/8] Building Docker images (parallel)..."

# Function to build Docker image
build_docker_image() {
    local service=$1
    echo "Building $service Docker image..."
    if docker-compose build "$service" >/dev/null 2>&1; then
        print_status "$service Docker image built"
    else
        print_error "Failed to build $service Docker image"
        exit 1
    fi
}

# Build all Docker images in parallel
pids=()
for service in "${docker_services[@]}"; do
    build_docker_image "$service" &
    pids+=($!)
done

# Wait for all Docker builds to complete
for pid in "${pids[@]}"; do
    wait $pid
    if [ $? -ne 0 ]; then
        print_error "One or more Docker builds failed!"
        exit 1
    fi
done

print_status "All Docker images built successfully"

# Start infrastructure services
echo "[6/8] Starting infrastructure services..."
if docker-compose up -d postgres redis zookeeper kafka; then
    print_status "Infrastructure services started"
else
    print_error "Failed to start infrastructure services!"
    exit 1
fi

# Wait for infrastructure to be ready
echo "[7/8] Waiting for infrastructure to be ready..."
sleep 15
print_status "Infrastructure is ready"

# Start Eureka Service Discovery
echo "[8/8] Starting Eureka Service Discovery..."
if docker-compose up -d eureka; then
    print_status "Eureka Service Discovery started"
else
    print_error "Failed to start Eureka service!"
    exit 1
fi

# Wait for Eureka to be ready
print_info "Waiting for Eureka to be ready..."
sleep 20

# Start all backend services in parallel
print_info "Starting all backend services..."
if docker-compose up -d customer-service sales-service auth-service analytics-service notification-service api-gateway; then
    print_status "All backend services started"
else
    print_error "Failed to start backend services!"
    exit 1
fi

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 30

# Health check function
check_service_health() {
    local service=$1
    local port=$2
    local endpoint=$3
    
    if curl -s "http://localhost:$port$endpoint" >/dev/null 2>&1; then
        print_status "$service is healthy"
        return 0
    else
        print_warning "$service health check failed"
        return 1
    fi
}

# Display service status
echo
echo -e "${BLUE}========================================"
echo "   Service Status"
echo "========================================"
echo -e "${NC}"
docker-compose ps

echo
echo -e "${BLUE}========================================"
echo "   Service URLs"
echo "========================================"
echo -e "${NC}"
echo "Eureka Dashboard:     http://localhost:8761"
echo "API Gateway:          http://localhost:8080"
echo "Customer Service:     http://localhost:8081"
echo "Sales Service:        http://localhost:8082"
echo "Auth Service:         http://localhost:8083"
echo "Analytics Service:    http://localhost:8084"
echo "Notification Service: http://localhost:8085"

echo
echo -e "${BLUE}========================================"
echo "   Health Check Commands"
echo "========================================"
echo -e "${NC}"
echo "API Gateway Health:   curl http://localhost:8080/actuator/health"
echo "Customer Service:     curl http://localhost:8081/api/customers/actuator/health"
echo "Sales Service:        curl http://localhost:8082/api/sales/actuator/health"
echo "Auth Service:         curl http://localhost:8083/api/auth/actuator/health"

echo
echo -e "${GREEN}========================================"
echo "   Backend Services Started Successfully!"
echo "========================================"
echo -e "${NC}"
echo "To stop all services, run: ./scripts/stop-backend.sh"
echo "To view logs, run: docker-compose logs -f"
echo "To check health, run: ./start-up-scripts/health-check.sh"
echo

# Optional: Run health checks
read -p "Do you want to run health checks now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running health checks..."
    check_service_health "API Gateway" "8080" "/actuator/health"
    check_service_health "Customer Service" "8081" "/api/customers/actuator/health"
    check_service_health "Sales Service" "8082" "/api/sales/actuator/health"
    check_service_health "Auth Service" "8083" "/api/auth/actuator/health"
fi 