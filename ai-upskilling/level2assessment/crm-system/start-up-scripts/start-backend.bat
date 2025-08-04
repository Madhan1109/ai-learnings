@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    CRM System Backend Startup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "docker-compose.yml" (
    echo ERROR: docker-compose.yml not found! Please run this script from the CRM system root directory.
    exit /b 1
)

REM Check prerequisites
echo [1/8] Checking prerequisites...

REM Check Docker
docker version
if errorlevel 1 (
    echo ERROR: Docker is not running! Please start Docker Desktop and try again.
    exit /b 1
)
echo ✓ Docker is running

REM Check Java
java -version
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH!
    exit /b 1
)
echo ✓ Java is installed

REM Check Maven
mvn -version
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH!
    exit /b 1
)
echo ✓ Maven is installed

REM Check required directories
echo [2/8] Validating project structure...
for %%s in (customer-service sales-service auth-service analytics-service notification-service api-gateway eureka-service) do (
    if not exist "backend\%%s" (
        echo ERROR: Directory backend\%%s not found!
        exit /b 1
    )
    if not exist "backend\%%s\pom.xml" (
        echo ERROR: File backend\%%s\pom.xml not found!
        exit /b 1
    )
)
echo ✓ Project structure validated

REM Clean previous builds
echo [3/8] Cleaning previous builds...
docker-compose down --remove-orphans
echo ✓ Previous containers stopped

REM Build all Maven projects (sequential for Windows compatibility)
echo [4/8] Building Maven projects...
cd backend

for %%s in (customer-service sales-service auth-service analytics-service notification-service api-gateway eureka-service) do (
    echo Building %%s...
    cd %%s
    mvn clean install -DskipTests -q
    if errorlevel 1 (
        echo ERROR: Failed to build %%s!
        exit /b 1
    )
    echo ✓ %%s built successfully
    cd ..
)

cd ..
echo ✓ All Maven projects built successfully

REM Build all Docker images (sequential for Windows compatibility)
echo [5/8] Building Docker images...

for %%s in (customer-service sales-service auth-service analytics-service notification-service api-gateway eureka) do (
    echo Building %%s Docker image...
    docker-compose build %%s
    if errorlevel 1 (
        echo ERROR: Failed to build %%s Docker image!
        exit /b 1
    )
    echo ✓ %%s Docker image built
)

echo ✓ All Docker images built successfully

REM Start infrastructure services
echo [6/8] Starting infrastructure services...
docker-compose up -d postgres redis zookeeper kafka
if errorlevel 1 (
    echo ERROR: Failed to start infrastructure services!
    exit /b 1
)
echo ✓ Infrastructure services started

REM Wait for infrastructure to be ready
echo [7/8] Waiting for infrastructure to be ready...
timeout /t 15 /nobreak >nul
echo ✓ Infrastructure is ready

REM Start Eureka Service Discovery
echo [8/8] Starting Eureka Service Discovery...
docker-compose up -d eureka
if errorlevel 1 (
    echo ERROR: Failed to start Eureka service!
    exit /b 1
)
echo ✓ Eureka Service Discovery started

REM Wait for Eureka to be ready
echo Waiting for Eureka to be ready...
timeout /t 20 /nobreak >nul

REM Start all backend services
echo Starting all backend services...
docker-compose up -d customer-service sales-service auth-service analytics-service notification-service api-gateway
if errorlevel 1 (
    echo ERROR: Failed to start backend services!
    exit /b 1
)
echo ✓ All backend services started

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Display service status
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
echo To stop all services, run: stop-backend.bat
echo To view logs, run: docker-compose logs -f
echo To check health, run: health-check.bat
echo.

REM Optional: Run health checks
set /p RUN_HEALTH="Do you want to run health checks now? (y/n): "
if /i "%RUN_HEALTH%"=="y" (
    echo Running health checks...
    curl -s http://localhost:8080/actuator/health >nul 2>&1 && echo ✓ API Gateway is healthy || echo ⚠ API Gateway health check failed
    curl -s http://localhost:8081/api/customers/actuator/health >nul 2>&1 && echo ✓ Customer Service is healthy || echo ⚠ Customer Service health check failed
    curl -s http://localhost:8082/api/sales/actuator/health >nul 2>&1 && echo ✓ Sales Service is healthy || echo ⚠ Sales Service health check failed
    curl -s http://localhost:8083/api/auth/actuator/health >nul 2>&1 && echo ✓ Auth Service is healthy || echo ⚠ Auth Service health check failed
) 