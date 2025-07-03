# Start from a lightweight OpenJDK 21 image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/enrollment-service-*.jar enrollment-service.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "enrollment-service.jar"] 