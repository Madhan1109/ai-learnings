#!/bin/bash

echo "========================================"
echo "   CRM System Individual Service Startup"
echo "========================================"
echo

# Check if start-up-scripts directory exists
if [ ! -d "start-up-scripts" ]; then
    echo "ERROR: start-up-scripts directory not found!"
    exit 1
fi

# Make scripts executable
chmod +x start-up-scripts/*.sh

# Run the individual startup script
echo "Running individual startup script..."
./start-up-scripts/start-backend-individual.sh 