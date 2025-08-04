#!/bin/bash

echo "========================================"
echo "   CRM System Startup Validation"
echo "========================================"
echo

# Check if we're in the right directory
echo "[1/8] Checking current directory..."
if [ ! -f "docker-compose.yml" ]; then
    echo "ERROR: docker-compose.yml not found!"
    echo "Please run this script from the CRM system root directory."
    exit 1
fi
echo "✓ Running from correct directory"

# Check if all required directories exist
echo "[2/8] Checking required directories..."
required_dirs=(
    "backend/customer-service"
    "backend/sales-service"
    "backend/auth-service"
    "backend/analytics-service"
    "backend/notification-service"
    "backend/api-gateway"
    "backend/eureka-service"
    "docker/postgres"
)

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "ERROR: Directory $dir not found!"
        exit 1
    fi
done
echo "✓ All required directories exist"

# Check if all required files exist
echo "[3/8] Checking required files..."
required_files=(
    "docker-compose.yml"
    "docker/postgres/init.sql"
    "backend/customer-service/pom.xml"
    "backend/sales-service/pom.xml"
    "backend/auth-service/pom.xml"
    "backend/analytics-service/pom.xml"
    "backend/notification-service/pom.xml"
    "backend/api-gateway/pom.xml"
    "backend/eureka-service/pom.xml"
    "backend/customer-service/Dockerfile"
    "backend/sales-service/Dockerfile"
    "backend/auth-service/Dockerfile"
    "backend/analytics-service/Dockerfile"
    "backend/notification-service/Dockerfile"
    "backend/api-gateway/Dockerfile"
    "backend/eureka-service/Dockerfile"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "ERROR: File $file not found!"
        exit 1
    fi
done
echo "✓ All required files exist"

# Check if Docker is running
echo "[4/8] Checking Docker status..."
if ! docker version >/dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi
echo "✓ Docker is running"

# Check if Java is installed
echo "[5/8] Checking Java installation..."
if ! java -version >/dev/null 2>&1; then
    echo "ERROR: Java is not installed or not in PATH!"
    exit 1
fi
echo "✓ Java is installed"

# Check if Maven is installed
echo "[6/8] Checking Maven installation..."
if ! mvn -version >/dev/null 2>&1; then
    echo "ERROR: Maven is not installed or not in PATH!"
    exit 1
fi
echo "✓ Maven is installed"

# Check if docker-compose is available
echo "[7/8] Checking docker-compose..."
if ! docker-compose version >/dev/null 2>&1; then
    echo "ERROR: docker-compose is not installed!"
    exit 1
fi
echo "✓ docker-compose is available"

# Check if ports are available
echo "[8/8] Checking port availability..."
ports=(8761 8080 8081 8082 8083 8084 8085 5432 6379 9092 2181)
for port in "${ports[@]}"; do
    if netstat -an 2>/dev/null | grep -q ":$port "; then
        echo "WARNING: Port $port is already in use!"
    fi
done
echo "✓ Port availability checked"

echo
echo "========================================"
echo "   Validation Complete!"
echo "========================================"
echo "✓ All prerequisites are met"
echo "✓ All required files and directories exist"
echo "✓ All tools are properly installed"
echo
echo "You can now run the startup script:"
echo "  ./start-up-scripts/start-backend.sh"
echo 