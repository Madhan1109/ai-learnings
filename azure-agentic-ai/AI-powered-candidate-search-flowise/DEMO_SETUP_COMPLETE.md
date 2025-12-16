# Demo Setup - Complete Guide for Manager Presentation

## ✅ Setup Status

### Completed
- ✅ Python environment ready
- ✅ All packages installed
- ✅ API keys configured (OpenAI + GitHub)
- ✅ Flowise starting
- ✅ Custom tools ready

### Next Steps (15 minutes)

## Step 1: Verify Flowise is Running

1. **Open browser:** http://localhost:3000
2. **You should see:** Flowise UI interface
3. **If not running:** Run `npx flowise start` in terminal

## Step 2: Register Custom Tools (5 minutes)

### In Flowise UI (http://localhost:3000):

1. **Click Settings** (gear icon) → **Custom Tools**

2. **Add Tool 1: Document Parser**
   - Click **"Add Tool"**
   - **Name:** `Document Parser`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
   - **Class:** `DocumentParserTool`
   - Click **Save**

3. **Add Tool 2: GitHub Search**
   - Click **"Add Tool"**
   - **Name:** `GitHub Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
   - **Class:** `GitHubSearchTool`
   - Click **Save**

4. **Add Tool 3: Web Search**
   - Click **"Add Tool"**
   - **Name:** `Web Search`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
   - **Class:** `WebSearchTool`
   - Click **Save**

5. **Add Tool 4: Profile Analyzer**
   - Click **"Add Tool"**
   - **Name:** `Profile Analyzer`
   - **Path:** `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
   - **Class:** `ProfileAnalyzerTool`
   - Click **Save**

6. **Add API Keys in Flowise:**
   - Go to **Settings** → **Credentials**
   - Add:
     - **OpenAI API Key:** (your key)
     - **GitHub Token:** (your token)
   - Click **Save**

## Step 3: Build Workflow (10 minutes)

### Create New Chatflow

1. Click **"New Chatflow"** or **"+"** button
2. Name: `Candidate Search`
3. Click **Create**

### Add Nodes (In This Order)

**Node 1: Chat Input**
- Drag **Chat Input** node
- Configure: Accept text or file input

**Node 2: Document Parser**
- Drag **Custom Tool** node
- Select: `Document Parser`
- Connect from Chat Input
- Input: `text` or `file_path`

**Node 3: LLM Chain (Optional but Recommended)**
- Drag **LLM Chain** node
- Connect from Document Parser
- Model: OpenAI GPT-4 (via credentials)
- Prompt: "Extract and structure the job requirements from: {{extracted_info}}"
- This enhances the extraction

**Node 4: Split**
- Drag **Conditional** or **Split** node
- Connect from Document Parser (or LLM Chain)
- Split into 2 parallel paths

**Node 5: GitHub Search**
- Drag **Custom Tool** node
- Select: `GitHub Search`
- Connect from Split (path 1)
- Inputs:
  - `keywords`: `{{extracted_info.experience_keywords}}`
  - `skills`: `{{extracted_info.technologies}}`
  - `min_repos`: `5`

**Node 6: Web Search**
- Drag **Custom Tool** node
- Select: `Web Search`
- Connect from Split (path 2)
- Inputs:
  - `query`: `{{extracted_info.experience_keywords}}`
  - `skills`: `{{extracted_info.technologies}}`

**Node 7: Merge**
- Drag **Merge** node
- Connect from both GitHub Search and Web Search
- Combine: `github_profiles` + `web_profiles` → `all_profiles`

**Node 8: Profile Analyzer**
- Drag **Custom Tool** node
- Select: `Profile Analyzer`
- Connect from Merge
- Inputs:
  - `profiles`: `{{all_profiles}}`
  - `job_requirements`: `{{extracted_info}}`

**Node 9: LLM Summarizer (Optional)**
- Drag **LLM Chain** node
- Connect from Profile Analyzer
- Model: OpenAI GPT-4
- Prompt: "Summarize these candidate profiles with key highlights: {{analyzed_profiles}}"

**Node 10: Chat Output**
- Drag **Chat Output** node
- Connect from Profile Analyzer (or LLM Summarizer)
- Configure output format

### Save Workflow

1. Click **Save** button (top right)
2. Note the Chatflow ID

## Step 4: Test Before Demo (5 minutes)

### Test in Flowise UI

1. Open your `Candidate Search` Chatflow
2. Click **Test** button
3. Paste this sample job description:

```
Technical Architect Job Description

Location: Chennai, Tamil Nadu
Job Type: Full-Time

We are hiring a Technical Architect to design scalable IT solutions.

Required Skills:
- Cloud: AWS, Azure, or GCP
- Architecture: Microservices, API Design
- DevOps: Docker, Kubernetes, CI/CD
- Programming: Java, Python, C#, JavaScript
- Experience: 7+ years in tech, 3+ in architecture
```

4. Click **Run**
5. Wait for results
6. Verify you see candidate profiles

### Test via Python

```bash
venv\Scripts\Activate.ps1
python main.py sample_job_description.txt
```

## Step 5: Prepare for Demo

### Demo Script

**Opening:**
"This is an AI-Powered Candidate Search system that automates finding and evaluating candidates."

**Show:**
1. Upload job description
2. System extracts requirements
3. Searches GitHub and web
4. Analyzes and ranks candidates
5. Shows results with match scores

### Demo Flow

1. **Start Flowise** (if not running)
   ```bash
   npx flowise start
   ```

2. **Open Flowise UI:** http://localhost:3000

3. **Show Workflow:**
   - Point out the visual workflow
   - Explain each node
   - Show how data flows

4. **Run Live Demo:**
   - Upload a real job description
   - Show real-time processing
   - Display results

5. **Show Results:**
   - Match scores
   - Candidate summaries
   - Key highlights

### Backup: Use Demo Script

If Flowise has issues, use the demo script:

```bash
python demo.py
```

This shows the complete workflow with sample data.

## Quick Demo Checklist

- [ ] Flowise running at http://localhost:3000
- [ ] All 4 tools registered
- [ ] Workflow built and saved
- [ ] Test run successful
- [ ] Sample job description ready
- [ ] Results directory has sample outputs

## Troubleshooting for Demo

### If Flowise Not Working:
- Use demo script: `python demo.py`
- Shows complete workflow with sample data

### If Tools Not Loading:
- Check file paths are correct
- Verify Python dependencies installed
- Check tool class names

### If API Errors:
- Verify API keys in .env
- Check keys are valid
- Test keys individually

## Demo Presentation Points

1. **Automation:** Entire process automated
2. **Multi-Source:** Searches GitHub + Web
3. **AI-Powered:** Intelligent matching
4. **Production-Ready:** Security, error handling
5. **Scalable:** Can handle multiple searches

## Files for Demo

- `demo.py` - Demo script (works without Flowise)
- `sample_job_description.txt` - Sample job description
- `results/demo_results_*.json` - Sample results

---

**You're ready for the demo! Follow the steps above to complete setup.**

