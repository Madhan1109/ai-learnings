# Deployment Guide

## 🚀 **Deployment Options**

### **Option 1: Local Development (Recommended for Testing)**

#### **Prerequisites**
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

#### **Step-by-Step Local Deployment**

1. **Clone and Setup**
```bash
git clone <repository-url>
cd crm-system
```

2. **Start Infrastructure Services**
```bash
# Start PostgreSQL, Redis, Kafka
docker-compose up -d postgres redis zookeeper kafka
```

3. **Start Backend Services**
```bash
# Start all microservices
docker-compose up -d api-gateway eureka customer-service sales-service analytics-service auth-service notification-service
```

4. **Start Frontend**
```bash
cd frontend
npm install
npm start
```

5. **Access Application**
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Swagger Documentation**: http://localhost:8080/swagger-ui.html

### **Option 2: Docker Compose (Full Stack)**

#### **Complete Deployment**
```bash
# Deploy entire stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### **Service URLs**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **Kafka**: localhost:9092

### **Option 3: Cloud Deployment**

#### **AWS Deployment**

1. **EC2 Setup**
```bash
# Launch EC2 instance (t3.medium recommended)
# Install Docker and Docker Compose
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Deploy Application**
```bash
# Clone repository
git clone <repository-url>
cd crm-system

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

3. **Configure Domain**
- Point domain to EC2 public IP
- Configure SSL with Let's Encrypt
- Set up CloudWatch monitoring

#### **Vercel Frontend Deployment**

1. **Connect Repository**
- Connect GitHub repository to Vercel
- Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Install Command: `npm install`

2. **Environment Variables**
```
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

3. **Deploy**
- Push to main branch triggers automatic deployment
- Preview deployments for pull requests

#### **Netlify Frontend Deployment**

1. **Connect Repository**
- Connect GitHub repository to Netlify
- Configure build settings:
  - Build Command: `npm run build`
  - Publish Directory: `build`

2. **Environment Variables**
```
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

3. **Deploy**
- Automatic deployment on push to main branch
- Preview deployments for pull requests

### **Option 4: Kubernetes Deployment**

#### **Kubernetes Manifests**

1. **Create Namespace**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: crm-system
```

2. **Deploy PostgreSQL**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: crm-system
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        env:
        - name: POSTGRES_DB
          value: "crm_system"
        - name: POSTGRES_USER
          value: "crm_user"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

3. **Deploy Backend Services**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: customer-service
  namespace: crm-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: customer-service
  template:
    metadata:
      labels:
        app: customer-service
    spec:
      containers:
      - name: customer-service
        image: crm-customer-service:latest
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "kubernetes"
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres:5432/crm_system"
```

4. **Deploy Frontend**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crm-frontend
  namespace: crm-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: crm-frontend
  template:
    metadata:
      labels:
        app: crm-frontend
    spec:
      containers:
      - name: crm-frontend
        image: crm-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "https://api.yourdomain.com"
```

## 📊 **Monitoring & Logging**

### **Application Monitoring**

#### **Health Checks**
```bash
# Check service health
curl http://localhost:8080/actuator/health

# Check individual services
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
```

#### **Metrics Collection**
```bash
# Prometheus metrics
curl http://localhost:8080/actuator/prometheus

# Application metrics
curl http://localhost:8080/actuator/metrics
```

### **Logging Setup**

#### **ELK Stack Integration**
```yaml
# Logstash configuration
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "crm-system" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "crm-system-%{+YYYY.MM.dd}"
  }
}
```

## 🔧 **Environment Configuration**

### **Development Environment**
```bash
# .env.development
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### **Production Environment**
```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## 🛡️ **Security Configuration**

### **SSL/TLS Setup**
```bash
# Generate SSL certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt

# Configure nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Firewall Configuration**
```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Frontend
sudo ufw allow 8080  # Backend API
sudo ufw enable
```

## 📈 **Performance Optimization**

### **Frontend Optimization**
```bash
# Build optimization
npm run build

# Bundle analysis
npm install -g webpack-bundle-analyzer
npm run build -- --analyze
```

### **Backend Optimization**
```yaml
# JVM optimization
JAVA_OPTS: "-Xms512m -Xmx1024m -XX:+UseG1GC"
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to AWS
      run: |
        # Deploy backend services
        docker-compose -f docker-compose.prod.yml up -d
        
        # Deploy frontend to Vercel
        npm run build
        # Vercel deployment commands
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Frontend Not Loading**
```bash
# Check if frontend is running
curl http://localhost:3000

# Check for build errors
npm run build

# Clear cache
npm run build -- --reset-cache
```

#### **Backend Services Not Responding**
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs customer-service

# Restart services
docker-compose restart
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Test database connection
psql -h localhost -U crm_user -d crm_system
```

## 📋 **Deployment Checklist**

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Environment variables configured

### **Deployment**
- [ ] Infrastructure services started
- [ ] Backend services deployed
- [ ] Frontend deployed
- [ ] SSL certificates configured
- [ ] Domain configured

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Logging working
- [ ] Performance metrics collected
- [ ] User acceptance testing completed

## 🎯 **Live Application URLs**

### **Development Environment**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Admin Panel**: http://localhost:3000/admin

### **Production Environment**
- **Frontend**: https://crm.yourdomain.com
- **Backend API**: https://api.yourdomain.com
- **Admin Panel**: https://crm.yourdomain.com/admin

### **Admin Credentials**
```
Email: admin@crm.com
Password: password123
Role: Administrator
```

This deployment guide provides comprehensive instructions for deploying the CRM system across different environments and platforms. 