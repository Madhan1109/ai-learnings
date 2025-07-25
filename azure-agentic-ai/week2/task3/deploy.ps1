# Azure Cognitive Services Deployment Script
# This script deploys Speech, Vision, and Document Intelligence services with Key Vault integration

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "cognitive-services",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyVaultSku = "standard",
    
    [Parameter(Mandatory=$false)]
    [string]$CognitiveServicesSku = "S0"
)

Write-Host "Starting Azure Cognitive Services deployment..." -ForegroundColor Green

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI is not installed. Please install it from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Check if user is logged in
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Please log in to Azure..." -ForegroundColor Yellow
    az login
}

# Create resource group if it doesn't exist
Write-Host "Creating resource group: $ResourceGroupName in $Location" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Deploy the Bicep template
Write-Host "Deploying Cognitive Services resources..." -ForegroundColor Yellow
$deploymentName = "cognitive-services-deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "cognitive-services.bicep" `
    --parameters location=$Location environment=$Environment projectName=$ProjectName keyVaultSku=$KeyVaultSku cognitiveServicesSku=$CognitiveServicesSku `
    --name $deploymentName

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    
    # Get deployment outputs
    Write-Host "`nDeployment Outputs:" -ForegroundColor Cyan
    $outputs = az deployment group show --resource-group $ResourceGroupName --name $deploymentName --query properties.outputs | ConvertFrom-Json
    
    Write-Host "Key Vault Name: $($outputs.keyVaultName.value)" -ForegroundColor White
    Write-Host "Key Vault URI: $($outputs.keyVaultUri.value)" -ForegroundColor White
    Write-Host "Speech Service: $($outputs.speechServiceName.value)" -ForegroundColor White
    Write-Host "Vision Service: $($outputs.visionServiceName.value)" -ForegroundColor White
    Write-Host "Document Intelligence: $($outputs.documentIntelligenceName.value)" -ForegroundColor White
    Write-Host "Storage Account: $($outputs.storageAccountName.value)" -ForegroundColor White
    
    Write-Host "`nNext Steps:" -ForegroundColor Yellow
    Write-Host "1. Open Azure Portal and navigate to the Key Vault" -ForegroundColor White
    Write-Host "2. Check the Secrets section for all service endpoints and keys" -ForegroundColor White
    Write-Host "3. Verify the Cognitive Services in the Azure Portal" -ForegroundColor White
    Write-Host "4. Test the services using the provided endpoints and keys" -ForegroundColor White
    
} else {
    Write-Error "Deployment failed. Please check the error messages above."
    exit 1
} 