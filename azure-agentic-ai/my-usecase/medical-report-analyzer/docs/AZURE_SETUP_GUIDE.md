# Azure Services Setup Guide

This guide will help you set up real Azure AI services for the Medical Report Analyzer application.

## Prerequisites

- Azure free account (with $200 credit)
- Azure CLI installed (optional but recommended)
- Basic understanding of Azure services

## Step 1: Create Azure Resources

### 1.1 Azure Document Intelligence (Form Recognizer)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create a new resource**:
   - Search for "Form Recognizer"
   - Click "Create"
   - Fill in the details:
     - **Subscription**: Your subscription
     - **Resource Group**: Create new or use existing
     - **Region**: Choose a region close to you
     - **Name**: `medical-form-recognizer`
     - **Pricing Tier**: Free (F0) - 500 pages/month
   - Click "Review + Create" → "Create"

3. **Get credentials**:
   - Go to your Form Recognizer resource
   - Navigate to "Keys and Endpoint"
   - Copy the **Endpoint** and **Key 1**

### 1.2 Azure OpenAI

1. **Request access** (if not already available):
   - Go to https://oai.azure.com
   - Request access to Azure OpenAI
   - Wait for approval (usually 1-2 days)

2. **Create Azure OpenAI resource**:
   - Go to Azure Portal
   - Search for "Azure OpenAI"
   - Click "Create"
   - Fill in the details:
     - **Subscription**: Your subscription
     - **Resource Group**: Same as above
     - **Region**: Choose a region with OpenAI availability
     - **Name**: `medical-openai`
     - **Pricing Tier**: Free (F0) - 1000 tokens/month
   - Click "Review + Create" → "Create"

3. **Deploy a model**:
   - Go to your Azure OpenAI resource
   - Navigate to "Model deployments"
   - Click "Create new deployment"
   - Choose "gpt-4" model
   - Set deployment name: `gpt-4`
   - Click "Create"

4. **Get credentials**:
   - Go to "Keys and Endpoint"
   - Copy the **Endpoint** and **Key 1**

### 1.3 Azure Cognitive Search

1. **Create Search service**:
   - Go to Azure Portal
   - Search for "Azure Cognitive Search"
   - Click "Create"
   - Fill in the details:
     - **Subscription**: Your subscription
     - **Resource Group**: Same as above
     - **Region**: Choose a region close to you
     - **Name**: `medical-search`
     - **Pricing Tier**: Free (F0) - 50MB storage, 20K queries/month
   - Click "Review + Create" → "Create"

2. **Get credentials**:
   - Go to your Search service
   - Navigate to "Keys"
   - Copy the **Primary admin key**
   - Note the **URL** (endpoint)

## Step 2: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Azure Document Intelligence
AZURE_FORM_RECOGNIZER_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_FORM_RECOGNIZER_API_KEY=your-api-key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure Cognitive Search
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_API_KEY=your-api-key
```

## Step 3: Update Application Configuration

### 3.1 Update application.yml

Replace the placeholder values in `backend/src/main/resources/application.yml`:

```yaml
azure:
  openai:
    endpoint: ${AZURE_OPENAI_ENDPOINT:https://your-resource.openai.azure.com/}
    api-key: ${AZURE_OPENAI_API_KEY:your-api-key}
    deployment-name: ${AZURE_OPENAI_DEPLOYMENT_NAME:gpt-4}
  
  form-recognizer:
    endpoint: ${AZURE_FORM_RECOGNIZER_ENDPOINT:https://your-resource.cognitiveservices.azure.com/}
    api-key: ${AZURE_FORM_RECOGNIZER_API_KEY:your-api-key}
  
  search:
    endpoint: ${AZURE_SEARCH_ENDPOINT:https://your-search-service.search.windows.net}
    api-key: ${AZURE_SEARCH_API_KEY:your-api-key}
    index-name: medical-knowledge
```

### 3.2 Activate Azure Profile

Set the active profile to use real Azure services:

```yaml
spring:
  profiles:
    active: azure
```

## Step 4: Run the Application

### 4.1 Start Backend with Azure Services

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=azure
```

### 4.2 Start Frontend

```bash
cd frontend
npm start
```

## Step 5: Verify Azure Integration

1. **Check Health Status**:
   - Go to `http://localhost:8080/api/medical-reports/health`
   - Verify all Azure services show "HEALTHY" status

2. **Test Document Upload**:
   - Upload a medical report (PDF or image)
   - Verify real Azure services are being used (check logs)

3. **Monitor Usage**:
   - Check Azure Portal for usage metrics
   - Monitor free tier limits

## Free Tier Limits

| Service | Free Tier Limit | Cost After Limit |
|---------|----------------|------------------|
| Document Intelligence | 500 pages/month | $1.50 per 1,000 pages |
| Azure OpenAI | 1000 tokens/month | $0.03 per 1K tokens |
| Cognitive Search | 50MB storage, 20K queries/month | $0.10 per 10K queries |

## Troubleshooting

### Common Issues

1. **"Service not available" errors**:
   - Check if Azure services are properly configured
   - Verify API keys and endpoints are correct
   - Check if services are in the correct region

2. **Rate limiting errors**:
   - You've exceeded free tier limits
   - Wait for next month or upgrade to paid tier

3. **Authentication errors**:
   - Verify API keys are correct
   - Check if services are active in Azure Portal

### Fallback to Mock Services

If Azure services are not available, the application will automatically fall back to mock services. You can force mock mode by:

```yaml
spring:
  profiles:
    active: default
```

## Cost Optimization Tips

1. **Use smaller models** when possible
2. **Implement caching** for repeated queries
3. **Monitor usage** regularly
4. **Set up billing alerts** in Azure Portal
5. **Use batch processing** for multiple documents

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate API keys** regularly
4. **Use Azure Key Vault** for production
5. **Implement proper access controls**

## Next Steps

1. **Set up monitoring** with Azure Application Insights
2. **Implement caching** for better performance
3. **Add error handling** for rate limits
4. **Set up CI/CD** pipeline
5. **Scale to production** with proper security

## Support

- **Azure Documentation**: https://docs.microsoft.com/azure/
- **Azure Support**: Available through Azure Portal
- **Community Forums**: https://docs.microsoft.com/answers/
