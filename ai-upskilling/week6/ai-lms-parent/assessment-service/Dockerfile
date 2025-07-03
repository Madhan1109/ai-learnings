# Start from a lightweight OpenJDK 21 image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/assessment-service-*.jar assessment-service.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "assessment-service.jar"] 