#!/bin/bash
set -e

RG="speechtest-rg"
LOCATION="eastus"

# Create resource group
az group create --name "$RG" --location "$LOCATION"

# Deploy Bicep template
az deployment group create \
  --resource-group "$RG" \
  --template-file speech-service.bicep \
  --parameters @parameters.json 