# 🚀 AI-Powered CRM System

## 📚 **Documentation Index**

This project includes comprehensive documentation organized in the `docs/` folder:

### 🏗️ **Architecture & Design**
- [📋 Architecture Diagram](docs/ARCHITECTURE_DIAGRAM.md) - Complete system architecture with visual diagrams
- [🏗️ Class Diagram](docs/CLASS_DIAGRAM.md) - Detailed class structures and relationships
- [📐 Architecture Design](docs/ARCHITECTURE_DESIGN.md) - System design and database schema
- [🧩 Component Architecture](docs/COMPONENT_ARCHITECTURE.md) - Frontend and backend component structure

### 📖 **User & Development Guides**
- [👥 User Guide](docs/USER_GUIDE.md) - Complete user manual and feature documentation
- [🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [🔧 Development Process](docs/DEVELOPMENT_PROCESS.md) - Development workflow and practices
- [📋 Development Plan](docs/DEVELOPMENT_PLAN.md) - Project planning and milestones

### 🔧 **Technical Documentation**
- [📡 API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [✅ API Endpoint Validation](docs/API_ENDPOINT_VALIDATION.md) - API testing and validation
- [🤖 AI Prompt Library](docs/AI_PROMPT_LIBRARY.md) - AI/ML implementation guides
- [🧪 Integration Testing Results](docs/INTEGRATION_TESTING_RESULTS.md) - Test coverage and results

### 📊 **Project Management**
- [📝 Reflection Report](docs/REFLECTION_REPORT.md) - Project assessment and learnings
- [🎬 Demo Video Script](docs/DEMO_VIDEO_SCRIPT.md) - System demonstration guide
- [⚡ Startup Script Optimization](docs/STARTUP_SCRIPT_OPTIMIZATION.md) - Performance optimization
- [🐛 Runtime Issues](docs/RUNTIME_ISSUES.md) - Known issues and solutions
- [✅ Runtime Issues Solved](docs/RUNTIME_ISSUES_SOLVED.md) - Resolved issues documentation

---

## 🎯 **Project Overview**

A production-ready Customer Relationship Management (CRM) system built with microservices architecture, featuring AI-powered insights, real-time collaboration, and advanced analytics.

## 🏗️ **Architecture**

### Microservices Architecture
- **Customer Service**: Customer management and profiles
- **Sales Service**: Sales pipeline and opportunity management
- **Communication Service**: Email, notifications, and messaging
- **Analytics Service**: AI-powered insights and reporting
- **Auth Service**: Authentication and authorization
- **Notification Service**: Real-time notifications and alerts

### Technology Stack
- **Backend**: Java Spring Boot (Microservices)
- **Frontend**: React with TypeScript
- **Database**: PostgreSQL
- **Message Broker**: Apache Kafka
- **Cache**: Redis
- **AI/ML**: TensorFlow.js for client-side predictions
- **Real-time**: WebSocket with Socket.io
- **Containerization**: Docker & Docker Compose

## 🎯 **Unique Standout Features**

### AI-Powered Features
- **Smart Lead Scoring**: AI predicts conversion probability
- **Sentiment Analysis**: Analyze customer communications
- **Predictive Analytics**: Forecast sales trends and customer behavior
- **Intelligent Recommendations**: Suggest next best actions
- **Auto-categorization**: Automatically categorize leads and opportunities

### Advanced Real-time Features
- **Live Collaboration**: Real-time editing and commenting
- **Instant Notifications**: Push notifications for important events
- **Live Dashboard**: Real-time metrics and KPIs
- **Multi-user Editing**: Concurrent editing with conflict resolution

### Modern UI/UX
- **Dark/Light Mode**: Professional appearance with theme switching
- **Custom Animations**: Smooth transitions and micro-interactions
- **Drag & Drop**: Intuitive pipeline management
- **Progressive Web App**: Works offline, installable
- **Voice Commands**: Speech-to-text for hands-free operation

### Advanced Analytics
- **Interactive Charts**: D3.js with drill-down capabilities
- **Predictive Charts**: Future trend projections
- **Custom Dashboards**: User-configurable widgets
- **Export Capabilities**: PDF, Excel, CSV with custom formatting

## 🚀 **Quick Start**

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crm-system
```

2. **Start the infrastructure**
```bash
docker-compose up -d
```

3. **Start backend services**
```bash
./start-backend.sh
```

4. **Start frontend**
```bash
cd frontend
npm install
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Admin Panel: http://localhost:3000/admin

## 🎯 **Automated Startup Scripts**

### **Option 1: Docker Compose (Recommended)**
```bash
# Start all services with Docker Compose (includes Maven build)
./start-backend.sh
```

### **Option 2: Individual Services (Development)**
```bash
# Start services individually for development (includes Maven build)
./start-backend-individual.sh
```

### **Health Check**
```bash
# Check health of all services
./health-check.sh
```

### **Stop Services**
```bash
# Stop all services
./stop-backend.sh
```

### **Script Organization**
All scripts are organized in the `start-up-scripts/` folder:
- `start-up-scripts/start-backend.sh` - Main Docker Compose startup
- `start-up-scripts/start-backend-individual.sh` - Individual service startup
- `start-up-scripts/stop-backend.sh` - Service shutdown
- `start-up-scripts/health-check.sh` - Health monitoring
- `start-up-scripts/deploy.sh` - Deployment script

## 📊 **Features**

### Core CRM Features
- ✅ Customer Management
- ✅ Sales Pipeline Management
- ✅ Contact History Tracking
- ✅ Task Management
- ✅ Email Integration
- ✅ Document Management

### AI-Powered Features
- ✅ Smart Lead Scoring
- ✅ Sentiment Analysis
- ✅ Predictive Analytics
- ✅ Intelligent Recommendations
- ✅ Auto-categorization

### Advanced Features
- ✅ Real-time Collaboration
- ✅ Advanced Analytics Dashboard
- ✅ Mobile Responsive Design
- ✅ Multi-language Support
- ✅ Role-based Access Control

## 🔧 **Development**

### Backend Services
```bash
# Customer Service
cd backend/customer-service
./mvnw spring-boot:run

# Sales Service
cd backend/sales-service
./mvnw spring-boot:run

# Analytics Service
cd backend/analytics-service
./mvnw spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## 🤝 **Contributing**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Assessment Features**

This project demonstrates:
- ✅ Microservices Architecture
- ✅ AI/ML Integration
- ✅ Real-time Features
- ✅ Advanced UI/UX
- ✅ Production-ready Code
- ✅ Comprehensive Testing
- ✅ Security Best Practices
- ✅ Performance Optimization

## 📞 **Support**

For technical support or questions about the project:
- Check the [📖 User Guide](docs/USER_GUIDE.md) for common issues
- Review [🐛 Runtime Issues](docs/RUNTIME_ISSUES.md) for known problems
- Consult [✅ Runtime Issues Solved](docs/RUNTIME_ISSUES_SOLVED.md) for solutions
- Refer to [📡 API Documentation](docs/API_DOCUMENTATION.md) for integration help

---

**📚 For detailed documentation, please refer to the individual files in the `docs/` folder.**