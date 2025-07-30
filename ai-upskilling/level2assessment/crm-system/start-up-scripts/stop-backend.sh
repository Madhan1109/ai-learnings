#!/bin/bash

echo "========================================"
echo "   CRM System Backend Shutdown Script"
echo "========================================"
echo

echo "Stopping all backend services..."
docker-compose down

echo
echo "========================================"
echo "   Service Status"
echo "========================================"
docker-compose ps

echo
echo "========================================"
echo "   All Services Stopped Successfully!"
echo "========================================"
echo
echo "To start services again, run: ./start-up-scripts/start-backend.sh"
echo 