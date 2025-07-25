# Step 1: Deploy GPT-4o-mini as Standard Deployment

## Overview
This guide walks you through deploying GPT-4o-mini as a Standard deployment in Azure AI Studio using the Azure Portal interface.

## Prerequisites
- Azure subscription with access to Azure AI Studio
- "Foundry-RG" resource group access
- Sufficient quota for model deployments

---

## Step-by-Step Deployment Process

### 1. Access Azure AI Studio

1. **Open Azure Portal**:
   - Navigate to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure credentials

2. **Launch Azure AI Studio**:
   - In the search bar, type "Azure AI Studio"
   - Click on "Azure AI Studio" service
   - Click "Launch Azure AI Studio" or go to [ai.azure.com](https://ai.azure.com)

3. **Select Your Project**:
   - Choose your "Foundry-RG" project
   - Ensure you have the necessary permissions

### 2. Navigate to Model Catalog

1. **Access Models Section**:
   - In Azure AI Studio, click on "Models" in the left sidebar
   - Click "Model Catalog"

2. **Search for GPT-4o-mini**:
   - In the search bar, type "gpt-4o-mini"
   - Look for the model in the results
   - Click on the "gpt-4o-mini" model card

### 3. Review Model Details

1. **Model Information**:
   ```
   Model Name: gpt-4o-mini
   Model Type: Text Generation
   Capabilities: Chat completions, text generation, code generation
   Max Tokens: 4096
   Cost: $0.00015 per 1K tokens (input), $0.0006 per 1K tokens (output)
   ```

2. **Verify Availability**:
   - Check that the model is available in your region
   - Ensure you have quota access
   - Note any deployment requirements

### 4. Deploy the Model

1. **Initiate Deployment**:
   - Click the "Deploy" button on the model page
   - Select "Standard" deployment type

2. **Configure Deployment Settings**:
   ```
   Deployment Name: gpt-4o-mini-standard
   Model: gpt-4o-mini
   Deployment Type: Standard
   Resource Group: Foundry-RG
   Region: East US (or your preferred region)
   ```

3. **Advanced Configuration**:
   - **Scaling Settings**:
     - Min instances: 0
     - Max instances: 10
     - Target concurrent requests: 100
   
   - **Network Settings**:
     - Public access: Enabled
     - VNet integration: Disabled (for this deployment)
   
   - **Security Settings**:
     - Authentication: API Key
     - Managed identity: Disabled (can be enabled later)

### 5. Deploy Using Azure CLI (Alternative Method)

If you prefer command-line deployment:

```powershell
# Install Azure CLI if not already installed
# az --version

# Login to Azure
az login

# Set your subscription
az account set --subscription "your-subscription-id"

# Deploy GPT-4o-mini
az ai model deploy \
  --name "gpt-4o-mini-standard" \
  --model "gpt-4o-mini" \
  --resource-group "Foundry-RG" \
  --workspace "your-workspace-name" \
  --deployment-type "Standard" \
  --sku "Standard" \
  --min-instances 0 \
  --max-instances 10
```

### 6. Monitor Deployment Progress

1. **Deployment Status**:
   - Monitor the deployment progress in the Azure AI Studio
   - Status will show: "Creating" → "Deploying" → "Succeeded"
   - Typical deployment time: 5-10 minutes

2. **Check Deployment Details**:
   - Go to "Deployments" in the left sidebar
   - Look for "gpt-4o-mini-standard"
   - Verify status is "Active"

### 7. Verify Deployment Success

1. **Deployment Information**:
   ```
   Deployment Name: gpt-4o-mini-standard
   Status: Active
   Endpoint URL: https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard
   API Version: 2024-02-15-preview
   ```

2. **Test Basic Connectivity**:
   - Click on the deployment
   - Go to "Test" tab
   - Enter a simple prompt: "Hello, how are you?"
   - Click "Send"
   - Verify you get a response

### 8. Configuration Summary

```json
{
  "deployment": {
    "name": "gpt-4o-mini-standard",
    "model": "gpt-4o-mini",
    "type": "Standard",
    "status": "Active",
    "endpoint": "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard",
    "api_version": "2024-02-15-preview"
  },
  "scaling": {
    "min_instances": 0,
    "max_instances": 10,
    "target_concurrent_requests": 100
  },
  "network": {
    "public_access": true,
    "vnet_integration": false
  },
  "capabilities": [
    "text-generation",
    "chat-completions",
    "code-generation"
  ]
}
```

---

## Troubleshooting

### Common Issues and Solutions

1. **Deployment Fails with Quota Error**:
   ```
   Error: Quota exceeded for model gpt-4o-mini
   Solution: Request quota increase or use different region
   ```

2. **Deployment Stuck in "Creating" State**:
   ```
   Issue: Deployment not progressing
   Solution: Wait 10-15 minutes, check resource availability
   ```

3. **Permission Denied**:
   ```
   Error: Insufficient permissions to deploy model
   Solution: Contact admin for proper role assignments
   ```

4. **Resource Group Not Found**:
   ```
   Error: Resource group "Foundry-RG" not found
   Solution: Verify resource group exists and you have access
   ```

### Verification Checklist

- [ ] Model found in Model Catalog
- [ ] Deployment initiated successfully
- [ ] Deployment status shows "Active"
- [ ] Endpoint URL is generated
- [ ] Basic test request works
- [ ] Scaling configuration applied
- [ ] Network access configured

---

## Next Steps

After successful deployment:

1. **Generate API Key**: Proceed to Step 2 for API key generation
2. **Test Endpoint**: Use the test interface to verify functionality
3. **Monitor Performance**: Check deployment metrics
4. **Document Configuration**: Record endpoint details for future reference

---

## Cost Considerations

- **Standard Deployment**: Pay-per-use pricing
- **Idle Time**: No cost when not in use (min instances = 0)
- **Token Usage**: $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- **Compute**: Additional compute costs may apply based on usage

---

*This deployment provides a cost-effective solution for text generation tasks with automatic scaling capabilities.* 