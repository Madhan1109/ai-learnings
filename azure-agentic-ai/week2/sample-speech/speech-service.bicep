@description('Name for the Speech Service (3-24 chars, lowercase, no dashes)')
param speechServiceName string = 'speechtestsvc'

@description('Azure region for deployment')
param location string = 'eastus'

@description('SKU for the Speech Service')
param sku string = 'F0'

resource speech 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: speechServiceName
  location: location
  kind: 'SpeechServices'
  sku: {
    name: sku
  }
  properties: {
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

var keys = listKeys(speech.id, '2023-05-01')

output endpoint string = speech.properties.endpoint
output key1 string = keys.key1
output key2 string = keys.key2 