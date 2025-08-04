@echo off
echo Testing for loop...
set SERVICES=customer-service sales-service auth-service analytics-service notification-service api-gateway eureka-service
for %%s in (%SERVICES%) do (
    echo Checking %%s...
    if exist "backend\%%s" (
        echo ✓ %%s exists
    ) else (
        echo ERROR: %%s not found!
        exit /b 1
    )
)
echo All services checked successfully! 