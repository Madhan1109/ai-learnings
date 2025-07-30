#!/bin/bash

# CRM System Deployment Script
# Usage: ./deploy.sh [environment] [action]

set -e

ENVIRONMENT=${1:-dev}
ACTION=${2:-deploy}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
case $ENVIRONMENT in
    "dev")
        DOCKER_COMPOSE_FILE="docker-compose.yml"
        API_URL="http://localhost:8080"
        FRONTEND_URL="http://localhost:3000"
        ;;
    "staging")
        DOCKER_COMPOSE_FILE="docker-compose.staging.yml"
        API_URL="https://staging-api.crm.com"
        FRONTEND_URL="https://staging.crm.com"
        ;;
    "production")
        DOCKER_COMPOSE_FILE="docker-compose.production.yml"
        API_URL="https://api.crm.com"
        FRONTEND_URL="https://crm.com"
        ;;
    *)
        echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
        echo "Usage: $0 [dev|staging|production] [deploy|stop|restart|logs]"
        exit 1
        ;;
esac

echo -e "${GREEN}Deploying CRM System to $ENVIRONMENT environment${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Docker Compose is not installed${NC}"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        echo -e "${RED}Docker is not running${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Prerequisites check passed${NC}"
}

# Function to build images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    
    # Build backend services
    echo "Building customer-service..."
    docker build -t crm-customer-service:latest ./backend/customer-service
    
    echo "Building sales-service..."
    docker build -t crm-sales-service:latest ./backend/sales-service
    
    echo "Building analytics-service..."
    docker build -t crm-analytics-service:latest ./backend/analytics-service
    
    echo "Building auth-service..."
    docker build -t crm-auth-service:latest ./backend/auth-service
    
    echo "Building notification-service..."
    docker build -t crm-notification-service:latest ./backend/notification-service
    
    echo "Building api-gateway..."
    docker build -t crm-api-gateway:latest ./backend/api-gateway
    
    # Build frontend
    echo "Building frontend..."
    docker build -t crm-frontend:latest ./frontend
    
    echo -e "${GREEN}All images built successfully${NC}"
}

# Function to deploy services
deploy_services() {
    echo -e "${YELLOW}Deploying services...${NC}"
    
    # Stop existing containers
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Start services
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    echo -e "${GREEN}Services deployed successfully${NC}"
}

# Function to check health
check_health() {
    echo -e "${YELLOW}Checking service health...${NC}"
    
    # Wait for services to start
    sleep 30
    
    # Check API Gateway
    if curl -f $API_URL/actuator/health &> /dev/null; then
        echo -e "${GREEN}API Gateway is healthy${NC}"
    else
        echo -e "${RED}API Gateway is not responding${NC}"
        return 1
    fi
    
    # Check Frontend
    if curl -f $FRONTEND_URL &> /dev/null; then
        echo -e "${GREEN}Frontend is healthy${NC}"
    else
        echo -e "${RED}Frontend is not responding${NC}"
        return 1
    fi
    
    echo -e "${GREEN}All services are healthy${NC}"
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}Running tests...${NC}"
    
    # Run backend tests
    cd backend/customer-service
    ./mvnw test
    cd ../..
    
    # Run frontend tests
    cd frontend
    npm test -- --coverage --watchAll=false
    cd ..
    
    echo -e "${GREEN}All tests passed${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}Showing logs...${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE down
    echo -e "${GREEN}Services stopped${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE restart
    echo -e "${GREEN}Services restarted${NC}"
}

# Main execution
case $ACTION in
    "deploy")
        check_prerequisites
        build_images
        deploy_services
        check_health
        echo -e "${GREEN}Deployment completed successfully!${NC}"
        echo -e "${GREEN}Frontend: $FRONTEND_URL${NC}"
        echo -e "${GREEN}API Gateway: $API_URL${NC}"
        ;;
    "test")
        check_prerequisites
        run_tests
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    *)
        echo -e "${RED}Invalid action: $ACTION${NC}"
        echo "Usage: $0 [dev|staging|production] [deploy|test|stop|restart|logs]"
        exit 1
        ;;
esac 