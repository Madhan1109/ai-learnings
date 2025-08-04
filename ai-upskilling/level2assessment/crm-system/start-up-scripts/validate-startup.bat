@echo off
echo ========================================
echo    CRM System Startup Validation
echo ========================================
echo.

REM Check if we're in the right directory
echo [1/8] Checking current directory...
if not exist "docker-compose.yml" (
    echo ERROR: docker-compose.yml not found!
    echo Please run this script from the CRM system root directory.
    exit /b 1
)
echo ✓ Running from correct directory

REM Check if all required directories exist
echo [2/8] Checking required directories...
if not exist "backend\customer-service" (
    echo ERROR: Directory backend\customer-service not found!
    exit /b 1
)
if not exist "backend\sales-service" (
    echo ERROR: Directory backend\sales-service not found!
    exit /b 1
)
if not exist "backend\auth-service" (
    echo ERROR: Directory backend\auth-service not found!
    exit /b 1
)
if not exist "backend\analytics-service" (
    echo ERROR: Directory backend\analytics-service not found!
    exit /b 1
)
if not exist "backend\notification-service" (
    echo ERROR: Directory backend\notification-service not found!
    exit /b 1
)
if not exist "backend\api-gateway" (
    echo ERROR: Directory backend\api-gateway not found!
    exit /b 1
)
if not exist "backend\eureka-service" (
    echo ERROR: Directory backend\eureka-service not found!
    exit /b 1
)
if not exist "docker\postgres" (
    echo ERROR: Directory docker\postgres not found!
    exit /b 1
)
echo ✓ All required directories exist

REM Check if all required files exist
echo [3/8] Checking required files...
if not exist "docker-compose.yml" (
    echo ERROR: File docker-compose.yml not found!
    exit /b 1
)
if not exist "docker\postgres\init.sql" (
    echo ERROR: File docker\postgres\init.sql not found!
    exit /b 1
)
if not exist "backend\customer-service\pom.xml" (
    echo ERROR: File backend\customer-service\pom.xml not found!
    exit /b 1
)
if not exist "backend\sales-service\pom.xml" (
    echo ERROR: File backend\sales-service\pom.xml not found!
    exit /b 1
)
if not exist "backend\auth-service\pom.xml" (
    echo ERROR: File backend\auth-service\pom.xml not found!
    exit /b 1
)
if not exist "backend\analytics-service\pom.xml" (
    echo ERROR: File backend\analytics-service\pom.xml not found!
    exit /b 1
)
if not exist "backend\notification-service\pom.xml" (
    echo ERROR: File backend\notification-service\pom.xml not found!
    exit /b 1
)
if not exist "backend\api-gateway\pom.xml" (
    echo ERROR: File backend\api-gateway\pom.xml not found!
    exit /b 1
)
if not exist "backend\eureka-service\pom.xml" (
    echo ERROR: File backend\eureka-service\pom.xml not found!
    exit /b 1
)
echo ✓ All required files exist

REM Check if Docker is running
echo [4/8] Checking Docker status...
docker version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)
echo ✓ Docker is running

REM Check if Java is installed
echo [5/8] Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH!
    exit /b 1
)
echo ✓ Java is installed

REM Check if Maven is installed
echo [6/8] Checking Maven installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH!
    exit /b 1
)
echo ✓ Maven is installed

REM Check if docker-compose is available
echo [7/8] Checking docker-compose...
docker-compose version >nul 2>&1
if errorlevel 1 (
    echo ERROR: docker-compose is not installed!
    exit /b 1
)
echo ✓ docker-compose is available

REM Check if ports are available
echo [8/8] Checking port availability...
netstat -an | findstr ":8761 " >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 8761 is already in use!
)
netstat -an | findstr ":8080 " >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 8080 is already in use!
)
netstat -an | findstr ":8081 " >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 8081 is already in use!
)
echo ✓ Port availability checked

echo.
echo ========================================
echo    Validation Complete!
echo ========================================
echo ✓ All prerequisites are met
echo ✓ All required files and directories exist
echo ✓ All tools are properly installed
echo.
echo You can now run the startup script:
echo   start-up-scripts\start-backend.bat
echo. 