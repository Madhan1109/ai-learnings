#!/bin/bash

echo "========================================"
echo "   CRM System Backend Startup"
echo "========================================"
echo

# Check if scripts directory exists
if [ ! -d "scripts" ]; then
    echo "ERROR: scripts directory not found!"
    exit 1
fi

# Make scripts executable
chmod +x scripts/*.sh

# Run the main startup script
echo "Running startup script..."
./scripts/start-backend.sh 