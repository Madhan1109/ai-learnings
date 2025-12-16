# Flowise Setup Guide

## Overview

This guide will help you set up the AI-Powered Candidate Search system using Flowise.

## Prerequisites

1. **Node.js 18+** - Required for Flowise
   ```bash
   node --version  # Should be 18 or higher
   ```

2. **Python 3.9+** - Required for custom tools
   ```bash
   python --version  # Should be 3.9 or higher
   ```

3. **npm** - Node package manager
   ```bash
   npm --version
   ```

## Step 1: Install Flowise

### Option A: Global Installation (Recommended)

```bash
npm install -g flowise
```

### Option B: Docker Installation

```bash
docker pull flowiseai/flowise
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

### Option C: Local Installation

```bash
npm install flowise
npx flowise start
```

## Step 2: Install Python Dependencies

```bash
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Step 3: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your API keys
# Required:
# - OPENAI_API_KEY
# - GITHUB_TOKEN
# - SECRET_KEY
```

## Step 4: Start Flowise Server

```bash
# Start Flowise
flowise start

# Or with custom port
flowise start --PORT=3000

# Or with custom data directory
flowise start --DATABASE_PATH=./flowise/database
```

Flowise will be available at: `http://localhost:3000`

## Step 5: Set Up Custom Tools

### 5.1 Install Custom Tools

Flowise supports custom Python tools. Install them:

```bash
python setup_flowise_tools.py
```

### 5.2 Register Tools in Flowise

1. Open Flowise UI: `http://localhost:3000`
2. Go to **Settings** → **Custom Tools**
3. Add the following tools:
   - `DocumentParserTool` - Path: `flowise/custom_tools/document_parser.py`
   - `GitHubSearchTool` - Path: `flowise/custom_tools/github_search.py`
   - `WebSearchTool` - Path: `flowise/custom_tools/web_search.py`
   - `LinkedInSearchTool` - Path: `flowise/custom_tools/linkedin_search.py`
   - `ProfileAnalyzerTool` - Path: `flowise/custom_tools/profile_analyzer.py`

## Step 6: Import Workflow

### Option A: Import from JSON

1. Open Flowise UI
2. Click **New Chatflow**
3. Click **Import** (top right)
4. Select `flowise/chatflows/candidate_search_flow.json`
5. The workflow will be loaded

### Option B: Build Manually

Follow the workflow structure in `FLOWISE_WORKFLOW.md`

## Step 7: Configure API Keys in Flowise

1. In Flowise UI, go to **Settings** → **Credentials**
2. Add your API keys:
   - OpenAI API Key
   - GitHub Token
   - SerpAPI Key (optional)
   - Google API Key (optional)

## Step 8: Test the Workflow

### Test in Flowise UI

1. Open the candidate search Chatflow
2. Click **Test** button
3. Upload a job description file
4. Click **Run**
5. View results

### Test via API

```bash
# Start API server
python run_api.py

# In another terminal, test
curl -X POST "http://localhost:8000/api/v1/search/upload" \
  -F "file=@sample_job_description.docx"
```

## Workflow Structure in Flowise

The workflow consists of these nodes:

```
1. Input Node
   ↓
2. Document Parser Tool Node
   ↓
3. Split Node (for parallel processing)
   ├─→ GitHub Search Tool Node
   └─→ Web/LinkedIn Search Tool Node
   ↓
4. Merge Node
   ↓
5. Profile Summarizer Tool Node
   ↓
6. Output Node
```

## Custom Tool Development

### Creating a Custom Tool

1. Create Python file in `flowise/custom_tools/`
2. Follow the Flowise tool interface:

```python
from typing import Dict, Any

class MyCustomTool:
    def __init__(self):
        self.name = "My Custom Tool"
        self.description = "Tool description"
    
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        # Tool logic here
        return {"result": "output"}
```

3. Register in Flowise UI

## Troubleshooting

### Flowise Won't Start

**Issue**: Port 3000 already in use
```bash
# Use different port
flowise start --PORT=3001
```

**Issue**: Node.js version too old
```bash
# Update Node.js to 18+
node --version
```

### Custom Tools Not Loading

**Issue**: Python path not found
- Ensure Python is in PATH
- Check Flowise settings for Python path

**Issue**: Import errors
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check tool file paths in Flowise settings

### API Connection Issues

**Issue**: Cannot connect to Flowise API
- Verify Flowise is running: `http://localhost:3000`
- Check `FLOWISE_HOST` in `.env`
- Verify API key if authentication enabled

## Next Steps

1. Read `FLOWISE_WORKFLOW.md` for workflow details
2. Read `API.md` for API usage
3. Customize workflow in Flowise UI
4. Deploy to production (see `DEPLOYMENT.md`)

## Additional Resources

- Flowise Documentation: https://docs.flowiseai.com
- Flowise GitHub: https://github.com/FlowiseAI/Flowise
- Flowise Discord: https://discord.gg/flowise

---

**Ready to build your candidate search workflow!**

