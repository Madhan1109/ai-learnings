# Real-Time Setup Guide - Complete Step-by-Step

This guide will help you set up and run the AI-Powered Candidate Search system with real API integrations.

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- [x] Python 3.9+ installed (✅ You have Python 3.13.9)
- [ ] Node.js 18+ installed (⚠️ You have Node.js 16.13.2 - needs upgrade)
- [ ] API keys ready (see Step 2)
- [ ] Internet connection

## 📋 Setup Progress Tracker

### Phase 1: Python Environment ✅ COMPLETED
- [x] Virtual environment created
- [x] pip upgraded
- [x] Pydantic installed (with pre-built wheels)
- [x] Core packages installed
- [x] Document processing packages installed
- [x] GitHub integration installed
- [x] LLM packages installed
- [x] Utilities installed
- [x] .env file created
- [x] Python imports verified

### Phase 2: Node.js Upgrade ⚠️ REQUIRED
- [ ] Node.js upgraded to 18+ (currently 16.13.2)

### Phase 3: API Keys Configuration ⏳ PENDING
- [ ] OpenAI API key obtained
- [ ] GitHub token obtained
- [ ] API keys added to .env file

### Phase 4: Flowise Installation ⏳ PENDING
- [ ] Flowise installed
- [ ] Flowise verified

### Phase 5: Flowise Setup ⏳ PENDING
- [ ] Flowise started
- [ ] Custom tools registered
- [ ] API keys configured in Flowise

### Phase 6: Workflow Building ⏳ PENDING
- [ ] Workflow created in Flowise UI
- [ ] Nodes connected
- [ ] Workflow saved

### Phase 7: Testing ⏳ PENDING
- [ ] Test in Flowise UI
- [ ] Test via Python script
- [ ] Verify results

---

## Step 1: Python Environment Setup ✅ COMPLETED

### Status: ✅ All Python packages installed successfully

**What was done:**
- Virtual environment created at `venv/`
- All required packages installed:
  - Core: python-dotenv, pydantic, pydantic-settings, requests, httpx, fastapi, uvicorn, loguru
  - Document: python-docx
  - GitHub: PyGithub
  - LLM: litellm, openai, langchain, langchain-openai
  - Utilities: tenacity, tqdm, pyyaml, beautifulsoup4, aiohttp, python-multipart
- .env file created from template
- Python imports verified

**To activate virtual environment:**
```bash
venv\Scripts\Activate.ps1
```

**To verify installation:**
```bash
python -c "from src.config import settings; print('✓ Python setup complete')"
```

---

## Step 2: Node.js Upgrade ⚠️ REQUIRED

### Current Status: Node.js 16.13.2 (needs 18+)

### Option A: Upgrade Node.js (Recommended - 5 minutes)

**Steps:**

1. **Download Node.js 20 LTS**
   - Go to: https://nodejs.org/
   - Click the **"LTS"** button (recommended)
   - Download Windows Installer (.msi)
   - Current LTS: Node.js 20.x

2. **Install Node.js**
   - Run the downloaded installer
   - Follow installation wizard
   - **Important**: Check "Automatically install necessary tools" if prompted
   - Complete installation

3. **Verify Installation**
   ```bash
   # Close and reopen terminal first!
   node --version
   ```
   Should show: `v20.x.x` or `v22.x.x`

4. **Verify npm**
   ```bash
   npm --version
   ```
   Should show version number

**If version still shows 16:**
- Close ALL terminal windows
- Restart computer (sometimes needed)
- Check PATH environment variable includes Node.js

### Option B: Use Docker (Alternative - No Node.js Upgrade)

If you can't upgrade Node.js, use Docker:

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop

2. **Run Flowise in Docker**
   ```bash
   docker run -d --name flowise -p 3000:3000 flowiseai/flowise
   ```

3. **Access Flowise**
   - Open: http://localhost:3000
   - Flowise runs in Docker (no Node.js upgrade needed)

4. **Stop/Start Flowise**
   ```bash
   docker stop flowise    # Stop
   docker start flowise    # Start
   docker logs flowise     # View logs
   ```

---

## Step 3: Get API Keys ⏳ ACTION REQUIRED

### 3.1 Get OpenAI API Key (Required)

**Steps:**

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Name it: "Candidate Search"
5. Click **"Create secret key"**
6. **IMPORTANT**: Copy the key immediately (starts with `sk-...`)
   - You won't be able to see it again!
7. Save it securely

