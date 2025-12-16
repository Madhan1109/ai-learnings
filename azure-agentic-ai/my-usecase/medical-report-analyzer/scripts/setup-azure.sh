#!/bin/bash

# Azure Services Setup Script for Medical Report Analyzer
# This script helps set up environment variables for Azure services

echo "🏥 Medical Report Analyzer - Azure Setup Script"
echo "=============================================="

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cat > backend/.env << EOF
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
EOF
    echo "✅ Created backend/.env file"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update the .env file with your actual Azure credentials"
echo "2. Change spring.profiles.active to 'azure' in application.yml"
echo "3. Run: mvn spring-boot:run -Dspring.profiles.active=azure"
echo ""
echo "📚 For detailed setup instructions, see: docs/AZURE_SETUP_GUIDE.md"
echo ""
echo "🔧 To switch back to mock services:"
echo "   Change spring.profiles.active to 'default' in application.yml"
