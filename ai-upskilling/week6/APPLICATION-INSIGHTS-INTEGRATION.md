# Application Insights Integration for LMS Microservices

## 1. Set Up Application Insights
- Go to [Azure Portal](https://portal.azure.com/)
- Create an Application Insights resource
- Copy the **Instrumentation Key** or **Connection String**

## 2. Download the Java Agent
- Download the latest agent from:
  https://github.com/microsoft/ApplicationInsights-Java/releases
- Place `applicationinsights-agent-<version>.jar` in each service's Docker build context

## 3. Update Dockerfile for Each Service
Add before ENTRYPOINT:
```dockerfile
COPY applicationinsights-agent.jar applicationinsights-agent.jar
ENV APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=YOUR_KEY
ENTRYPOINT ["java", "-javaagent:/app/applicationinsights-agent.jar", "-jar", "user-service.jar"]
```
- Change the JAR and environment variable as needed for each service
- Change the JAR name if you use a different version

## 4. Rebuild and Deploy
- Rebuild your Docker images and redeploy
- Data will appear in your Application Insights resource in Azure

## 5. Reference
- [Application Insights Java Agent Docs](https://learn.microsoft.com/en-us/azure/azure-monitor/app/java-in-process-agent) 