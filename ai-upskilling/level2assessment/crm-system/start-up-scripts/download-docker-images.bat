@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Downloading Docker Base Images
echo ========================================
echo.

echo This script will download the required Docker base images.
echo This may take several minutes depending on your internet connection.
echo.

set /p confirm="Do you want to continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Download cancelled.
    exit /b 0
)

echo.
echo Starting download...

REM List of required base images
set images[0]=eclipse-temurin:21-jre
set images[1]=eclipse-temurin:21-jdk
set images[2]=maven:3.9.6-eclipse-temurin-21
set images[3]=postgres:14-alpine
set images[4]=redis:7-alpine
set images[5]=confluentinc/cp-zookeeper:7.4.0
set images[6]=confluentinc/cp-kafka:7.4.0
set images[7]=node:18-alpine

set success_count=0
set total_count=8

for /l %%i in (0,1,7) do (
    set current_image=!images[%%i]!
    echo.
    echo [%%i+1/8] Downloading !current_image!...
    
    REM Try to download with timeout
    docker pull !current_image!
    if errorlevel 1 (
        echo ✗ Failed to download !current_image!
        echo   This might be due to network issues or Docker Hub being slow.
        echo   You can try again later with: docker pull !current_image!
    ) else (
        echo ✓ Successfully downloaded !current_image!
        set /a success_count+=1
    )
)

echo.
echo ========================================
echo    Download Summary
echo ========================================
echo.
echo Successfully downloaded: %success_count%/%total_count% images
echo.

if %success_count% lss %total_count% (
    echo Some images failed to download. This is normal if you have:
    echo - Slow internet connection
    echo - Docker Hub connectivity issues
    echo - Firewall blocking Docker Hub
    echo.
    echo You can try downloading the remaining images later:
    echo   docker pull eclipse-temurin:21-jre
    echo   docker pull maven:3.9.6-eclipse-temurin-21
    echo   etc.
    echo.
    echo Or use the skip-docker startup script:
    echo   start-up-scripts\start-backend-skip-docker.bat
) else (
    echo All images downloaded successfully!
    echo You can now run the full startup script.
)

echo.
echo Press any key to exit...
pause >nul 