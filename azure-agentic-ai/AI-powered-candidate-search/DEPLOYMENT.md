# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API keys secured (use secrets management)
- [ ] Database configured (if using)
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Security review completed
- [ ] Load testing performed
- [ ] Backup strategy in place

## Deployment Options

### Option 1: Docker Deployment

**Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "run_api.py"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - ./uploads:/app/uploads
      - ./results:/app/results
      - ./logs:/app/logs

  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    ports:
      - "4000:4000"
    volumes:
      - ./litellm_config.yaml:/app/litellm_config.yaml
    command: litellm --config /app/litellm_config.yaml
```

### Option 2: Cloud Deployment

#### Azure App Service

1. Create App Service
2. Configure environment variables
3. Deploy via GitHub Actions or Azure DevOps
4. Set up Application Insights for monitoring

#### AWS Elastic Beanstalk

1. Create Elastic Beanstalk application
2. Configure environment
3. Deploy application
4. Set up CloudWatch for logging

#### Google Cloud Run

1. Build container image
2. Deploy to Cloud Run
3. Configure environment variables
4. Set up Cloud Logging

## Environment Configuration

### Production Environment Variables

```env
# LLM
OPENAI_API_KEY=prod_key_here
AZURE_OPENAI_API_KEY=prod_key_here
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/

# LitELLM
LITELLM_HOST=https://litellm.yourdomain.com
LITELLM_MODEL=gpt-4-turbo-preview

# GitHub
GITHUB_TOKEN=prod_token_here

# Security
SECRET_KEY=strong_random_secret_key_here
ALLOWED_ORIGINS=https://yourdomain.com

# Database (if using)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379/0

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
```

## Database Setup

### PostgreSQL (Recommended)

```sql
CREATE DATABASE candidate_search;
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    status VARCHAR(50),
    file_path TEXT,
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_jobs_status ON jobs(status);
```

### Redis (For Caching)

```bash
# Install Redis
# Configure in application
REDIS_URL=redis://localhost:6379/0
```

## Security Hardening

### 1. API Authentication

Add JWT authentication:

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/api/v1/search/upload")
async def upload_job_description(
    file: UploadFile,
    token: str = Depends(security)
):
    # Verify token
    # Process request
```

### 2. Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/search/upload")
@limiter.limit("10/minute")
async def upload_job_description(...):
    # Process request
```

### 3. Input Validation

```python
from pydantic import validator

class SearchRequest(BaseModel):
    job_description_path: str
    
    @validator('job_description_path')
    def validate_path(cls, v):
        if not v.endswith('.docx'):
            raise ValueError('Only .docx files allowed')
        return v
```

## Monitoring & Logging

### Application Insights (Azure)

```python
from opencensus.ext.azure import metrics_exporter
from opencensus.ext.azure.log_exporter import AzureLogHandler

logger.addHandler(AzureLogHandler(
    connection_string='your_connection_string'
))
```

### CloudWatch (AWS)

```python
import watchtower

logger.add(watchtower.CloudWatchLogHandler(
    log_group='candidate-search',
    stream_name='api'
))
```

### Prometheus Metrics

```python
from prometheus_client import Counter, Histogram

search_requests = Counter('search_requests_total', 'Total search requests')
search_duration = Histogram('search_duration_seconds', 'Search duration')
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Nginx or AWS ALB
2. **Multiple Instances**: Deploy multiple API instances
3. **Session Management**: Use Redis for shared state
4. **Database Connection Pooling**: Configure connection pool

### Vertical Scaling

1. **Resource Allocation**: Increase CPU/memory
2. **Caching**: Implement Redis caching
3. **Database Optimization**: Index optimization
4. **Async Processing**: Use Celery for background jobs

## Backup Strategy

### Database Backups

```bash
# Daily backups
pg_dump candidate_search > backup_$(date +%Y%m%d).sql
```

### File Backups

```bash
# Backup uploads and results
tar -czf backups/uploads_$(date +%Y%m%d).tar.gz uploads/
tar -czf backups/results_$(date +%Y%m%d).tar.gz results/
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Deployment commands
```

## Health Checks

### Application Health

```python
@app.get("/health")
async def health_check():
    checks = {
        "api": "healthy",
        "database": check_database(),
        "litellm": check_litellm(),
        "github_api": check_github_api()
    }
    return checks
```

### Kubernetes Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Performance Optimization

1. **Caching**: Cache parsed job descriptions
2. **Async Processing**: Use background jobs for long-running tasks
3. **Database Indexing**: Index frequently queried fields
4. **CDN**: Use CDN for static assets
5. **Connection Pooling**: Reuse database connections

## Disaster Recovery

1. **Backup Frequency**: Daily backups
2. **Recovery Time Objective (RTO)**: < 1 hour
3. **Recovery Point Objective (RPO)**: < 24 hours
4. **Failover Strategy**: Multi-region deployment

## Cost Optimization

1. **Resource Right-sizing**: Match resources to load
2. **Caching**: Reduce API calls
3. **Reserved Instances**: For predictable workloads
4. **Auto-scaling**: Scale down during low usage

## Compliance

- **GDPR**: Data privacy compliance
- **SOC 2**: Security compliance
- **HIPAA**: If handling healthcare data
- **Audit Logging**: Track all operations

---

**For production support, ensure all security, monitoring, and backup measures are in place.**

