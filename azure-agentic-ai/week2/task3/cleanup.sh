#!/bin/bash
set -e

RESOURCE_GROUP_NAME=${1:-cogsvctestgrp}

if ! az group exists --name "$RESOURCE_GROUP_NAME" | grep -q true; then
  echo "Resource group '$RESOURCE_GROUP_NAME' does not exist."
  exit 0
fi

echo "\nResources that will be deleted:"
az resource list --resource-group "$RESOURCE_GROUP_NAME" --query "[].{Name:name, Type:type}" -o table

echo -e "\n⚠️  WARNING: This will permanently delete all resources in the resource group!"
read -p "Are you sure you want to continue? (y/N): " confirmation
if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
  echo "Cleanup cancelled."
  exit 0
fi

echo "\nDeleting resource group '$RESOURCE_GROUP_NAME'..."
az group delete --name "$RESOURCE_GROUP_NAME" --yes --no-wait

echo "\n✅ Cleanup initiated. Resource group deletion is in progress."
echo "Note: Deletion may take several minutes to complete."
echo "You can check the status in the Azure Portal or use: az group show --name '$RESOURCE_GROUP_NAME'" 