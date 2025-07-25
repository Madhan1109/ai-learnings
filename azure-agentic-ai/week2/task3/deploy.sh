#!/bin/bash
set -e

# Default values
RESOURCE_GROUP_NAME=${RESOURCE_GROUP_NAME:-cogsvctestgrp}
LOCATION=${LOCATION:-eastus}
ENVIRONMENT=${ENVIRONMENT:-dev}
PROJECT_NAME=${PROJECT_NAME:-cogsvc}
KEYVAULT_SKU=${KEYVAULT_SKU:-standard}
COGNITIVE_SERVICES_SKU=${COGNITIVE_SERVICES_SKU:-S0}

# Create resource group
az group create --name "$RESOURCE_GROUP_NAME" --location "$LOCATION"

# Deploy the Bicep template
DEPLOYMENT_NAME="cognitive-services-deployment-$(date +%Y%m%d-%H%M%S)"
echo "Deploying Cognitive Services resources..."
az deployment group create \
  --resource-group "$RESOURCE_GROUP_NAME" \
  --template-file cognitive-services.bicep \
  --parameters location="$LOCATION" environment="$ENVIRONMENT" projectName="$PROJECT_NAME" keyVaultSku="$KEYVAULT_SKU" cognitiveServicesSku="$COGNITIVE_SERVICES_SKU" \
  --name "$DEPLOYMENT_NAME"

if [ $? -eq 0 ]; then
  echo "Deployment completed successfully!"
  echo
  echo "Deployment Outputs:"
  az deployment group show --resource-group "$RESOURCE_GROUP_NAME" --name "$DEPLOYMENT_NAME" --query properties.outputs
  echo
  echo "Next Steps:"
  echo "1. Open Azure Portal and navigate to the Key Vault"
  echo "2. Check the Secrets section for all service endpoints and keys"
  echo "3. Verify the Cognitive Services in the Azure Portal"
  echo "4. Test the services using the provided endpoints and keys"
else
  echo "Deployment failed. Please check the error messages above."
  exit 1
fi 