**Free Tier Available:**
- OpenAI offers free credits for new accounts
- Check: https://platform.openai.com/usage

### 3.2 Get GitHub Personal Access Token (Required)

**Steps:**

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: "Candidate Search"
   - **Expiration**: Choose (90 days recommended)
4. **Select scopes:**
   - ✅ `public_repo` (Access public repositories)
   - ✅ `read:user` (Read user profile information)
5. Click **"Generate token"**
6. **IMPORTANT**: Copy the token immediately (starts with `ghp_...`)
   - You won't be able to see it again!
7. Save it securely

### 3.3 Get SerpAPI Key (Optional - for web search)

**Steps:**

1. Go to: https://serpapi.com/
2. Sign up (free tier available - 100 searches/month)
3. Go to dashboard
4. Copy API key
5. Save it

**Alternative: Google Custom Search API**
- Go to: https://console.cloud.google.com/
- Create project
- Enable "Custom Search API"
- Create API key
- Create Custom Search Engine: https://programmablesearchengine.google.com/
- Get CSE ID

### 3.4 Configure .env File

**Edit the .env file:**

```bash
notepad .env
```

**Fill in your API keys:**

```env
# LLM Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-actual-openai-key-here
# Remove the "your-actual-" part and paste your real key

# Or use Azure OpenAI (alternative):
# AZURE_OPENAI_API_KEY=your-azure-key
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name

# LitELLM Configuration (Optional)
LITELLM_HOST=http://localhost:4000
LITELLM_MODEL=gpt-4-turbo-preview

# Flowise Configuration
FLOWISE_HOST=http://localhost:3000

# GitHub Configuration (REQUIRED)
GITHUB_TOKEN=ghp_your-actual-github-token-here
# Remove the "your-actual-" part and paste your real token
GITHUB_USERNAME=your-github-username

# Web Search API (Optional - choose one)
SERPAPI_KEY=your-serpapi-key-here
# OR
# GOOGLE_API_KEY=your-google-api-key
# GOOGLE_CSE_ID=your-google-cse-id

# Application Configuration
LOG_LEVEL=INFO
MAX_CANDIDATES=10
SEARCH_TIMEOUT=30

# Security (REQUIRED - generate random string)
SECRET_KEY=your-random-secret-key-minimum-32-characters-long
# Example: openssl rand -hex 32
# Or use: python -c "import secrets; print(secrets.token_hex(32))"

ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output and paste as SECRET_KEY value.

**Verify .env file:**
```bash
# Check if keys are set (don't show actual values)
python -c "from src.config import settings; print('✓ .env loaded'); print(f'OpenAI key set: {bool(settings.openai_api_key)}'); print(f'GitHub token set: {bool(settings.github_token)}')"
```

---

## Step 4: Install Flowise ⏳ PENDING

### 4.1 Install Flowise (After Node.js Upgrade)

**After upgrading Node.js to 18+:**

```bash
# Install Flowise globally
npm install -g flowise

