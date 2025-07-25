# Azure Cognitive Services Deployment

This project deploys Azure Cognitive Services including Speech, Vision, and Document Intelligence services with integrated Key Vault for secure credential management.

## Services Deployed

- **Speech Services**: Text-to-speech, speech-to-text, and speech translation
- **Computer Vision**: Image analysis, OCR, and visual features
- **Document Intelligence**: Form recognition and document processing
- **Key Vault**: Secure storage for all service endpoints and keys
- **Storage Account**: Required for Document Intelligence operations

## Prerequisites

1. **Azure CLI** installed and configured
2. **Azure Subscription** with appropriate permissions
3. **PowerShell** (for Windows deployment script)

## Quick Deployment

### Option 1: Using PowerShell Script (Recommended)

```powershell
# Navigate to the project directory
cd "C:\ai-learnings\ai-learnings\azure-agentic-ai\week2\task3"

# Run the deployment script
.\deploy.ps1 -ResourceGroupName "rg-cognitive-services-dev"
```

### Option 2: Using Azure CLI Directly

```bash
# Create resource group
az group create --name "rg-cognitive-services-dev" --location "East US"

# Deploy the Bicep template
az deployment group create \
    --resource-group "rg-cognitive-services-dev" \
    --template-file "cognitive-services.bicep" \
    --parameters resourceGroupName="rg-cognitive-services-dev" \
                  location="East US" \
                  environment="dev" \
                  projectName="cognitive-services"
```

## Deployment Parameters

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `resourceGroupName` | Name of the resource group | Required |
| `location` | Azure region for deployment | East US |
| `environment` | Environment tag (dev/staging/prod) | dev |
| `projectName` | Project name for resource naming | cognitive-services |
| `keyVaultSku` | Key Vault SKU | standard |
| `cognitiveServicesSku` | Cognitive Services SKU | S0 |

## Resource Naming Convention

Resources are named using the pattern: `{projectName}{environment}{service}` (all lowercase, no dashes, max 24 chars)

Examples (with `projectName = cogsvc` and `environment = dev`):
- Key Vault: `cogsvcdevkv`
- Speech Service: `cogsvcdevspeech`
- Vision Service: `cogsvcdevvision`
- Document Intelligence: `cogsvcdevdocintel`
- Storage Account: `cogsvcdevstor`

> **Note:** Azure requires resource names to be globally unique, lowercase, no dashes or special characters, and 3-24 characters long for most services.

## Verification Steps

### 1. Verify in Azure Portal

1. **Resource Group**: Navigate to your resource group in Azure Portal
2. **Cognitive Services**: Verify all three services are deployed and running
3. **Key Vault**: Check that secrets are properly stored
4. **Storage Account**: Confirm storage account is created

### 2. Check Key Vault Secrets

Navigate to your Key Vault in Azure Portal and verify these secrets are stored:

**Speech Service:**
- `speech-endpoint`
- `speech-key1`
- `speech-key2`

**Vision Service:**
- `vision-endpoint`
- `vision-key1`
- `vision-key2`

**Document Intelligence:**
- `document-intelligence-endpoint`
- `document-intelligence-key1`
- `document-intelligence-key2`

### 3. Test Service Endpoints

#### Speech Service Test
```bash
# Get the endpoint and key from Key Vault
SPEECH_ENDPOINT=$(az keyvault secret show --vault-name "cognitive-services-dev-kv" --name "speech-endpoint" --query value -o tsv)
SPEECH_KEY=$(az keyvault secret show --vault-name "cognitive-services-dev-kv" --name "speech-key1" --query value -o tsv)

# Test the endpoint
curl -H "Ocp-Apim-Subscription-Key: $SPEECH_KEY" \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello, this is a test"}' \
     "$SPEECH_ENDPOINT/tts/v1/synthesize"
```

#### Vision Service Test
```bash
# Get the endpoint and key from Key Vault
VISION_ENDPOINT=$(az keyvault secret show --vault-name "cognitive-services-dev-kv" --name "vision-endpoint" --query value -o tsv)
VISION_KEY=$(az keyvault secret show --vault-name "cognitive-services-dev-kv" --name "vision-key1" --query value -o tsv)

# Test the endpoint
curl -H "Ocp-Apim-Subscription-Key: $VISION_KEY" \
     -H "Content-Type: application/json" \
     -d '{"url":"https://example.com/image.jpg"}' \
     "$VISION_ENDPOINT/vision/v3.2/analyze?visualFeatures=Description"
```

## Service Endpoints

After deployment, you can access the services using these endpoints:

- **Speech Service**: `https://{speech-service-name}.cognitiveservices.azure.com/`
- **Vision Service**: `https://{vision-service-name}.cognitiveservices.azure.com/`
- **Document Intelligence**: `https://{document-intelligence-name}.cognitiveservices.azure.com/`

## Security Considerations

1. **Key Vault Access**: Ensure proper RBAC permissions are set up
2. **Network Security**: Consider restricting network access for production
3. **Key Rotation**: Implement regular key rotation practices
4. **Monitoring**: Set up Azure Monitor for service health

## Cost Optimization

- Use appropriate SKUs for your workload
- Monitor usage with Azure Cost Management
- Consider reserved capacity for production workloads
- Use consumption-based pricing for development/testing

## Troubleshooting

### Common Issues

1. **Deployment Fails**: Check Azure CLI login and subscription access
2. **Resource Name Conflicts**: Ensure unique names across your subscription
3. **Key Vault Access**: Verify you have Key Vault permissions
4. **Service Quotas**: Check if you've reached service limits

### Useful Commands

```bash
# Check deployment status
az deployment group show --resource-group "rg-cognitive-services-dev" --name "deployment-name"

# List all resources in the group
az resource list --resource-group "rg-cognitive-services-dev"

# Get service keys
az cognitiveservices account keys list --name "service-name" --resource-group "rg-cognitive-services-dev"
```

## Next Steps

1. **Integration**: Connect your applications to the deployed services
2. **Monitoring**: Set up Azure Monitor and Application Insights
3. **Scaling**: Adjust SKUs based on usage patterns
4. **Security**: Implement additional security measures for production

## Support

For issues related to:
- **Azure Cognitive Services**: [Microsoft Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/)
- **Bicep Templates**: [Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- **Key Vault**: [Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/) 