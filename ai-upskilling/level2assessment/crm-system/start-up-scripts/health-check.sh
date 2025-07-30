#!/bin/bash

echo "========================================"
echo "   CRM System Health Check Script"
echo "========================================"
echo

echo "Checking service health..."
echo

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "WARNING: curl is not installed. Using wget instead..."
    echo
    goto_powershell_checks=true
else
    goto_powershell_checks=false
fi

if [ "$goto_powershell_checks" = false ]; then
    echo "[1/7] Checking API Gateway Health..."
    if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
        echo "✓ API Gateway is healthy"
    else
        echo "❌ API Gateway is not responding"
    fi

    echo
    echo "[2/7] Checking Customer Service Health..."
    if curl -s http://localhost:8081/api/customers/actuator/health >/dev/null 2>&1; then
        echo "✓ Customer Service is healthy"
    else
        echo "❌ Customer Service is not responding"
    fi

    echo
    echo "[3/7] Checking Sales Service Health..."
    if curl -s http://localhost:8082/api/sales/actuator/health >/dev/null 2>&1; then
        echo "✓ Sales Service is healthy"
    else
        echo "❌ Sales Service is not responding"
    fi

    echo
    echo "[4/7] Checking Auth Service Health..."
    if curl -s http://localhost:8083/api/auth/actuator/health >/dev/null 2>&1; then
        echo "✓ Auth Service is healthy"
    else
        echo "❌ Auth Service is not responding"
    fi

    echo
    echo "[5/7] Checking Analytics Service Health..."
    if curl -s http://localhost:8084/api/analytics/actuator/health >/dev/null 2>&1; then
        echo "✓ Analytics Service is healthy"
    else
        echo "❌ Analytics Service is not responding"
    fi

    echo
    echo "[6/7] Checking Notification Service Health..."
    if curl -s http://localhost:8085/api/notifications/actuator/health >/dev/null 2>&1; then
        echo "✓ Notification Service is healthy"
    else
        echo "❌ Notification Service is not responding"
    fi

    echo
    echo "[7/7] Checking Eureka Dashboard..."
    if curl -s http://localhost:8761 >/dev/null 2>&1; then
        echo "✓ Eureka Dashboard is accessible"
    else
        echo "❌ Eureka Dashboard is not responding"
    fi
else
    echo "Using wget for health checks..."
    echo

    echo "[1/7] Checking API Gateway Health..."
    if wget -q --spider http://localhost:8080/actuator/health 2>/dev/null; then
        echo "✓ API Gateway is healthy"
    else
        echo "❌ API Gateway is not responding"
    fi

    echo
    echo "[2/7] Checking Customer Service Health..."
    if wget -q --spider http://localhost:8081/api/customers/actuator/health 2>/dev/null; then
        echo "✓ Customer Service is healthy"
    else
        echo "❌ Customer Service is not responding"
    fi

    echo
    echo "[3/7] Checking Sales Service Health..."
    if wget -q --spider http://localhost:8082/api/sales/actuator/health 2>/dev/null; then
        echo "✓ Sales Service is healthy"
    else
        echo "❌ Sales Service is not responding"
    fi

    echo
    echo "[4/7] Checking Auth Service Health..."
    if wget -q --spider http://localhost:8083/api/auth/actuator/health 2>/dev/null; then
        echo "✓ Auth Service is healthy"
    else
        echo "❌ Auth Service is not responding"
    fi

    echo
    echo "[5/7] Checking Analytics Service Health..."
    if wget -q --spider http://localhost:8084/api/analytics/actuator/health 2>/dev/null; then
        echo "✓ Analytics Service is healthy"
    else
        echo "❌ Analytics Service is not responding"
    fi

    echo
    echo "[6/7] Checking Notification Service Health..."
    if wget -q --spider http://localhost:8085/api/notifications/actuator/health 2>/dev/null; then
        echo "✓ Notification Service is healthy"
    else
        echo "❌ Notification Service is not responding"
    fi

    echo
    echo "[7/7] Checking Eureka Dashboard..."
    if wget -q --spider http://localhost:8761 2>/dev/null; then
        echo "✓ Eureka Dashboard is accessible"
    else
        echo "❌ Eureka Dashboard is not responding"
    fi
fi

echo
echo "========================================"
echo "   Service URLs"
echo "========================================"
echo "Eureka Dashboard:     http://localhost:8761"
echo "API Gateway:          http://localhost:8080"
echo "Customer Service:     http://localhost:8081"
echo "Sales Service:        http://localhost:8082"
echo "Auth Service:         http://localhost:8083"
echo "Analytics Service:    http://localhost:8084"
echo "Notification Service: http://localhost:8085"
echo
echo "========================================"
echo "   Health Check Complete!"
echo "========================================"
echo 