# Verify installation
flowise --version
```

**Expected output:** Version number (e.g., 1.x.x)

### 4.2 Alternative: Install via npx (No Global Install)

```bash
# Use npx (no installation needed)
npx flowise start
```

### 4.3 Troubleshooting Installation

**Issue: Permission errors**
```bash
# Windows: Run PowerShell as Administrator
npm install -g flowise
```

**Issue: npm not found**
- Reinstall Node.js
- Check "Add to PATH" during installation
- Restart terminal

---

## Step 5: Start Flowise Server ⏳ PENDING

### 5.1 Start Flowise

```bash
# Start Flowise
flowise start
```

**Expected output:**
```
Flowise server is running on http://localhost:3000
```

### 5.2 Verify Flowise is Running

1. Open browser: http://localhost:3000
2. You should see Flowise UI
3. If you see the interface, Flowise is running correctly

### 5.3 Keep Flowise Running

**Important:** Keep the terminal with Flowise running open!

- Flowise must stay running for the system to work
- Don't close the terminal
- If you close it, Flowise stops

**To stop Flowise:**
- Press `Ctrl+C` in the terminal
- Or close the terminal

**To start again:**
```bash
flowise start
```

---

## Step 6: Set Up Custom Tools in Flowise ⏳ PENDING

### 6.1 Open Flowise Settings

1. Open Flowise UI: http://localhost:3000
2. Click **Settings** (gear icon) in top right
3. Click **"Custom Tools"** tab

### 6.2 Register Document Parser Tool

1. Click **"Add Tool"** or **"+"** button
2. Fill in:
   - **Name**: `Document Parser`
   - **Path**: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
   - **Class**: `DocumentParserTool`
   - **Description**: "Parses job description documents and extracts information"
3. Click **Save**

### 6.3 Register GitHub Search Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name**: `GitHub Search`
   - **Path**: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
   - **Class**: `GitHubSearchTool`
   - **Description**: "Searches GitHub for developer profiles"
3. Click **Save**

### 6.4 Register Web Search Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name**: `Web Search`
   - **Path**: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
   - **Class**: `WebSearchTool`
   - **Description**: "Searches web for candidate profiles"
3. Click **Save**

### 6.5 Register Profile Analyzer Tool

1. Click **"Add Tool"**
2. Fill in:
   - **Name**: `Profile Analyzer`
   - **Path**: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
   - **Class**: `ProfileAnalyzerTool`
   - **Description**: "Analyzes and summarizes candidate profiles"
3. Click **Save**

### 6.6 Configure API Keys in Flowise

1. In Flowise UI, go to **Settings** → **Credentials**
2. Add credentials:
   - **OpenAI API Key**: Paste your OpenAI API key
   - **GitHub Token**: Paste your GitHub token
   - **SerpAPI Key**: (Optional) Paste if you have it
3. Click **Save**

---

## Step 7: Build Workflow in Flowise UI ⏳ PENDING

### 7.1 Create New Chatflow

1. In Flowise UI, click **"New Chatflow"** or **"+"** button
2. Name it: `Candidate Search`
3. Click **Create**

### 7.2 Add Nodes (Follow This Order)

#### Node 1: Chat Input
1. Drag **Chat Input** node to canvas
2. Configure:
   - **Name**: `Job Description Input`
   - **Input Type**: `File` or `Text`
   - **Placeholder**: `Upload job description or paste text`

#### Node 2: Document Parser Tool
1. Drag **Custom Tool** node to canvas
2. Connect from Chat Input node
3. Configure:
   - **Tool**: Select `Document Parser`
   - **Input Variable**: `file_path` (if file) or `text` (if text)
   - **Output Variable**: `extracted_info`

#### Node 3: Split Node (for parallel processing)
1. Drag **Conditional** or **Split** node
2. Connect from Document Parser
3. Configure to split into 2 parallel paths

#### Node 4: GitHub Search Tool
1. Drag **Custom Tool** node
2. Connect from Split node (first path)
3. Configure:
   - **Tool**: Select `GitHub Search`
   - **Input Variables**:
     - `keywords`: `{{extracted_info.experience_keywords}}`
     - `skills`: `{{extracted_info.technologies}}`
     - `min_repos`: `5`
   - **Output Variable**: `github_profiles`

#### Node 5: Web Search Tool
1. Drag **Custom Tool** node
2. Connect from Split node (second path)
3. Configure:
   - **Tool**: Select `Web Search`
   - **Input Variables**:
     - `query`: `{{extracted_info.experience_keywords}}`
     - `skills`: `{{extracted_info.technologies}}`
     - `location`: `{{extracted_info.location}}`
   - **Output Variable**: `web_profiles`

#### Node 6: Merge Node
1. Drag **Merge** or **Combine** node
2. Connect from both GitHub Search and Web Search nodes
3. Configure to combine:
   - `github_profiles` + `web_profiles` → `all_profiles`

#### Node 7: Profile Analyzer Tool
1. Drag **Custom Tool** node
2. Connect from Merge node
3. Configure:
   - **Tool**: Select `Profile Analyzer`
   - **Input Variables**:
     - `profiles`: `{{all_profiles}}`
     - `job_requirements`: `{{extracted_info}}`
   - **Output Variable**: `analyzed_profiles`

#### Node 8: Chat Output
1. Drag **Chat Output** node
2. Connect from Profile Analyzer
3. Configure:
   - **Output Format**: `JSON` or `Text`
   - **Template**: Customize as needed

### 7.3 Save Workflow

1. Click **Save** button (top right)
2. Note the Chatflow ID (you'll need this)
3. Workflow is now saved

### 7.4 Export Workflow (Optional)

1. Click **Export** button
2. Save as: `flowise/chatflows/candidate_search_flow.json`
3. This allows you to import it later

---

## Step 8: Test the System ⏳ PENDING

### 8.1 Test in Flowise UI

1. In Flowise, open your `Candidate Search` Chatflow
2. Click **Test** button
3. Upload a job description file (`.docx`) or paste text
4. Click **Run**
5. View results in the output

**Expected:** You should see candidate profiles with match scores

### 8.2 Test via Python Script

**Prepare test file:**

Create or use `sample_job_description.txt` (already exists)

**Run test:**

```bash
# Activate virtual environment
venv\Scripts\Activate.ps1

