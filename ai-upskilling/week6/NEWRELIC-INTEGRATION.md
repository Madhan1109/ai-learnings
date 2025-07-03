# New Relic Integration for LMS Microservices

## 1. Sign Up and Download Agent
- Sign up at https://newrelic.com/
- Download the New Relic Java agent: https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip

## 2. Configure the Agent
- Extract the agent and copy the `newrelic/` folder (containing `newrelic.jar` and `newrelic.yml`) into each service's Docker build context.
- Set your New Relic license key in `newrelic.yml`:
  ```yaml
  license_key: 'YOUR_NEW_RELIC_LICENSE_KEY'
  ```

## 3. Update Dockerfile for Each Service
Add before ENTRYPOINT:
```dockerfile
COPY newrelic/ newrelic/
ENV NEW_RELIC_APP_NAME=user-service
ENTRYPOINT ["java", "-javaagent:/app/newrelic/newrelic.jar", "-jar", "user-service.jar"]
```
- Change `NEW_RELIC_APP_NAME` for each service (e.g., `course-service`, `enrollment-service`, etc.)

## 4. Rebuild and Deploy
- Rebuild your Docker images and redeploy.
- Metrics, traces, and JVM data will appear in your New Relic dashboard.

## 5. Reference
- [New Relic Java Agent Docs](https://docs.newrelic.com/docs/apm/agents/java-agent/installation/java-agent-installation-docker/) 