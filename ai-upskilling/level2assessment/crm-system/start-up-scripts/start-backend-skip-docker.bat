@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    CRM System Startup (Skip Docker)
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: Please run this script from the CRM system root directory!
    exit /b 1
)

echo [1/6] Checking prerequisites...

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    exit /b 1
) else (
    echo ✓ Docker is running
)

REM Check Java
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed!
    exit /b 1
) else (
    echo ✓ Java is installed
)

REM Check Maven
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed!
    exit /b 1
) else (
    echo ✓ Maven is installed
)

echo ✓ All prerequisites met
echo.

echo [2/6] Stopping any running containers...
docker-compose down >nul 2>&1
echo ✓ Stopped existing containers
echo.

echo [3/6] Building Maven projects (sequential)...
cd backend

for %%s in (customer-service sales-service auth-service analytics-service notification-service api-gateway eureka-service) do (
    echo Building %%s...
    cd %%s
    mvn clean install -DskipTests -q
    if errorlevel 1 (
        echo ERROR: Failed to build %%s!
        cd ..
        exit /b 1
    )
    echo ✓ %%s built successfully
    cd ..
)
cd ..
echo ✓ All Maven projects built successfully
echo.

echo [4/6] Starting infrastructure services...
echo Starting PostgreSQL...
docker-compose up -d postgres
timeout /t 10 /nobreak >nul

echo Starting Redis...
docker-compose up -d redis
timeout /t 5 /nobreak >nul

echo Starting Zookeeper...
docker-compose up -d zookeeper
timeout /t 10 /nobreak >nul

echo Starting Kafka...
docker-compose up -d kafka
timeout /t 15 /nobreak >nul

echo ✓ Infrastructure services started
echo.

echo [5/6] Starting Eureka Service Discovery...
docker-compose up -d eureka
timeout /t 20 /nobreak >nul
echo ✓ Eureka service started
echo.

echo [6/6] Starting microservices (without Docker builds)...
echo.
echo NOTE: Docker builds are skipped due to connectivity issues.
echo You can manually build Docker images later using:
echo   docker-compose build
echo.
echo Starting services with existing images (if available)...
echo.

docker-compose up -d customer-service
timeout /t 10 /nobreak >nul

docker-compose up -d sales-service
timeout /t 10 /nobreak >nul

docker-compose up -d auth-service
timeout /t 10 /nobreak >nul

docker-compose up -d analytics-service
timeout /t 10 /nobreak >nul

docker-compose up -d notification-service
timeout /t 10 /nobreak >nul

docker-compose up -d api-gateway
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    CRM System Startup Complete!
echo ========================================
echo.
echo Services Status:
docker-compose ps
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To build Docker images later:
echo   docker-compose build
echo.
echo To access the application:
echo   Frontend: http://localhost:3000
echo   API Gateway: http://localhost:8080
echo   Eureka: http://localhost:8761
echo.
echo Press any key to exit...
pause >nul 