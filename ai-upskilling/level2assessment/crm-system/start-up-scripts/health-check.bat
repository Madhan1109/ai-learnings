@echo off
echo ========================================
echo    CRM System Health Check Script
echo ========================================
echo.

echo Checking service health...
echo.

:: Check if curl is available
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: curl is not installed. Installing curl...
    echo Please install curl or use PowerShell commands instead.
    echo.
    goto :powershell_checks
)

echo [1/7] Checking API Gateway Health...
curl -s http://localhost:8080/actuator/health
if %errorlevel% neq 0 (
    echo ❌ API Gateway is not responding
) else (
    echo ✓ API Gateway is healthy
)

echo.
echo [2/7] Checking Customer Service Health...
curl -s http://localhost:8081/api/customers/actuator/health
if %errorlevel% neq 0 (
    echo ❌ Customer Service is not responding
) else (
    echo ✓ Customer Service is healthy
)

echo.
echo [3/7] Checking Sales Service Health...
curl -s http://localhost:8082/api/sales/actuator/health
if %errorlevel% neq 0 (
    echo ❌ Sales Service is not responding
) else (
    echo ✓ Sales Service is healthy
)

echo.
echo [4/7] Checking Auth Service Health...
curl -s http://localhost:8083/api/auth/actuator/health
if %errorlevel% neq 0 (
    echo ❌ Auth Service is not responding
) else (
    echo ✓ Auth Service is healthy
)

echo.
echo [5/7] Checking Analytics Service Health...
curl -s http://localhost:8084/api/analytics/actuator/health
if %errorlevel% neq 0 (
    echo ❌ Analytics Service is not responding
) else (
    echo ✓ Analytics Service is healthy
)

echo.
echo [6/7] Checking Notification Service Health...
curl -s http://localhost:8085/api/notifications/actuator/health
if %errorlevel% neq 0 (
    echo ❌ Notification Service is not responding
) else (
    echo ✓ Notification Service is healthy
)

echo.
echo [7/7] Checking Eureka Dashboard...
curl -s http://localhost:8761
if %errorlevel% neq 0 (
    echo ❌ Eureka Dashboard is not responding
) else (
    echo ✓ Eureka Dashboard is accessible
)

goto :end

:powershell_checks
echo Using PowerShell for health checks...
echo.

echo [1/7] Checking API Gateway Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ API Gateway is healthy' } catch { Write-Host '❌ API Gateway is not responding' }"

echo [2/7] Checking Customer Service Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8081/api/customers/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ Customer Service is healthy' } catch { Write-Host '❌ Customer Service is not responding' }"

echo [3/7] Checking Sales Service Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8082/api/sales/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ Sales Service is healthy' } catch { Write-Host '❌ Sales Service is not responding' }"

echo [4/7] Checking Auth Service Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8083/api/auth/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ Auth Service is healthy' } catch { Write-Host '❌ Auth Service is not responding' }"

echo [5/7] Checking Analytics Service Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8084/api/analytics/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ Analytics Service is healthy' } catch { Write-Host '❌ Analytics Service is not responding' }"

echo [6/7] Checking Notification Service Health...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8085/api/notifications/actuator/health' -UseBasicParsing | Out-Null; Write-Host '✓ Notification Service is healthy' } catch { Write-Host '❌ Notification Service is not responding' }"

echo [7/7] Checking Eureka Dashboard...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8761' -UseBasicParsing | Out-Null; Write-Host '✓ Eureka Dashboard is accessible' } catch { Write-Host '❌ Eureka Dashboard is not responding' }"

:end
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
echo    Health Check Complete!
echo ========================================
echo.
pause 