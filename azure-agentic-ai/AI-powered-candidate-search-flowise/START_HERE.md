# 🚀 START HERE - Real-Time Execution Guide

Follow these steps in order to run the project with real APIs.

## ✅ Step-by-Step Checklist

### Phase 1: Prerequisites (5 minutes)

- [ ] **Step 1.1**: Check Node.js installed
  ```bash
  node --version
  ```
  If not installed: Download from https://nodejs.org/

- [ ] **Step 1.2**: Check Python installed
  ```bash
  python --version
  ```
  Should be 3.9+ (3.11 or 3.12 recommended)

### Phase 2: Install Flowise (2 minutes)

- [ ] **Step 2.1**: Install Flowise globally
  ```bash
  npm install -g flowise
  ```

- [ ] **Step 2.2**: Verify installation
  ```bash
  flowise --version
  ```

### Phase 3: Get API Keys (10 minutes)

- [ ] **Step 3.1**: Get OpenAI API Key
  - Go to: https://platform.openai.com/api-keys
  - Create account/login
  - Create new API key
  - Copy key (starts with `sk-...`)

- [ ] **Step 3.2**: Get GitHub Token
  - Go to: https://github.com/settings/tokens
  - Generate new token (classic)
  - Select: `public_repo`, `read:user`
  - Copy token (starts with `ghp_...`)

- [ ] **Step 3.3**: (Optional) Get SerpAPI Key
  - Go to: https://serpapi.com/
  - Sign up (free tier available)
  - Get API key

### Phase 4: Set Up Python Environment (5 minutes)

- [ ] **Step 4.1**: Navigate to project
  ```bash
  cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise
  ```

- [ ] **Step 4.2**: Create virtual environment
  ```bash
  python -m venv venv
  ```

- [ ] **Step 4.3**: Activate virtual environment
  ```bash
  # PowerShell
  venv\Scripts\Activate.ps1
  
  # CMD
  venv\Scripts\activate.bat
  
  # Git Bash
  source venv/Scripts/activate
  ```

- [ ] **Step 4.4**: Install packages
  ```bash
  python -m pip install --upgrade pip
  
  # Install pydantic first
  python -m pip install "pydantic>=2.9.0" --only-binary :all:
  python -m pip install "pydantic-settings>=2.6.0" --only-binary :all:
  
  # Install core packages
  python -m pip install python-dotenv requests httpx fastapi uvicorn loguru python-docx PyGithub litellm openai langchain langchain-openai tenacity tqdm pyyaml beautifulsoup4 aiohttp python-multipart
  ```

### Phase 5: Configure Environment (3 minutes)

- [ ] **Step 5.1**: Create .env file
  ```bash
  cp env.example .env
  ```

- [ ] **Step 5.2**: Edit .env file
  ```bash
  notepad .env
  ```
  
  Fill in:
  - `OPENAI_API_KEY=sk-your-key-here`
  - `GITHUB_TOKEN=ghp_your-token-here`
  - `SECRET_KEY=any-random-long-string`
  - (Optional) `SERPAPI_KEY=your-key`

### Phase 6: Start Flowise (1 minute)

- [ ] **Step 6.1**: Start Flowise server
  ```bash
  flowise start
  ```
  
  You should see: `Flowise server is running on http://localhost:3000`

- [ ] **Step 6.2**: Open Flowise UI
  - Open browser: http://localhost:3000
  - You should see Flowise interface

**Keep this terminal open!** Flowise must keep running.

### Phase 7: Set Up Tools in Flowise (5 minutes)

- [ ] **Step 7.1**: Open Flowise Settings
  - Click **Settings** (gear icon) → **Custom Tools**

- [ ] **Step 7.2**: Add Document Parser Tool
  - Name: `Document Parser`
  - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
  - Class: `DocumentParserTool`

- [ ] **Step 7.3**: Add GitHub Search Tool
  - Name: `GitHub Search`
  - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
  - Class: `GitHubSearchTool`

- [ ] **Step 7.4**: Add Web Search Tool
  - Name: `Web Search`
  - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
  - Class: `WebSearchTool`

- [ ] **Step 7.5**: Add Profile Analyzer Tool
  - Name: `Profile Analyzer`
  - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
  - Class: `ProfileAnalyzerTool`

- [ ] **Step 7.6**: Configure API Keys in Flowise
  - Go to **Settings** → **Credentials**
  - Add: OpenAI API Key, GitHub Token

### Phase 8: Build Workflow (10 minutes)

- [ ] **Step 8.1**: Create New Chatflow
  - Click **"New Chatflow"**
  - Name: `Candidate Search`

- [ ] **Step 8.2**: Add Nodes (see FLOWISE_WORKFLOW.md for details)
  1. Chat Input
  2. Document Parser Tool
  3. Split Node
  4. GitHub Search Tool (path 1)
  5. Web Search Tool (path 2)
  6. Merge Node
  7. Profile Analyzer Tool
  8. Chat Output

- [ ] **Step 8.3**: Connect Nodes
  - Connect nodes in order
  - Configure inputs/outputs

- [ ] **Step 8.4**: Save Workflow
  - Click **Save**
  - Note the Chatflow ID

### Phase 9: Test the System (5 minutes)

- [ ] **Step 9.1**: Test in Flowise UI
  - Click **Test** button
  - Upload job description
  - Click **Run**
  - View results

- [ ] **Step 9.2**: Test via Python
  ```bash
  # In new terminal (activate venv first)
  python main.py sample_job_description.txt
  ```

### Phase 10: Verify Everything Works

- [ ] Flowise running at http://localhost:3000
- [ ] Python environment activated
- [ ] .env file configured with API keys
- [ ] Custom tools registered in Flowise
- [ ] Workflow built and saved
- [ ] Test run successful

---

## 🎯 Quick Commands Reference

```bash
# Start Flowise
flowise start

# Activate Python environment
venv\Scripts\activate

# Run candidate search
python main.py job_description.docx

# Start API server
python run_api.py

# Test imports
python -c "from src.flowise_client import FlowiseClient; print('OK')"
```

---

## 📚 Detailed Guides

- **Complete Setup**: See `REAL_TIME_SETUP.md`
- **Workflow Building**: See `FLOWISE_WORKFLOW.md`
- **Troubleshooting**: See `INSTALL_TROUBLESHOOTING.md`
- **Quick Start**: See `QUICK_START_REALTIME.md`

---

## ⚠️ Common Issues

**Flowise not found?**
```bash
npm install -g flowise
```

**Python import errors?**
```bash
venv\Scripts\activate
pip install python-dotenv pydantic pydantic-settings requests httpx fastapi uvicorn loguru python-docx PyGithub litellm openai langchain langchain-openai
```

**API keys not working?**
- Check `.env` file exists and has correct keys
- Verify keys are valid (test in browser/API)

---

## 🚀 You're Ready!

Once all checkboxes are checked, you can:
1. Search for real candidates
2. Use the API endpoints
3. Integrate with your systems

**Good luck! 🎉**

