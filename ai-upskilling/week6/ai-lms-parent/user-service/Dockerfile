# Start from a lightweight OpenJDK 21 image
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built jar into the container
COPY target/user-service-*.jar user-service.jar

# Expose the service port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "user-service.jar"] 