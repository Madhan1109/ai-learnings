echo ========================================
echo    CRM System Backend Startup Script (DEBUG)
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
echo Checking Docker...
docker version
if errorlevel 1 (
    echo ERROR: Docker is not running! Please start Docker Desktop and try again.
    exit /b 1
)
echo ✓ Docker is running

REM Check Java
echo Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH!
    exit /b 1
)
echo ✓ Java is installed

REM Check Maven
echo Checking Maven...
mvn -version
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH!
    exit /b 1
)
echo ✓ Maven is installed

REM Check required directories
echo [2/8] Validating project structure...
set SERVICES=customer-service sales-service auth-service analytics-service notification-service api-gateway eureka-service
echo Services to check: %SERVICES%
for %%s in (%SERVICES%) do (
    echo Checking %%s...
    if not exist "backend\%%s" (
        echo ERROR: Directory backend\%%s not found!
        exit /b 1
    )
    echo ✓ Directory backend\%%s exists
    if not exist "backend\%%s\pom.xml" (
        echo ERROR: File backend\%%s\pom.xml not found!
        exit /b 1
    )
    echo ✓ File backend\%%s\pom.xml exists
)
echo ✓ Project structure validated

echo ========================================
echo    Debug completed successfully!
echo ======================================== 