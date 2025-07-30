#!/bin/bash

echo "========================================"
echo "   CRM System Health Check"
echo "========================================"
echo

# Check if start-up-scripts directory exists
if [ ! -d "start-up-scripts" ]; then
    echo "ERROR: start-up-scripts directory not found!"
    exit 1
fi

# Make scripts executable
chmod +x start-up-scripts/*.sh

# Run the health check script
echo "Running health check script..."
./start-up-scripts/health-check.sh 