# Run candidate search
python main.py sample_job_description.txt
```

**Expected output:**
- Job requirements extracted
- GitHub profiles found
- Web profiles found
- Analyzed profiles with match scores
- Results saved to `results/` directory

### 8.3 Test via API (Optional)

**Start API server:**

```bash
# In new terminal (keep Flowise running in first terminal)
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise
venv\Scripts\Activate.ps1
python run_api.py
```

**Test API:**

```bash
# Upload job description
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@sample_job_description.txt"

# Get results (replace {job_id} with actual ID)
curl "http://localhost:8000/api/v1/search/{job_id}"
```

**Or use browser:**
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

---

## Step 9: Verify Everything Works ✅

### 9.1 Checklist

- [ ] Flowise running at http://localhost:3000
- [ ] Python virtual environment activated
- [ ] .env file configured with API keys
- [ ] Custom tools registered in Flowise
- [ ] Workflow built and saved in Flowise
- [ ] Test run successful
- [ ] Results generated correctly

### 9.2 Verification Commands

```bash
# Check Python setup
venv\Scripts\Activate.ps1
python -c "from src.config import settings; print('✓ Config loaded')"
python -c "from src.flowise_client import FlowiseClient; print('✓ Flowise client works')"

# Check Flowise
flowise --version
# Or check in browser: http://localhost:3000

# Check .env
python -c "from src.config import settings; print(f'OpenAI key: {bool(settings.openai_api_key)}'); print(f'GitHub token: {bool(settings.github_token)}')"
```

---

## Troubleshooting

### Issue: Flowise not starting
**Solution:**
- Check Node.js version: `node --version` (should be 18+)
- Check port 3000 is free: `netstat -an | findstr 3000`
- Try different port: `flowise start --PORT=3001`

### Issue: Custom tools not loading
**Solution:**
- Verify file paths are correct (use absolute paths)
- Check Python dependencies installed
- Verify tool files exist
- Check tool class names match

### Issue: API errors
**Solution:**
- Verify API keys in `.env` file
- Test keys individually:
  - OpenAI: https://platform.openai.com/api-keys
  - GitHub: https://github.com/settings/tokens
- Check keys are not expired
- Verify network connectivity

### Issue: Import errors
**Solution:**
- Activate virtual environment: `venv\Scripts\Activate.ps1`
- Reinstall packages: `pip install -r requirements-minimal.txt`
- Check Python version: `python --version`

### Issue: GitHub API rate limit
**Solution:**
- Use GitHub Personal Access Token (higher limits)
- Reduce `MAX_CANDIDATES` in config
- Wait for rate limit to reset

---

## Quick Reference Commands

```bash
# Activate virtual environment
venv\Scripts\Activate.ps1

# Start Flowise
flowise start

# Run candidate search
python main.py job_description.docx

# Start API server
python run_api.py

# Test imports
python -c "from src.flowise_client import FlowiseClient; print('OK')"

# Check Node.js version
node --version

# Check Flowise version
flowise --version
```

---

## Next Steps After Setup

1. **Customize Workflow**
   - Modify nodes in Flowise UI
   - Adjust scoring algorithm
   - Add new tools

2. **Production Deployment**
   - See `DEPLOYMENT.md` for production setup
   - Set up database for job storage
   - Configure monitoring

3. **Extend Functionality**
   - Add more search sources
   - Enhance matching algorithm
   - Add email notifications

---

## Summary

### ✅ Completed
- Python environment setup
- All Python packages installed
- .env file created

### ⏳ Remaining Steps
1. Upgrade Node.js to 18+ (or use Docker)
2. Get API keys (OpenAI, GitHub)
3. Configure .env file with API keys
4. Install Flowise
5. Start Flowise server
6. Register custom tools in Flowise
7. Build workflow in Flowise UI
8. Test the system

### 🎯 Estimated Time
- Node.js upgrade: 5 minutes
- Get API keys: 10 minutes
- Configure .env: 2 minutes
- Install Flowise: 2 minutes
- Set up tools: 5 minutes
- Build workflow: 10 minutes
- Testing: 5 minutes

**Total: ~40 minutes**

---

**You're almost there! Follow the steps above to complete the setup.**

For detailed workflow building, see: `FLOWISE_WORKFLOW.md`
