# Start from a lightweight OpenJDK 21 image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/notification-service-*.jar notification-service.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "notification-service.jar"] 