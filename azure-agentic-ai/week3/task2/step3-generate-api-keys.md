# Step 3: Generate API Keys and Configure Access

## Overview
This guide covers generating API keys for both GPT-4o-mini and GPT-4o Vision deployments, configuring secure access, and setting up authentication for testing.

## Prerequisites
- Completed Step 1 (GPT-4o-mini deployment)
- Completed Step 2 (GPT-4o Vision deployment)
- Both deployments showing "Active" status
- Access to Azure AI Studio

---

## Step-by-Step API Key Generation

### 1. Access Deployments in Azure AI Studio

1. **Navigate to Deployments**:
   - In Azure AI Studio, click "Deployments" in the left sidebar
   - You should see both deployments listed:
     - `gpt-4o-mini-standard`
     - `gpt-4o-vision`

2. **Verify Deployment Status**:
   - Ensure both deployments show "Active" status
   - Note the endpoint URLs for each deployment

### 2. Generate API Key for GPT-4o-mini

1. **Select GPT-4o-mini Deployment**:
   - Click on "gpt-4o-mini-standard" deployment
   - Go to the "Keys" tab

2. **Generate New Key**:
   - Click "Generate new key"
   - Enter key name: `gpt-4o-mini-key`
   - Click "Generate"

3. **Copy and Store the Key**:
   ```
   ⚠️ IMPORTANT: Copy the generated key immediately
   You won't be able to see it again after leaving this page
   ```

4. **Key Information**:
   ```
   Key Name: gpt-4o-mini-key
   Key Type: API Key
   Status: Active
   Created: [Current Date/Time]
   ```

### 3. Generate API Key for GPT-4o Vision

1. **Select GPT-4o Vision Deployment**:
   - Click on "gpt-4o-vision" deployment
   - Go to the "Keys" tab

2. **Generate New Key**:
   - Click "Generate new key"
   - Enter key name: `gpt-4o-vision-key`
   - Click "Generate"

3. **Copy and Store the Key**:
   ```
   ⚠️ IMPORTANT: Copy the generated key immediately
   You won't be able to see it again after leaving this page
   ```

4. **Key Information**:
   ```
   Key Name: gpt-4o-vision-key
   Key Type: API Key
   Status: Active
   Created: [Current Date/Time]
   ```

---

## Secure Key Storage Options

### Option 1: Azure Key Vault (Recommended for Production)

1. **Create Key Vault** (if not exists):
   ```powershell
   # Create Key Vault
   az keyvault create \
     --name "foundry-ai-keyvault" \
     --resource-group "Foundry-RG" \
     --location "East US"
   ```

2. **Store API Keys in Key Vault**:
   ```powershell
   # Store GPT-4o-mini API key
   az keyvault secret set \
     --vault-name "foundry-ai-keyvault" \
     --name "gpt-4o-mini-api-key" \
     --value "your-gpt-4o-mini-key"
   
   # Store GPT-4o Vision API key
   az keyvault secret set \
     --vault-name "foundry-ai-keyvault" \
     --name "gpt-4o-vision-api-key" \
     --value "your-gpt-4o-vision-key"
   ```

3. **Retrieve Keys Securely**:
   ```powershell
   # Retrieve GPT-4o-mini key
   az keyvault secret show \
     --vault-name "foundry-ai-keyvault" \
     --name "gpt-4o-mini-api-key" \
     --query value -o tsv
   
   # Retrieve GPT-4o Vision key
   az keyvault secret show \
     --vault-name "foundry-ai-keyvault" \
     --name "gpt-4o-vision-api-key" \
     --query value -o tsv
   ```

### Option 2: Environment Variables (Development)

1. **Set Environment Variables**:
   ```bash
   # For Windows PowerShell
   $env:GPT4O_MINI_API_KEY="your-gpt-4o-mini-key"
   $env:GPT4O_VISION_API_KEY="your-gpt-4o-vision-key"
   
   # For Windows Command Prompt
   set GPT4O_MINI_API_KEY=your-gpt-4o-mini-key
   set GPT4O_VISION_API_KEY=your-gpt-4o-vision-key
   
   # For Linux/Mac
   export GPT4O_MINI_API_KEY="your-gpt-4o-mini-key"
   export GPT4O_VISION_API_KEY="your-gpt-4o-vision-key"
   ```

2. **Create .env File** (for Python applications):
   ```env
   # .env file
   GPT4O_MINI_API_KEY=your-gpt-4o-mini-key
   GPT4O_VISION_API_KEY=your-gpt-4o-vision-key
   GPT4O_MINI_ENDPOINT=https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard
   GPT4O_VISION_ENDPOINT=https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision
   ```

### Option 3: Configuration File (Development Only)

1. **Create config.json**:
   ```json
   {
     "api_keys": {
       "gpt4o_mini": "your-gpt-4o-mini-key",
       "gpt4o_vision": "your-gpt-4o-vision-key"
     },
     "endpoints": {
       "gpt4o_mini": "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard",
       "gpt4o_vision": "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision"
     }
   }
   ```

2. **Load Configuration**:
   ```python
   import json
   
   with open('config.json', 'r') as f:
       config = json.load(f)
   
   GPT4O_MINI_API_KEY = config['api_keys']['gpt4o_mini']
   GPT4O_VISION_API_KEY = config['api_keys']['gpt4o_vision']
   ```

---

## Endpoint Configuration

### 1. Collect Endpoint Information

1. **GPT-4o-mini Endpoint**:
   ```
   Endpoint URL: https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard
   API Version: 2024-02-15-preview
   Model: gpt-4o-mini
   ```

2. **GPT-4o Vision Endpoint**:
   ```
   Endpoint URL: https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision
   API Version: 2024-02-15-preview
   Model: gpt-4o
   ```

