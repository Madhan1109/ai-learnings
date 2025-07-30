#!/bin/bash

echo "========================================"
echo "   CRM System Backend Shutdown"
echo "========================================"
echo

# Check if start-up-scripts directory exists
if [ ! -d "start-up-scripts" ]; then
    echo "ERROR: start-up-scripts directory not found!"
    exit 1
fi

# Make scripts executable
chmod +x start-up-scripts/*.sh

# Run the stop script
echo "Running shutdown script..."
./start-up-scripts/stop-backend.sh 