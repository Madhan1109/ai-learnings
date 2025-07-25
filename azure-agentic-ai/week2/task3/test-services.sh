#!/bin/bash
set -e

RESOURCE_GROUP_NAME=${1:-cogsvctestgrp}
KEYVAULT_NAME=${2:-${RESOURCE_GROUP_NAME}kv}

function test_service() {
  local service_name="$1"
  local endpoint_secret="$2"
  local key_secret="$3"
  local test_path="$4"

  echo "Testing $service_name..."
  endpoint=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "$endpoint_secret" --query value -o tsv 2>/dev/null)
  key=$(az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "$key_secret" --query value -o tsv 2>/dev/null)

  if [[ -z "$endpoint" || -z "$key" ]]; then
    echo "  ❌ Failed to retrieve secrets from Key Vault"
    return 1
  fi

  url="$endpoint$test_path"
  response=$(curl -s -o /dev/null -w "%{http_code}" -H "Ocp-Apim-Subscription-Key: $key" "$url")
  if [[ "$response" == "200" || "$response" == "202" ]]; then
    echo "  ✅ $service_name is accessible"
    return 0
  else
    echo "  ❌ $service_name test failed (HTTP $response)"
    return 1
  fi
}

success=0
total=3

test_service "Speech Service" "speech-endpoint" "speech-key1" "/speechtotext/v3.0/endpoints" && ((success++))
test_service "Vision Service" "vision-endpoint" "vision-key1" "/vision/v3.2/models" && ((success++))
test_service "Document Intelligence" "document-intelligence-endpoint" "document-intelligence-key1" "/formrecognizer/v2.1/prebuilt/receipt/analyze" && ((success++))

echo
if [[ $success -eq $total ]]; then
  echo "🎉 All Cognitive Services are working correctly! ($success/$total)"
else
  echo "⚠️  Some services failed. Passed: $success/$total"
fi

echo
az resource list --resource-group "$RESOURCE_GROUP_NAME" --query "[].{Name:name, Type:type, Location:location}" -o table

echo
az keyvault secret list --vault-name "$KEYVAULT_NAME" --query "[].name" -o table 