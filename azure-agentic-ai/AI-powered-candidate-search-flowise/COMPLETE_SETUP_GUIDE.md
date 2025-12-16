# Complete Real-Time Setup Guide - FINAL VERSION

## 🎯 Current Status: 70% Complete

### ✅ What's Done

1. **Python Environment** ✅
   - Python 3.13.9 installed
   - Virtual environment created
   - All packages installed
   - Imports verified

2. **Configuration** ✅
   - .env file created
   - SECRET_KEY generated: `cab0de21f79e1d065a6817047ddec552aec7f9c8ff966ec40e724cabebcea763`
   - Template ready for API keys

3. **Flowise** ✅
   - Flowise 3.0.12 installed
   - Works with `npx flowise start` (Node.js 16 compatible)

### ⏳ What's Remaining

1. Add API keys to .env
2. Start Flowise server
3. Register custom tools
4. Build workflow
5. Test system

---

## 📝 Step-by-Step Completion Guide

### STEP 1: Get API Keys (10 minutes)

#### 1.1 Get OpenAI API Key

1. **Go to:** https://platform.openai.com/api-keys
2. **Sign up/Login**
3. **Click:** "Create new secret key"
4. **Name it:** "Candidate Search"
5. **Copy the key** (starts with `sk-...`)
   - ⚠️ Copy immediately - you won't see it again!

#### 1.2 Get GitHub Personal Access Token

1. **Go to:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Fill in:**
   - Note: "Candidate Search"
   - Expiration: 90 days (or your preference)
4. **Select scopes:**
   - ✅ `public_repo`
   - ✅ `read:user`
5. **Click:** "Generate token"
6. **Copy the token** (starts with `ghp_...`)
   - ⚠️ Copy immediately - you won't see it again!

### STEP 2: Configure .env File (2 minutes)

```bash
notepad .env
```

**Update these lines with your actual keys:**

```env
# Replace these:
OPENAI_API_KEY=sk-your-actual-openai-key-here
GITHUB_TOKEN=ghp_your-actual-github-token-here

# SECRET_KEY is already set:
SECRET_KEY=cab0de21f79e1d065a6817047ddec552aec7f9c8ff966ec40e724cabebcea763
```

**Save and close**

**Verify:**
```bash
python -c "from src.config import settings; print('OpenAI:', 'Set' if settings.openai_api_key and 'your' not in settings.openai_api_key else 'Not Set'); print('GitHub:', 'Set' if settings.github_token and 'your' not in settings.github_token else 'Not Set')"
```

### STEP 3: Start Flowise (1 minute)

```bash
npx flowise start
```

**Expected output:**
```
Flowise server is running on http://localhost:3000
```

**Verify:**
- Open browser: http://localhost:3000
- You should see Flowise UI

**Keep this terminal open!**

### STEP 4: Register Custom Tools (5 minutes)

1. **Open Flowise UI:** http://localhost:3000

2. **Go to Settings:**
   - Click **Settings** (gear icon) → **Custom Tools**

3. **Add Tool 1: Document Parser**
   - Click **"Add Tool"** or **"+"**
   - **Name:** `Document Parser`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
   - **Class:** `DocumentParserTool`
   - Click **Save**

4. **Add Tool 2: GitHub Search**
   - Click **"Add Tool"**
   - **Name:** `GitHub Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
   - **Class:** `GitHubSearchTool`
   - Click **Save**

5. **Add Tool 3: Web Search**
   - Click **"Add Tool"**
   - **Name:** `Web Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
   - **Class:** `WebSearchTool`
   - Click **Save**

6. **Add Tool 4: Profile Analyzer**
   - Click **"Add Tool"**
   - **Name:** `Profile Analyzer`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
   - **Class:** `ProfileAnalyzerTool`
   - Click **Save**

7. **Configure API Keys in Flowise:**
   - Go to **Settings** → **Credentials**
   - Add:
     - **OpenAI API Key:** Your OpenAI key
     - **GitHub Token:** Your GitHub token
   - Click **Save**

### STEP 5: Build Workflow (10 minutes)

1. **Create New Chatflow:**
   - Click **"New Chatflow"** or **"+"**
   - Name: `Candidate Search`
   - Click **Create**

