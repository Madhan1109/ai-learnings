# Cleanup script for Azure Cognitive Services deployment
# This script removes all resources created by the deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "Azure Cognitive Services Cleanup Script" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red

# Check if resource group exists
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Resource group '$ResourceGroupName' does not exist." -ForegroundColor Yellow
    exit 0
}

# List resources that will be deleted
Write-Host "`nResources that will be deleted:" -ForegroundColor Yellow
$resources = az resource list --resource-group $ResourceGroupName --query "[].{Name:name, Type:type}" -o table
Write-Host $resources

# Confirm deletion
if (-not $Force) {
    Write-Host "`n⚠️  WARNING: This will permanently delete all resources in the resource group!" -ForegroundColor Red
    $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
    
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "Cleanup cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Delete the resource group (this will delete all resources within it)
Write-Host "`nDeleting resource group '$ResourceGroupName'..." -ForegroundColor Yellow
az group delete --name $ResourceGroupName --yes --no-wait

Write-Host "`n✅ Cleanup initiated. Resource group deletion is in progress." -ForegroundColor Green
Write-Host "Note: Deletion may take several minutes to complete." -ForegroundColor Yellow
Write-Host "You can check the status in the Azure Portal or use: az group show --name '$ResourceGroupName'" -ForegroundColor Cyan 