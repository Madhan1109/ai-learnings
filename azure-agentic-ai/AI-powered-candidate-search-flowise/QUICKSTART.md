# Quick Start Guide - Flowise Version

## 5-Minute Setup

### Step 1: Install Flowise

```bash
npm install -g flowise
```

### Step 2: Install Python Dependencies

```bash
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Copy and edit .env file
cp .env.example .env
# Add your API keys:
# - OPENAI_API_KEY
# - GITHUB_TOKEN
# - SECRET_KEY
```

### Step 4: Start Flowise

```bash
flowise start
```

Flowise UI will be available at: `http://localhost:3000`

### Step 5: Set Up Custom Tools

```bash
python setup_flowise_tools.py
```

Then in Flowise UI:
1. Go to **Settings** → **Custom Tools**
2. Add tools from `flowise/custom_tools/`

### Step 6: Import or Build Workflow

**Option A: Build in UI**
- Follow `FLOWISE_WORKFLOW.md` to build workflow manually

**Option B: Import (if available)**
- Import from `flowise/chatflows/candidate_search_flow.json`

### Step 7: Test

**Via Flowise UI:**
1. Open your Chatflow
2. Click **Test**
3. Upload job description
4. View results

**Via Python:**
```bash
python main.py sample_job_description.docx
```

**Via API:**
```bash
python run_api.py
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@job_description.docx"
```

## What's Different from CrewAI Version?

| Feature | CrewAI | Flowise |
|---------|--------|---------|
| Setup | Code-based | Visual UI |
| Workflow | Python code | Drag-and-drop |
| Customization | Edit code | Edit in UI |
| Learning Curve | Higher | Lower |

## Next Steps

- Read `FLOWISE_SETUP.md` for detailed setup
- Read `FLOWISE_WORKFLOW.md` for workflow configuration
- Customize workflow in Flowise UI

---

**Ready to search for candidates!**

