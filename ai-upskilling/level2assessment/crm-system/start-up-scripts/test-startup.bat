@echo off
echo ========================================
echo    Test Startup Script
echo ========================================
echo.

echo [1] Checking Docker...
docker version
if errorlevel 1 (
    echo ERROR: Docker is not running!
    exit /b 1
)
echo ✓ Docker is running

echo [2] Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java is not installed!
    exit /b 1
)
echo ✓ Java is installed

echo [3] Checking Maven...
mvn -version
if errorlevel 1 (
    echo ERROR: Maven is not installed!
    exit /b 1
)
echo ✓ Maven is installed

echo [4] Checking project structure...
if not exist "backend\customer-service" (
    echo ERROR: backend\customer-service not found!
    exit /b 1
)
echo ✓ Project structure OK

echo [5] Testing Maven build...
cd backend\customer-service
mvn clean install -DskipTests -q
if errorlevel 1 (
    echo ERROR: Maven build failed!
    exit /b 1
)
echo ✓ Maven build successful
cd ..\..

echo ========================================
echo    Test completed successfully!
echo ======================================== 