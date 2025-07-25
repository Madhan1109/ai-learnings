@description('The location for all resources')
param location string = resourceGroup().location

@description('Environment tag (dev, staging, prod)')
param environment string = 'dev'

@description('Project name for resource naming (lowercase, no dashes, <=12 chars)')
param projectName string = 'cogsvc'

@description('Key Vault SKU')
param keyVaultSku string = 'standard'

@description('Cognitive Services SKU')
param cognitiveServicesSku string = 'S0'

// Variables for resource naming (max 24 chars, lowercase, no dashes)
var resourcePrefix = toLower('${projectName}${environment}')
var keyVaultName = '${resourcePrefix}kv'
var speechServiceName = '${resourcePrefix}speech'
var visionServiceName = '${resourcePrefix}vision'
var documentIntelligenceName = '${resourcePrefix}docintel'
var storageAccountName = '${resourcePrefix}stor'

// Key Vault for storing service endpoints and keys
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: {
    Environment: environment
    Project: projectName
    Purpose: 'Cognitive Services Secrets'
  }
  properties: {
    sku: {
      family: 'A'
      name: keyVaultSku
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Storage Account for Document Intelligence
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: {
    Environment: environment
    Project: projectName
    Purpose: 'Document Intelligence Storage'
  }
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
  }
}

// Speech Service
resource speechService 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: speechServiceName
  location: location
  tags: {
    Environment: environment
    Project: projectName
    Service: 'Speech'
  }
  sku: {
    name: cognitiveServicesSku
  }
  kind: 'SpeechServices'
  properties: {
    customSubDomainName: speechServiceName
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Computer Vision Service
resource visionService 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: visionServiceName
  location: location
  tags: {
    Environment: environment
    Project: projectName
    Service: 'Vision'
  }
  sku: {
    name: cognitiveServicesSku
  }
  kind: 'ComputerVision'
  properties: {
    customSubDomainName: visionServiceName
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Document Intelligence Service (Form Recognizer)
resource documentIntelligence 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: documentIntelligenceName
  location: location
  tags: {
    Environment: environment
    Project: projectName
    Service: 'Document Intelligence'
  }
  sku: {
    name: cognitiveServicesSku
  }
  kind: 'FormRecognizer'
  properties: {
    customSubDomainName: documentIntelligenceName
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Get the primary keys for each service using listKeys() function
var speechKeys = listKeys(speechService.id, '2023-05-01')
var visionKeys = listKeys(visionService.id, '2023-05-01')
var documentIntelligenceKeys = listKeys(documentIntelligence.id, '2023-05-01')

// Store service endpoints and keys in Key Vault
resource speechEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'speech-endpoint'
  properties: {
    value: 'https://${speechService.properties.endpoint}'
    contentType: 'text/plain'
  }
}

resource speechKey1Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'speech-key1'
  properties: {
    value: speechKeys.key1
    contentType: 'text/plain'
  }
}

resource speechKey2Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'speech-key2'
  properties: {
    value: speechKeys.key2
    contentType: 'text/plain'
  }
}

resource visionEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'vision-endpoint'
  properties: {
    value: 'https://${visionService.properties.endpoint}'
    contentType: 'text/plain'
  }
}

resource visionKey1Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'vision-key1'
  properties: {
    value: visionKeys.key1
    contentType: 'text/plain'
  }
}

resource visionKey2Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'vision-key2'
  properties: {
    value: visionKeys.key2
    contentType: 'text/plain'
  }
}

resource documentIntelligenceEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'document-intelligence-endpoint'
  properties: {
    value: 'https://${documentIntelligence.properties.endpoint}'
    contentType: 'text/plain'
  }
}

resource documentIntelligenceKey1Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'document-intelligence-key1'
  properties: {
    value: documentIntelligenceKeys.key1
    contentType: 'text/plain'
  }
}

resource documentIntelligenceKey2Secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'document-intelligence-key2'
  properties: {
    value: documentIntelligenceKeys.key2
    contentType: 'text/plain'
  }
}

// Outputs for easy reference
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
output speechServiceName string = speechService.name
output speechServiceEndpoint string = speechService.properties.endpoint
output visionServiceName string = visionService.name
output visionServiceEndpoint string = visionService.properties.endpoint
output documentIntelligenceName string = documentIntelligence.name
output documentIntelligenceEndpoint string = documentIntelligence.properties.endpoint
output storageAccountName string = storageAccount.name

// Output all secret names for reference
output secretNames object = {
  speechEndpoint: speechEndpointSecret.name
  speechKey1: speechKey1Secret.name
  speechKey2: speechKey2Secret.name
  visionEndpoint: visionEndpointSecret.name
  visionKey1: visionKey1Secret.name
  visionKey2: visionKey2Secret.name
  documentIntelligenceEndpoint: documentIntelligenceEndpointSecret.name
  documentIntelligenceKey1: documentIntelligenceKey1Secret.name
  documentIntelligenceKey2: documentIntelligenceKey2Secret.name
} 