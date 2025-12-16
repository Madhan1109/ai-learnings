# Flowise Custom Tools Setup - Quick Guide

## Prerequisites
- ✅ Flowise running at http://localhost:3000
- ✅ API keys added to .env file

## Step-by-Step: Register Custom Tools

### Step 1: Open Flowise UI

1. Open browser: **http://localhost:3000**
2. You should see Flowise interface

### Step 2: Go to Settings

1. Click **Settings** icon (gear icon) in top right
2. Click **"Custom Tools"** tab

### Step 3: Add Document Parser Tool

1. Click **"Add Tool"** or **"+"** button
2. Fill in:
   - **Name:** `Document Parser`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
   - **Class:** `DocumentParserTool`
   - **Description:** `Parses job description documents and extracts information`
3. Click **Save**

### Step 4: Add GitHub Search Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name:** `GitHub Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
   - **Class:** `GitHubSearchTool`
   - **Description:** `Searches GitHub for developer profiles`
3. Click **Save**

### Step 5: Add Web Search Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name:** `Web Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
   - **Class:** `WebSearchTool`
   - **Description:** `Searches web for candidate profiles`
3. Click **Save**

### Step 6: Add Profile Analyzer Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name:** `Profile Analyzer`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
   - **Class:** `ProfileAnalyzerTool`
   - **Description:** `Analyzes and summarizes candidate profiles`
3. Click **Save**

### Step 7: Configure API Keys in Flowise

1. In Flowise UI, go to **Settings** → **Credentials**
2. Add credentials:
   - **OpenAI API Key:** Paste your OpenAI API key
   - **GitHub Token:** Paste your GitHub token
   - (Optional) **SerpAPI Key:** If you have it
3. Click **Save**

## Verification

After adding all tools, you should see:
- ✅ Document Parser
- ✅ GitHub Search
- ✅ Web Search
- ✅ Profile Analyzer

## Troubleshooting

### Tool not loading?
- Check file path is correct (use absolute path)
- Verify Python file exists
- Check class name matches exactly
- Ensure Python dependencies installed

### Import errors?
- Make sure virtual environment has all packages
- Check tool file imports are correct

---

**After tools are registered, proceed to workflow building!**

