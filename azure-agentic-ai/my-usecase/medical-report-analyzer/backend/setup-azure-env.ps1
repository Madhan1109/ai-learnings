# PowerShell script to set up Azure environment variables
# Run this script to set environment variables for your Azure services

Write-Host "Setting up Azure environment variables..." -ForegroundColor Green

# Azure Document Intelligence (Form Recognizer)
$formRecognizerEndpoint = Read-Host "Enter your Azure Form Recognizer endpoint (e.g., https://your-resource.cognitiveservices.azure.com/)"
$formRecognizerKey = Read-Host "Enter your Azure Form Recognizer API key"

# Azure OpenAI
$openaiEndpoint = Read-Host "Enter your Azure OpenAI endpoint (e.g., https://your-resource.openai.azure.com/)"
$openaiKey = Read-Host "Enter your Azure OpenAI API key"
$openaiDeployment = Read-Host "Enter your Azure OpenAI deployment name (e.g., gpt-4)"

# Azure Cognitive Search
$searchEndpoint = Read-Host "Enter your Azure Cognitive Search endpoint (e.g., https://your-search-service.search.windows.net)"
$searchKey = Read-Host "Enter your Azure Cognitive Search API key"

# Set environment variables for current session
$env:AZURE_FORM_RECOGNIZER_ENDPOINT = $formRecognizerEndpoint
$env:AZURE_FORM_RECOGNIZER_API_KEY = $formRecognizerKey
$env:AZURE_OPENAI_ENDPOINT = $openaiEndpoint
$env:AZURE_OPENAI_API_KEY = $openaiKey
$env:AZURE_OPENAI_DEPLOYMENT_NAME = $openaiDeployment
$env:AZURE_SEARCH_ENDPOINT = $searchEndpoint
$env:AZURE_SEARCH_API_KEY = $searchKey

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "You can now run: mvn spring-boot:run -Dspring.profiles.active=azure" -ForegroundColor Yellow

# Create .env file for reference
$envContent = @"
# Azure Document Intelligence (Form Recognizer)
AZURE_FORM_RECOGNIZER_ENDPOINT=$formRecognizerEndpoint
AZURE_FORM_RECOGNIZER_API_KEY=$formRecognizerKey

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=$openaiEndpoint
AZURE_OPENAI_API_KEY=$openaiKey
AZURE_OPENAI_DEPLOYMENT_NAME=$openaiDeployment

# Azure Cognitive Search
AZURE_SEARCH_ENDPOINT=$searchEndpoint
AZURE_SEARCH_API_KEY=$searchKey
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host ".env file created with your credentials" -ForegroundColor Green