2. **Add Nodes (in order):**

   **Node 1: Chat Input**
   - Drag **Chat Input** node
   - Configure: Accept file or text

   **Node 2: Document Parser**
   - Drag **Custom Tool** node
   - Select: `Document Parser`
   - Connect from Chat Input
   - Input: `file_path` or `text`

   **Node 3: Split**
   - Drag **Conditional** or **Split** node
   - Connect from Document Parser
   - Split into 2 paths

   **Node 4: GitHub Search**
   - Drag **Custom Tool** node
   - Select: `GitHub Search`
   - Connect from Split (path 1)
   - Inputs:
     - `keywords`: `{{extracted_info.experience_keywords}}`
     - `skills`: `{{extracted_info.technologies}}`

   **Node 5: Web Search**
   - Drag **Custom Tool** node
   - Select: `Web Search`
   - Connect from Split (path 2)
   - Inputs:
     - `query`: `{{extracted_info.experience_keywords}}`
     - `skills`: `{{extracted_info.technologies}}`

   **Node 6: Merge**
   - Drag **Merge** node
   - Connect from both GitHub and Web Search
   - Combine: `github_profiles` + `web_profiles` → `all_profiles`

   **Node 7: Profile Analyzer**
   - Drag **Custom Tool** node
   - Select: `Profile Analyzer`
   - Connect from Merge
   - Inputs:
     - `profiles`: `{{all_profiles}}`
     - `job_requirements`: `{{extracted_info}}`

   **Node 8: Chat Output**
   - Drag **Chat Output** node
   - Connect from Profile Analyzer
   - Configure output format

3. **Save Workflow:**
   - Click **Save** button
   - Note the Chatflow ID

**Detailed guide:** See `FLOWISE_WORKFLOW.md`

### STEP 6: Test the System (5 minutes)

#### Test Option 1: Flowise UI

1. In Flowise, open your `Candidate Search` Chatflow
2. Click **Test** button
3. Upload `sample_job_description.txt` or paste text
4. Click **Run**
5. View results

#### Test Option 2: Python Script

```bash
# Activate virtual environment
venv\Scripts\Activate.ps1

# Run test
python main.py sample_job_description.txt
```

**Expected output:**
- Job requirements extracted
- GitHub profiles found
- Web profiles found
- Analyzed profiles with match scores
- Results saved to `results/` directory

#### Test Option 3: API (Optional)

```bash
# Start API server (in new terminal)
venv\Scripts\Activate.ps1
python run_api.py

# Test API
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@sample_job_description.txt"
```

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] Flowise running at http://localhost:3000
- [ ] .env file has real API keys (not placeholders)
- [ ] All 4 custom tools registered in Flowise
- [ ] API keys added in Flowise Credentials
- [ ] Workflow built and saved
- [ ] Test run successful
- [ ] Results generated correctly

**Verify commands:**
```bash
# Check Python
venv\Scripts\Activate.ps1
python -c "from src.config import settings; print('✓ Config OK')"

# Check Flowise
npx flowise --version

# Check .env
python -c "from src.config import settings; print('OpenAI:', 'Set' if settings.openai_api_key and len(settings.openai_api_key) > 20 else 'Not Set')"
```

---

## 🚀 Quick Start Commands

```bash
# Start Flowise
npx flowise start

# Activate Python environment
venv\Scripts\Activate.ps1

# Run candidate search
python main.py sample_job_description.txt

# Start API server
python run_api.py

# Generate SECRET_KEY (if needed)
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 📊 Progress Summary

| Phase | Status | Time |
|-------|--------|------|
| Python Setup | ✅ Complete | Done |
| Configuration | ✅ Complete | Done |
| Flowise Install | ✅ Complete | Done |
| API Keys | ⏳ Pending | 10 min |
| Flowise Start | ⏳ Pending | 1 min |
| Tools Setup | ⏳ Pending | 5 min |
| Workflow Build | ⏳ Pending | 10 min |
| Testing | ⏳ Pending | 5 min |

**Total Remaining: ~31 minutes**

---

## 🎯 Next Immediate Actions

1. **Get API keys** (OpenAI + GitHub)
2. **Edit .env file** with your keys
3. **Start Flowise:** `npx flowise start`
4. **Register tools** in Flowise UI
5. **Build workflow** in Flowise UI
6. **Test:** `python main.py sample_job_description.txt`

---

## 📚 Reference Documents

- **Complete Setup:** `REAL_TIME_SETUP.md`
- **Workflow Building:** `FLOWISE_WORKFLOW.md`
- **Quick Start:** `NEXT_STEPS.md`
- **Troubleshooting:** `INSTALL_TROUBLESHOOTING.md`
- **Start Flowise:** `START_FLOWISE.md`

---

## 🎉 You're Almost There!

**70% complete!** Just need to:
1. Add API keys (10 min)
2. Set up Flowise tools (5 min)
3. Build workflow (10 min)
4. Test (5 min)

**Total: ~30 minutes to go!**

---

**Follow the steps above and you'll be running real-time candidate search! 🚀**

