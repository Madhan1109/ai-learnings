# API Gateway

This is the API Gateway for the AI-Powered Learning Management System (LMS).

## Features
- Spring Cloud Gateway
- Java 21
- Routing to all LMS microservices
- Circuit breaking (Resilience4j)
- Distributed tracing (Sleuth)
- Monitoring (Actuator, Prometheus)
- Docker-ready

## Build
```
mvn clean package
```

## Run
```
java -jar target/api-gateway-*.jar
```

## Docker
```
docker build -t api-gateway .
docker run -p 8080:8080 api-gateway
```

## Configuration
Edit `src/main/resources/application.yml` to configure routes and monitoring.

--- 