### 2. Create Configuration Summary

```json
{
  "endpoints": {
    "gpt4o_mini": {
      "name": "gpt-4o-mini-standard",
      "url": "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard",
      "api_version": "2024-02-15-preview",
      "model": "gpt-4o-mini",
      "capabilities": ["text-generation", "chat-completions", "code-generation"]
    },
    "gpt4o_vision": {
      "name": "gpt-4o-vision",
      "url": "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision",
      "api_version": "2024-02-15-preview",
      "model": "gpt-4o",
      "capabilities": ["text-generation", "image-analysis", "multimodal-understanding"]
    }
  },
  "api_keys": {
    "gpt4o_mini": "your-gpt-4o-mini-key",
    "gpt4o_vision": "your-gpt-4o-vision-key"
  },
  "security": {
    "key_vault": "foundry-ai-keyvault",
    "environment": "development"
  }
}
```

---

## Authentication Setup

### 1. API Key Authentication

```python
import requests

# Headers for API key authentication
def get_headers(api_key):
    return {
        "Content-Type": "application/json",
        "api-key": api_key
    }

# Example usage
headers_mini = get_headers(GPT4O_MINI_API_KEY)
headers_vision = get_headers(GPT4O_VISION_API_KEY)
```

### 2. Azure AD Authentication (Alternative)

```python
from azure.identity import DefaultAzureCredential
import requests

# Get token for Azure AD authentication
credential = DefaultAzureCredential()
token = credential.get_token("https://cognitiveservices.azure.com/.default")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token.token}"
}
```

---

## Key Management Best Practices

### 1. Security Guidelines

- **Never commit keys to version control**
- **Use Key Vault for production environments**
- **Rotate keys regularly**
- **Monitor key usage and access**
- **Use least privilege principle**

### 2. Key Rotation Process

1. **Generate New Key**:
   - Create new API key in Azure AI Studio
   - Update applications with new key

2. **Update Storage**:
   - Update Key Vault or environment variables
   - Test with new key

3. **Remove Old Key**:
   - Delete old key after successful transition
   - Monitor for any issues

### 3. Monitoring and Alerts

```powershell
# Set up Key Vault monitoring
az monitor diagnostic-settings create \
  --resource "foundry-ai-keyvault" \
  --resource-group "Foundry-RG" \
  --name "keyvault-monitoring" \
  --storage-account "your-storage-account" \
  --logs '[{"category": "AuditEvent", "enabled": true}]'
```

---

## Testing API Key Access

### 1. Basic Connectivity Test

```python
import requests
import time

def test_api_key_access(endpoint_url, api_key, model_name):
    """Test basic API key access"""
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }
    
    payload = {
        "messages": [
            {"role": "user", "content": "Hello, this is a test."}
        ],
        "max_tokens": 10
    }
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{endpoint_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        end_time = time.time()
        
        if response.status_code == 200:
            print(f"✅ {model_name} API Key Test: SUCCESS")
            print(f"   Response Time: {end_time - start_time:.2f}s")
            print(f"   Status Code: {response.status_code}")
            return True
        else:
            print(f"❌ {model_name} API Key Test: FAILED")
            print(f"   Status Code: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ {model_name} API Key Test: ERROR")
        print(f"   Exception: {str(e)}")
        return False

# Test both endpoints
print("🧪 Testing API Key Access...")
test_api_key_access(GPT4O_MINI_ENDPOINT, GPT4O_MINI_API_KEY, "GPT-4o-mini")
test_api_key_access(GPT4O_VISION_ENDPOINT, GPT4O_VISION_API_KEY, "GPT-4o Vision")
```

### 2. Key Validation Script

```python
def validate_api_keys():
    """Validate all API keys are working"""
    validation_results = {}
    
    # Test GPT-4o-mini
    mini_success = test_api_key_access(
        GPT4O_MINI_ENDPOINT, 
        GPT4O_MINI_API_KEY, 
        "GPT-4o-mini"
    )
    validation_results["gpt4o_mini"] = mini_success
    
    # Test GPT-4o Vision
    vision_success = test_api_key_access(
        GPT4O_VISION_ENDPOINT, 
        GPT4O_VISION_API_KEY, 
        "GPT-4o Vision"
    )
    validation_results["gpt4o_vision"] = vision_success
    
    # Summary
    print("\n📊 API Key Validation Summary:")
    for model, success in validation_results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {model}: {status}")
    
    return validation_results

# Run validation
validation_results = validate_api_keys()
```

---

## Troubleshooting API Key Issues

### Common Issues and Solutions

1. **Invalid API Key**:
   ```
   Error: 401 Unauthorized
   Solution: Verify key is copied correctly, check for extra spaces
   ```

2. **Key Not Found**:
   ```
   Error: 404 Not Found
   Solution: Ensure deployment is active, check endpoint URL
   ```

3. **Quota Exceeded**:
   ```
   Error: 429 Too Many Requests
   Solution: Check usage limits, wait before retrying
   ```

4. **Network Issues**:
   ```
   Error: Connection timeout
   Solution: Check network connectivity, firewall settings
   ```

### Verification Checklist

- [ ] Both API keys generated successfully
- [ ] Keys copied and stored securely
- [ ] Endpoint URLs collected
- [ ] Basic connectivity test passed
- [ ] Key Vault configured (if using)
- [ ] Environment variables set (if using)
- [ ] Configuration documented
- [ ] Security best practices followed

---

## Next Steps

After successful API key generation:

1. **Test Endpoints**: Proceed to Step 4 for comprehensive testing
2. **Set Up Monitoring**: Configure alerts for key usage
3. **Document Configuration**: Update your configuration files
4. **Plan Integration**: Consider how to use both models in your application

---

*Secure API key management is crucial for production applications. Always use Key Vault for sensitive environments.* 