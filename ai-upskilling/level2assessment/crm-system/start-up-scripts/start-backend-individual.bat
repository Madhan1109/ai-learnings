@echo off
echo ========================================
echo    CRM System Individual Service Startup
echo ========================================
echo.

:: Check prerequisites
echo [1/8] Checking prerequisites...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed!
    pause
    exit /b 1
)

mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed!
    pause
    exit /b 1
)
echo ✓ All prerequisites are installed

:: Start infrastructure
echo [2/8] Starting infrastructure services...
docker-compose up -d postgres redis zookeeper kafka
if %errorlevel% neq 0 (
    echo ERROR: Failed to start infrastructure!
    pause
    exit /b 1
)
echo ✓ Infrastructure started

:: Wait for infrastructure
echo Waiting for infrastructure to be ready...
timeout /t 10 /nobreak >nul

:: Build all services
echo [3/8] Building all services...
echo Building Customer Service...
cd backend\customer-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Customer Service!
    pause
    exit /b 1
)

echo Building Sales Service...
cd ..\sales-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Sales Service!
    pause
    exit /b 1
)

echo Building Auth Service...
cd ..\auth-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Auth Service!
    pause
    exit /b 1
)

echo Building Analytics Service...
cd ..\analytics-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Analytics Service!
    pause
    exit /b 1
)

echo Building Notification Service...
cd ..\notification-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Notification Service!
    pause
    exit /b 1
)

echo Building API Gateway...
cd ..\api-gateway
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build API Gateway!
    pause
    exit /b 1
)

echo Building Eureka Service...
cd ..\eureka-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Eureka Service!
    pause
    exit /b 1
)

cd ..\..
echo ✓ All services built successfully

:: Start Eureka first
echo [4/8] Starting Eureka Service Discovery...
start "Eureka Service" cmd /k "cd backend\eureka-service && java -jar target\eureka-service-1.0.0.jar"
echo ✓ Eureka Service started

:: Wait for Eureka
echo Waiting for Eureka to be ready...
timeout /t 15 /nobreak >nul

:: Start Customer Service
echo [5/8] Starting Customer Service...
start "Customer Service" cmd /k "cd backend\customer-service && java -jar target\customer-service-1.0.0.jar"
echo ✓ Customer Service started

:: Wait for Customer Service
timeout /t 10 /nobreak >nul

:: Start Sales Service
echo [6/8] Starting Sales Service...
start "Sales Service" cmd /k "cd backend\sales-service && java -jar target\sales-service-1.0.0.jar"
echo ✓ Sales Service started

:: Wait for Sales Service
timeout /t 10 /nobreak >nul

:: Start Auth Service
echo [7/8] Starting Auth Service...
start "Auth Service" cmd /k "cd backend\auth-service && java -jar target\auth-service-1.0.0.jar"
echo ✓ Auth Service started

:: Wait for Auth Service
timeout /t 10 /nobreak >nul

:: Start Analytics Service
echo [8/8] Starting Analytics Service...
start "Analytics Service" cmd /k "cd backend\analytics-service && java -jar target\analytics-service-1.0.0.jar"
echo ✓ Analytics Service started

:: Wait for Analytics Service
timeout /t 10 /nobreak >nul

:: Start Notification Service
echo Starting Notification Service...
start "Notification Service" cmd /k "cd backend\notification-service && java -jar target\notification-service-1.0.0.jar"
echo ✓ Notification Service started

:: Wait for Notification Service
timeout /t 10 /nobreak >nul

:: Start API Gateway
echo Starting API Gateway...
start "API Gateway" cmd /k "cd backend\api-gateway && java -jar target\api-gateway-1.0.0.jar"
echo ✓ API Gateway started

echo.
echo ========================================
echo    All Services Started Successfully!
echo ========================================
echo.
echo Service URLs:
echo Eureka Dashboard:     http://localhost:8761
echo API Gateway:          http://localhost:8080
echo Customer Service:     http://localhost:8081
echo Sales Service:        http://localhost:8082
echo Auth Service:         http://localhost:8083
echo Analytics Service:    http://localhost:8084
echo Notification Service: http://localhost:8085
echo.
echo Each service is running in its own command window.
echo Close the windows to stop individual services.
echo.
pause 