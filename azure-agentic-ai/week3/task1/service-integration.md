# Azure AI Studio Service Integration Guide

## Overview
This document outlines the process of connecting existing Azure Cognitive Services from Week 2 to Azure AI Studio, linking Key Vault, and creating projects using the "Foundry-RG" resource group.

## Prerequisites
- Azure subscription with access to Azure AI Studio
- Existing Cognitive Services resources from Week 2
- Azure Key Vault with appropriate permissions
- "Foundry-RG" resource group access

---

## Step 1: Navigate to Azure AI Studio

### Access Azure AI Studio
1. **Open Azure Portal**: Navigate to [portal.azure.com](https://portal.azure.com)
2. **Search for Azure AI Studio**: In the search bar, type "Azure AI Studio"
3. **Select Azure AI Studio**: Click on the Azure AI Studio service
4. **Access the Studio**: Click "Launch Azure AI Studio" or navigate to [ai.azure.com](https://ai.azure.com)

### Initial Setup
- Sign in with your Azure credentials
- Ensure you have the necessary permissions for your subscription
- Verify you can access the "Foundry-RG" resource group

---

## Step 2: Connect Existing Cognitive Services from Week 2

### Locate Your Week 2 Resources
1. **Resource Group**: Navigate to "Foundry-RG" resource group
2. **Identify Services**: Locate your existing Cognitive Services:
   - Azure OpenAI Service
   - Computer Vision
   - Language Understanding (LUIS)
   - Speech Services
   - Any other AI services deployed

### Connect Services to AI Studio
1. **In Azure AI Studio**:
   - Go to "Settings" → "Connections"
   - Click "Add connection"
   - Select the service type (OpenAI, Computer Vision, etc.)

2. **For Azure OpenAI Service**:
   ```json
   {
     "connection_name": "foundry-openai-connection",
     "service_type": "Azure OpenAI",
     "resource_name": "your-openai-resource-name",
     "endpoint": "https://your-resource.openai.azure.com/",
     "api_version": "2024-02-15-preview"
   }
   ```

3. **For Computer Vision**:
   ```json
   {
     "connection_name": "foundry-vision-connection",
     "service_type": "Computer Vision",
     "resource_name": "your-vision-resource-name",
     "endpoint": "https://your-resource.cognitiveservices.azure.com/",
     "api_version": "2024-02-01"
   }
   ```

4. **For Speech Services**:
   ```json
   {
     "connection_name": "foundry-speech-connection",
     "service_type": "Speech Services",
     "resource_name": "your-speech-resource-name",
     "endpoint": "https://your-resource.cognitiveservices.azure.com/",
     "api_version": "2024-01-01"
   }
   ```

### Verify Service Connections
1. **Test Each Connection**:
   - Click "Test connection" for each service
   - Verify successful authentication
   - Check endpoint accessibility

2. **Connection Status**:
   - ✅ Connected: Service is accessible
   - ⚠️ Warning: Check permissions or configuration
   - ❌ Failed: Review connection settings

---

## Step 3: Link Key Vault and Verify Service Connections

### Access Key Vault
1. **Navigate to Key Vault**:
   - Go to Azure Portal
   - Search for your Key Vault resource
   - Ensure it's in the "Foundry-RG" resource group

2. **Verify Key Vault Permissions**:
   ```powershell
   # Check Key Vault access policies
   az keyvault show --name "your-keyvault-name" --resource-group "Foundry-RG"
   ```

### Configure Key Vault Integration
1. **In Azure AI Studio**:
   - Go to "Settings" → "Security"
   - Click "Add Key Vault"
   - Enter your Key Vault details:
     ```
     Key Vault Name: your-keyvault-name
     Resource Group: Foundry-RG
     Subscription: your-subscription-id
     ```

2. **Set Up Managed Identity** (if not already configured):
   ```powershell
   # Enable managed identity for AI Studio
   az ai studio update --name "your-studio-name" --resource-group "Foundry-RG" --identity-type SystemAssigned
   
   # Grant Key Vault access to managed identity
   az keyvault set-policy --name "your-keyvault-name" --object-id "managed-identity-object-id" --secret-permissions get list
   ```

### Store Service Keys Securely
1. **Add Secrets to Key Vault**:
   ```powershell
   # Store OpenAI API key
   az keyvault secret set --vault-name "your-keyvault-name" --name "openai-api-key" --value "your-openai-key"
   
   # Store Computer Vision key
   az keyvault secret set --vault-name "your-keyvault-name" --name "vision-api-key" --value "your-vision-key"
   
   # Store Speech Services key
   az keyvault secret set --vault-name "your-keyvault-name" --name "speech-api-key" --value "your-speech-key"
   ```

2. **Update Service Connections**:
   - In Azure AI Studio, edit each connection
   - Change authentication method to "Key Vault"
   - Select the appropriate secret for each service

### Verify Key Vault Integration
1. **Test Secret Retrieval**:
   ```powershell
   # Test retrieving secrets
   az keyvault secret show --vault-name "your-keyvault-name" --name "openai-api-key"
   ```

2. **Monitor Access**:
   - Check Key Vault access logs
   - Verify managed identity permissions
   - Test service connections in AI Studio

---

## Step 4: Explore Model Catalog and Test Azure OpenAI Models

### Access Model Catalog
1. **Navigate to Model Catalog**:
   - In Azure AI Studio, go to "Models" → "Model Catalog"
   - Browse available models by category:
     - Text Generation (GPT models)
     - Image Generation (DALL-E)
     - Embeddings
     - Fine-tuned models

2. **Available Models in Catalog**:
   ```
   Text Generation:
   - gpt-4o
   - gpt-4o-mini
   - gpt-4-turbo
   - gpt-35-turbo
   
   Image Generation:
   - dall-e-3
   - dall-e-2
   
   Embeddings:
   - text-embedding-ada-002
   - text-embedding-3-small
   - text-embedding-3-large
   ```

### Test Model Access
1. **Create a Test Project**:
   - Click "Create project"
   - Name: "Model-Testing-Project"
   - Resource group: "Foundry-RG"
   - Select your connected OpenAI service

2. **Test Text Generation**:
   ```python
   # Test GPT-4o model
   from openai import AzureOpenAI
   
   client = AzureOpenAI(
       api_key="your-api-key",
       api_version="2024-02-15-preview",
       azure_endpoint="https://your-resource.openai.azure.com"
   )
   
   response = client.chat.completions.create(
       model="gpt-4o",
       messages=[
           {"role": "user", "content": "Hello, how are you?"}
       ]
   )
   
   print(response.choices[0].message.content)
   ```

3. **Test Image Generation**:
   ```python
   # Test DALL-E 3 model
   response = client.images.generate(
       model="dall-e-3",
       prompt="A beautiful sunset over mountains",
       n=1,
       size="1024x1024"
   )
   
   print(response.data[0].url)
   ```

### Verify Model Performance
1. **Latency Testing**:
   - Measure response times for different models
   - Test with various input sizes
   - Monitor token usage

2. **Quality Assessment**:
   - Test model outputs for accuracy
   - Verify image generation quality
   - Check embedding dimensions

---

## Step 5: Create Project Using "Foundry-RG" Resources

### Project Setup
1. **Create New Project**:
   - In Azure AI Studio, click "Create project"
   - Project details:
     ```
     Name: Foundry-AI-Project
     Description: AI project using Foundry-RG resources
     Resource Group: Foundry-RG
     Region: Same as your resources
     ```

2. **Configure Project Settings**:
   ```json
   {
     "project_name": "Foundry-AI-Project",
     "resource_group": "Foundry-RG",
     "region": "East US",
     "compute_target": "your-compute-cluster",
     "storage_account": "your-storage-account",
     "key_vault": "your-keyvault-name"
   }
   ```

### Link Existing Resources
1. **Connect Services**:
   - Select your existing service connections
   - Verify all connections are active
   - Test each service within the project

2. **Configure Compute**:
   ```powershell
   # Create compute cluster if needed
   az ml compute create --name "foundry-compute" --resource-group "Foundry-RG" --type amlcompute --min-instances 0 --max-instances 4
   ```

3. **Set Up Data Sources**:
   - Connect to existing storage accounts
   - Configure data lakes if available
   - Set up data versioning

### Project Structure
```
Foundry-AI-Project/
├── src/
│   ├── models/
│   ├── data/
│   ├── notebooks/
│   └── scripts/
├── config/
│   ├── connections.json
│   ├── compute.json
│   └── environment.json
├── experiments/
└── deployments/
```

---

## Step 6: Documentation and Verification

### Connection Summary
Create a summary of all connected services:

```json
{
  "project": "Foundry-AI-Project",
  "resource_group": "Foundry-RG",
  "connections": {
    "openai": {
      "status": "connected",
      "endpoint": "https://your-resource.openai.azure.com/",
      "models": ["gpt-4o", "gpt-4o-mini", "dall-e-3"]
    },
    "computer_vision": {
      "status": "connected",
      "endpoint": "https://your-resource.cognitiveservices.azure.com/",
      "features": ["image-analysis", "ocr", "face-detection"]
    },
    "speech": {
      "status": "connected",
      "endpoint": "https://your-resource.cognitiveservices.azure.com/",
      "features": ["speech-to-text", "text-to-speech"]
    }
  },
  "key_vault": {
    "name": "your-keyvault-name",
    "status": "integrated",
    "secrets": ["openai-api-key", "vision-api-key", "speech-api-key"]
  },
  "compute": {
    "cluster": "foundry-compute",
    "status": "active"
  }
}
```

### Testing Checklist
- [ ] All service connections verified
- [ ] Key Vault integration working
- [ ] Model catalog accessible
- [ ] Test models responding correctly
- [ ] Project created successfully
- [ ] Compute resources available
- [ ] Data sources connected
- [ ] Security permissions configured

### Troubleshooting Guide

#### Common Issues and Solutions

1. **Service Connection Failed**:
   - Verify API keys are correct
   - Check endpoint URLs
   - Ensure proper permissions

2. **Key Vault Access Denied**:
   - Verify managed identity permissions
   - Check Key Vault access policies
   - Ensure proper role assignments

3. **Model Not Available**:
   - Check model deployment status
   - Verify quota limits
   - Ensure proper API version

4. **Compute Issues**:
   - Check compute cluster status
   - Verify node availability
   - Review scaling policies

---

## Next Steps

1. **Develop AI Applications**:
   - Create notebooks for experimentation
   - Build custom models
   - Implement AI workflows

2. **Monitor and Optimize**:
   - Set up monitoring dashboards
   - Track usage and costs
   - Optimize performance

3. **Scale and Deploy**:
   - Deploy models to production
   - Set up CI/CD pipelines
   - Implement A/B testing

---

## Security Best Practices

1. **Access Control**:
   - Use least privilege principle
   - Implement role-based access control
   - Regular access reviews

2. **Data Protection**:
   - Encrypt data at rest and in transit
   - Use managed identities
   - Implement data governance

3. **Monitoring**:
   - Enable audit logging
   - Monitor for suspicious activity
   - Regular security assessments

---

*This document should be updated as your Azure AI Studio integration evolves and new services are added.* 