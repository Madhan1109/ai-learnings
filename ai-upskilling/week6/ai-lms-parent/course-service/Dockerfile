# Start from a lightweight OpenJDK 21 image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/course-service-*.jar course-service.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "course-service.jar"] 