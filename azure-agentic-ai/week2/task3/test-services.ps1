# Test script for Azure Cognitive Services
# This script verifies that all deployed services are accessible

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName
)

Write-Host "Testing Azure Cognitive Services deployment..." -ForegroundColor Green

# If Key Vault name is not provided, construct it
if (-not $KeyVaultName) {
    $KeyVaultName = "$ResourceGroupName-kv"
}

# Function to test service connectivity
function Test-ServiceEndpoint {
    param(
        [string]$ServiceName,
        [string]$EndpointSecret,
        [string]$KeySecret,
        [string]$TestPath
    )
    
    try {
        Write-Host "Testing $ServiceName..." -ForegroundColor Yellow
        
        # Get endpoint and key from Key Vault
        $endpoint = az keyvault secret show --vault-name $KeyVaultName --name $EndpointSecret --query value -o tsv 2>$null
        $key = az keyvault secret show --vault-name $KeyVaultName --name $KeySecret --query value -o tsv 2>$null
        
        if (-not $endpoint -or -not $key) {
            Write-Host "  ❌ Failed to retrieve secrets from Key Vault" -ForegroundColor Red
            return $false
        }
        
        # Test the endpoint
        $testUrl = "$endpoint$TestPath"
        $headers = @{
            "Ocp-Apim-Subscription-Key" = $key
            "Content-Type" = "application/json"
        }
        
        # Simple connectivity test
        $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -ErrorAction Stop
        
        Write-Host "  ✅ $ServiceName is accessible" -ForegroundColor Green
        return $true
        
    } catch {
        Write-Host "  ❌ $ServiceName test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test all services
$tests = @(
    @{
        ServiceName = "Speech Service"
        EndpointSecret = "speech-endpoint"
        KeySecret = "speech-key1"
        TestPath = "/speechtotext/v3.0/endpoints"
    },
    @{
        ServiceName = "Vision Service"
        EndpointSecret = "vision-endpoint"
        KeySecret = "vision-key1"
        TestPath = "/vision/v3.2/models"
    },
    @{
        ServiceName = "Document Intelligence"
        EndpointSecret = "document-intelligence-endpoint"
        KeySecret = "document-intelligence-key1"
        TestPath = "/formrecognizer/v2.1/prebuilt/receipt/analyze"
    }
)

$successCount = 0
$totalTests = $tests.Count

foreach ($test in $tests) {
    if (Test-ServiceEndpoint -ServiceName $test.ServiceName -EndpointSecret $test.EndpointSecret -KeySecret $test.KeySecret -TestPath $test.TestPath) {
        $successCount++
    }
}

Write-Host "`nTest Results:" -ForegroundColor Cyan
Write-Host "Passed: $successCount/$totalTests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

if ($successCount -eq $totalTests) {
    Write-Host "`n🎉 All Cognitive Services are working correctly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some services failed. Please check the deployment and Key Vault configuration." -ForegroundColor Yellow
}

# Display resource information
Write-Host "`nDeployed Resources:" -ForegroundColor Cyan
$resources = az resource list --resource-group $ResourceGroupName --query "[].{Name:name, Type:type, Location:location}" -o table
Write-Host $resources

Write-Host "`nKey Vault Secrets:" -ForegroundColor Cyan
$secrets = az keyvault secret list --vault-name $KeyVaultName --query "[].name" -o table
Write-Host $secrets 