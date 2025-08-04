# Runtime Issues Solved

This document tracks all runtime issues encountered and their solutions during the CRM system setup.

## Issue 1: Java Compilation Errors

### Problem
- `Map.of()` exceeded 10 key-value pair limit in `AuthController.java`
- `@EnableCircuitBreaker` annotation deprecated in `ApiGatewayApplication.java`

### Solution
- Replaced `Map.of()` with `new HashMap<>()` and individual `put()` calls
- Removed deprecated `@EnableCircuitBreaker` annotation (auto-enabled in newer Spring Cloud)

### Files Modified
- `backend/auth-service/src/main/java/com/crm/authservice/controller/AuthController.java`
- `backend/api-gateway/src/main/java/com/crm/apigateway/ApiGatewayApplication.java`

## Issue 2: Docker Image Build Failures

### Problem
- Docker images failed to build due to deprecated `openjdk` image tags
- "not found" errors during application startup

### Solution
- Updated all Dockerfiles to use `eclipse-temurin` instead of `openjdk`
- Changed from `openjdk:17-jre-slim` to `eclipse-temurin:17-jre`
- Changed from `maven:3.8.4-openjdk-17` to `maven:3.9.6-eclipse-temurin-17`

### Files Modified
- All `backend/*/Dockerfile` files

## Issue 3: YAML Configuration Errors

### Problem
- `DuplicateKeyException` due to multiple `spring:` sections in YAML files
- `DuplicateKeyException` due to multiple `password` keys in auth-service

### Solution
- Merged duplicate `spring:` sections in configuration files
- Merged duplicate `password` configurations in auth-service

### Files Modified
- `backend/api-gateway/src/main/resources/application.yml`
- `backend/sales-service/src/main/resources/application.yml`
- `backend/notification-service/src/main/resources/application.yml`
- `backend/analytics-service/src/main/resources/application.yml`
- `backend/auth-service/src/main/resources/application.yml`

## Issue 4: Missing RedisTemplate Beans

### Problem
- `RedisTemplate` bean not found in multiple services
- Services failed to start due to missing Redis configuration

### Solution
- Created `RedisConfig.java` classes for each service
- Added proper Redis template configuration with serializers

### Files Created
- `backend/customer-service/src/main/java/com/crm/customerservice/config/RedisConfig.java`
- `backend/sales-service/src/main/java/com/crm/salesservice/config/RedisConfig.java`
- `backend/analytics-service/src/main/java/com/crm/analyticsservice/config/RedisConfig.java`
- `backend/notification-service/src/main/java/com/crm/notificationservice/config/RedisConfig.java`

## Issue 5: Database Initialization Issues

### Problem
- PostgreSQL syntax errors in `init.sql`
- Schema mismatches between `init.sql` and `data.sql`
- Duplicate data insertion errors

### Solution
- Fixed PostgreSQL syntax in `init.sql`
- Aligned schema between `init.sql` and `data.sql`
- Removed duplicate INSERT statements from `init.sql`
- Added missing `username` field to `data.sql` INSERT statements

### Files Modified
- `docker/postgres/init.sql`
- `backend/customer-service/src/main/resources/data.sql`

## Issue 6: Java Version Mismatch

### Problem
- User has Java 21 installed but project configured for Java 17
- Compilation and runtime errors due to version mismatch

### Solution
- Updated all `pom.xml` files to use Java 21
- Updated all Dockerfiles to use `eclipse-temurin:21-jre` and `eclipse-temurin:21-jdk`
- Updated build stages to use `maven:3.9.6-eclipse-temurin-21`

### Files Modified
- All `backend/*/pom.xml` files
- All `backend/*/Dockerfile` files

## Issue 7: Docker Build Timeout Issues

### Problem
- Docker builds stuck downloading base images
- Network timeout errors: `Client.Timeout exceeded while awaiting headers`
- Slow Docker Hub connectivity

### Solution
- Created `start-backend-skip-docker.bat` script that builds Maven projects but skips Docker builds
- Created `download-docker-images.bat` script for manual image download with better error handling
- Provided alternative startup methods for slow network conditions

### Files Created
- `start-up-scripts/start-backend-skip-docker.bat`
- `start-up-scripts/download-docker-images.bat`

### Alternative Solutions
1. **Skip Docker Builds**: Use `start-backend-skip-docker.bat` to start with just Maven builds
2. **Manual Download**: Use `download-docker-images.bat` to pre-download images
3. **Retry Later**: Docker builds can be done manually when network is stable

## Issue 8: Frontend Docker Build Issues

### Problem
- Frontend Docker build failed due to missing `package-lock.json`
- `npm ci` requires lock file

### Solution
- Changed from `npm ci --only=production` to `npm install --omit=dev`

### Files Modified
- `frontend/Dockerfile`

## Issue 9: Startup Script Optimization

### Problem
- Startup scripts were slow and lacked proper error handling
- No validation of prerequisites
- Sequential builds taking too long

### Solution
- Optimized scripts for parallel builds where possible
- Added comprehensive error handling and validation
- Created multiple script variants for different use cases
- Added health checks and better user feedback

### Files Modified/Created
- `start-up-scripts/start-backend.sh` (optimized)
- `start-up-scripts/start-backend.bat` (optimized)
- `start-up-scripts/start-backend-sequential.sh`
- `start-up-scripts/start-backend-sequential.bat`
- `start-up-scripts/start-backend-fast.sh`
- `start-up-scripts/validate-startup.sh`
- `start-up-scripts/validate-startup.bat`

## Issue 10: Service Name Mapping

### Problem
- Mismatch between Docker service names and directory names
- `eureka` (Docker) vs `eureka-service` (directory) confusion

### Solution
- Updated startup scripts to correctly map service names
- Used separate arrays for Docker service names and directory names
- Fixed Maven build paths for Eureka service

### Files Modified
- `start-up-scripts/start-backend.sh`
- `start-up-scripts/start-backend.bat`

## Overall Status

✅ **All major issues resolved**
✅ **Java version compatibility fixed**
✅ **Docker build issues addressed**
✅ **Database initialization working**
✅ **Service discovery configured**
✅ **Multiple startup options available**

## Current Recommendations

1. **For Fast Startup**: Use `start-backend-skip-docker.bat` if Docker builds are slow
2. **For Full Build**: Use `start-backend-sequential.bat` for complete setup
3. **For Network Issues**: Use `download-docker-images.bat` to pre-download images
4. **For Development**: Use `start-backend-fast.sh` (Linux/macOS) for subsequent runs

## Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Customer Service**: http://localhost:8081
- **Sales Service**: http://localhost:8082
- **Analytics Service**: http://localhost:8083
- **Auth Service**: http://localhost:8084
- **Notification Service**: http://localhost:8085 