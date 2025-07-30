@echo off
echo ========================================
echo    CRM System Backend Startup Script
echo ========================================
echo.

:: Check if Docker is running
echo [1/7] Checking Docker status...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running

:: Check if Java is installed
echo [2/7] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH!
    pause
    exit /b 1
)
echo ✓ Java is installed

:: Check if Maven is installed
echo [3/7] Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH!
    pause
    exit /b 1
)
echo ✓ Maven is installed

:: Start infrastructure services
echo [4/7] Starting infrastructure services...
echo Starting PostgreSQL, Redis, Kafka, Zookeeper...
docker-compose up -d postgres redis zookeeper kafka
if %errorlevel% neq 0 (
    echo ERROR: Failed to start infrastructure services!
    pause
    exit /b 1
)
echo ✓ Infrastructure services started

:: Wait for infrastructure to be ready
echo [5/7] Waiting for infrastructure to be ready...
timeout /t 10 /nobreak >nul
echo ✓ Infrastructure is ready

:: Start Eureka Service Discovery
echo [6/7] Starting Eureka Service Discovery...
docker-compose up -d eureka
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Eureka service!
    pause
    exit /b 1
)
echo ✓ Eureka Service Discovery started

:: Wait for Eureka to be ready
echo Waiting for Eureka to be ready...
timeout /t 15 /nobreak >nul

:: Start all backend services
echo [7/7] Starting all backend services...
echo Starting Customer Service, Sales Service, Auth Service, Analytics Service, Notification Service, API Gateway...

docker-compose up -d customer-service sales-service auth-service analytics-service notification-service api-gateway
if %errorlevel% neq 0 (
    echo ERROR: Failed to start backend services!
    pause
    exit /b 1
)
echo ✓ All backend services started

:: Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 20 /nobreak >nul

:: Display service status
echo.
echo ========================================
echo    Service Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo    Service URLs
echo ========================================
echo Eureka Dashboard:     http://localhost:8761
echo API Gateway:          http://localhost:8080
echo Customer Service:     http://localhost:8081
echo Sales Service:        http://localhost:8082
echo Auth Service:         http://localhost:8083
echo Analytics Service:    http://localhost:8084
echo Notification Service: http://localhost:8085
echo.

echo ========================================
echo    Health Check Commands
echo ========================================
echo API Gateway Health:   curl http://localhost:8080/actuator/health
echo Customer Service:     curl http://localhost:8081/api/customers/actuator/health
echo Sales Service:        curl http://localhost:8082/api/sales/actuator/health
echo Auth Service:         curl http://localhost:8083/api/auth/actuator/health
echo.

echo ========================================
echo    Backend Services Started Successfully!
echo ========================================
echo.
echo To stop all services, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
pause 