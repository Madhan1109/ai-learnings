# Azure Speech Service Bicep Sample

This sample demonstrates how to deploy a minimal Azure Speech Service using Bicep and the Azure CLI.

## Folder Contents
- `speech-service.bicep` — Bicep template for Speech Service
- `parameters.json` — Parameters file
- `deploy.sh` — Bash script for deployment
- `cleanup.sh` — Bash script to delete the resource group

## Prerequisites
- Azure CLI installed and logged in
- Sufficient permissions to create resources

## Deployment Steps

1. **Edit parameters if needed**
   - By default, the resource group will be `speechtest-rg` in `East US`.

2. **Deploy using CLI**
   ```bash
   ./deploy.sh
   ```
   Or manually:
   ```bash
   az group create --name speechtest-rg --location eastus
   az deployment group create \
     --resource-group speechtest-rg \
     --template-file speech-service.bicep \
     --parameters @parameters.json
   ```

3. **Check the Azure Portal**
   - Go to the resource group `speechtest-rg` to see your Speech Service.

## Cleanup
To delete all resources:
```bash
./cleanup.sh
```
Or manually:
```bash
az group delete --name speechtest-rg --yes --no-wait
```

## Parameters
- `speechServiceName`: Name for the Speech Service (must be 3-24 chars, lowercase, no dashes)
- `location`: Azure region
- `sku`: Pricing tier (default: S0)

---
This sample is for quick validation and learning. For production, add Key Vault, RBAC, and network controls as needed. 