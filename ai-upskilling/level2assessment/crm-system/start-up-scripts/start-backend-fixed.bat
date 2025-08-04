@echo off
echo ========================================
echo    CRM System Backend Startup Script
echo ========================================
echo.

echo [1/8] Checking prerequisites...

echo Checking Docker...
docker version
if errorlevel 1 (
    echo ERROR: Docker is not running! Please start Docker Desktop and try again.
    exit /b 1
)
echo ✓ Docker is running

echo Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH!
    exit /b 1
)
echo ✓ Java is installed

echo Checking Maven...
mvn -version
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH!
    exit /b 1
)
echo ✓ Maven is installed

echo [2/8] Validating project structure...
echo Checking customer-service...
if not exist "backend\customer-service" (
    echo ERROR: Directory backend\customer-service not found!
    exit /b 1
)
if not exist "backend\customer-service\pom.xml" (
    echo ERROR: File backend\customer-service\pom.xml not found!
    exit /b 1
)
echo ✓ customer-service validated

echo Checking sales-service...
if not exist "backend\sales-service" (
    echo ERROR: Directory backend\sales-service not found!
    exit /b 1
)
if not exist "backend\sales-service\pom.xml" (
    echo ERROR: File backend\sales-service\pom.xml not found!
    exit /b 1
)
echo ✓ sales-service validated

echo Checking auth-service...
if not exist "backend\auth-service" (
    echo ERROR: Directory backend\auth-service not found!
    exit /b 1
)
if not exist "backend\auth-service\pom.xml" (
    echo ERROR: File backend\auth-service\pom.xml not found!
    exit /b 1
)
echo ✓ auth-service validated

echo Checking analytics-service...
if not exist "backend\analytics-service" (
    echo ERROR: Directory backend\analytics-service not found!
    exit /b 1
)
if not exist "backend\analytics-service\pom.xml" (
    echo ERROR: File backend\analytics-service\pom.xml not found!
    exit /b 1
)
echo ✓ analytics-service validated

echo Checking notification-service...
if not exist "backend\notification-service" (
    echo ERROR: Directory backend\notification-service not found!
    exit /b 1
)
if not exist "backend\notification-service\pom.xml" (
    echo ERROR: File backend\notification-service\pom.xml not found!
    exit /b 1
)
echo ✓ notification-service validated

echo Checking api-gateway...
if not exist "backend\api-gateway" (
    echo ERROR: Directory backend\api-gateway not found!
    exit /b 1
)
if not exist "backend\api-gateway\pom.xml" (
    echo ERROR: File backend\api-gateway\pom.xml not found!
    exit /b 1
)
echo ✓ api-gateway validated

echo Checking eureka-service...
if not exist "backend\eureka-service" (
    echo ERROR: Directory backend\eureka-service not found!
    exit /b 1
)
if not exist "backend\eureka-service\pom.xml" (
    echo ERROR: File backend\eureka-service\pom.xml not found!
    exit /b 1
)
echo ✓ eureka-service validated

echo ✓ Project structure validated

echo [3/8] Cleaning previous builds...
docker-compose down --remove-orphans
echo ✓ Previous containers stopped

echo [4/8] Building Maven projects...
cd backend

echo Building customer-service...
cd customer-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build customer-service!
    exit /b 1
)
echo ✓ customer-service built successfully
cd ..

echo Building sales-service...
cd sales-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build sales-service!
    exit /b 1
)
echo ✓ sales-service built successfully
cd ..

echo Building auth-service...
cd auth-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build auth-service!
    exit /b 1
)
echo ✓ auth-service built successfully
cd ..

echo Building analytics-service...
cd analytics-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build analytics-service!
    exit /b 1
)
echo ✓ analytics-service built successfully
cd ..

echo Building notification-service...
cd notification-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build notification-service!
    exit /b 1
)
echo ✓ notification-service built successfully
cd ..

echo Building api-gateway...
cd api-gateway
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build api-gateway!
    exit /b 1
)
echo ✓ api-gateway built successfully
cd ..

echo Building eureka-service...
cd eureka-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Failed to build eureka-service!
    exit /b 1
)
echo ✓ eureka-service built successfully
cd ..

cd ..
echo ✓ All Maven projects built successfully

echo [5/8] Building Docker images...
echo Building customer-service Docker image...
docker-compose build customer-service
if errorlevel 1 (
    echo ERROR: Failed to build customer-service Docker image!
    exit /b 1
)
echo ✓ customer-service Docker image built

echo Building sales-service Docker image...
docker-compose build sales-service
if errorlevel 1 (
    echo ERROR: Failed to build sales-service Docker image!
    exit /b 1
)
echo ✓ sales-service Docker image built

echo Building auth-service Docker image...
docker-compose build auth-service
if errorlevel 1 (
    echo ERROR: Failed to build auth-service Docker image!
    exit /b 1
)
echo ✓ auth-service Docker image built

echo Building analytics-service Docker image...
docker-compose build analytics-service
if errorlevel 1 (
    echo ERROR: Failed to build analytics-service Docker image!
    exit /b 1
)
echo ✓ analytics-service Docker image built

echo Building notification-service Docker image...
docker-compose build notification-service
if errorlevel 1 (
    echo ERROR: Failed to build notification-service Docker image!
    exit /b 1
)
echo ✓ notification-service Docker image built

echo Building api-gateway Docker image...
docker-compose build api-gateway
if errorlevel 1 (
    echo ERROR: Failed to build api-gateway Docker image!
    exit /b 1
)
echo ✓ api-gateway Docker image built

echo Building eureka-service Docker image...
docker-compose build eureka-service
if errorlevel 1 (
    echo ERROR: Failed to build eureka-service Docker image!
    exit /b 1
)
echo ✓ eureka-service Docker image built

echo ✓ All Docker images built successfully

echo [6/8] Starting infrastructure services...
docker-compose up -d postgres redis zookeeper kafka
if errorlevel 1 (
    echo ERROR: Failed to start infrastructure services!
    exit /b 1
)
echo ✓ Infrastructure services started

echo [7/8] Waiting for infrastructure to be ready...
timeout /t 15 /nobreak >nul
echo ✓ Infrastructure is ready

echo [8/8] Starting Eureka Service Discovery...
docker-compose up -d eureka
if errorlevel 1 (
    echo ERROR: Failed to start Eureka service!
    exit /b 1
)
echo ✓ Eureka Service Discovery started

echo Waiting for Eureka to be ready...
timeout /t 20 /nobreak >nul

echo Starting all backend services...
docker-compose up -d customer-service sales-service auth-service analytics-service notification-service api-gateway
if errorlevel 1 (
    echo ERROR: Failed to start backend services!
    exit /b 1
)
echo ✓ All backend services started

echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul

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

set /p RUN_HEALTH="Do you want to run health checks now? (y/n): "
if /i "%RUN_HEALTH%"=="y" (
    echo Running health checks...
    curl -s http://localhost:8080/actuator/health >nul 2>&1 && echo ✓ API Gateway is healthy || echo ⚠ API Gateway health check failed
    curl -s http://localhost:8081/api/customers/actuator/health >nul 2>&1 && echo ✓ Customer Service is healthy || echo ⚠ Customer Service health check failed
    curl -s http://localhost:8082/api/sales/actuator/health >nul 2>&1 && echo ✓ Sales Service is healthy || echo ⚠ Sales Service health check failed
    curl -s http://localhost:8083/api/auth/actuator/health >nul 2>&1 && echo ✓ Auth Service is healthy || echo ⚠ Auth Service health check failed
) 