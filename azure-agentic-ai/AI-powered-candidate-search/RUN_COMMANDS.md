# Terminal Commands to Run the System

## Quick Run Commands

### Option 1: Run with Your Job Description File

**For PowerShell:**
```powershell
# Navigate to project directory
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search

# Activate virtual environment
venv\Scripts\Activate.ps1

# Run with your job description
python main.py "M:\Downloads\Technical Architect Job Description.docx"
```

**For Git Bash / MINGW64:**
```bash
# Navigate to project directory
cd /c/ai-learnings/ai-learnings/azure-agentic-ai/AI-powered-candidate-search

# Activate virtual environment
source venv/Scripts/activate

# Run with your job description
python main.py "/m/Downloads/Technical Architect Job Description.docx"
```

### Option 2: Run with Sample Job Description

**For PowerShell:**
```powershell
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
venv\Scripts\Activate.ps1
python main.py sample_job_description.docx
```

**For Git Bash:**
```bash
cd /c/ai-learnings/ai-learnings/azure-agentic-ai/AI-powered-candidate-search
source venv/Scripts/activate
python main.py sample_job_description.docx
```

### Option 3: Start API Server (Interactive Demo)

```powershell
# Terminal 1: Start API Server
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
venv\Scripts\Activate.ps1
python run_api.py

# Terminal 2: Use API (after server starts)
# Open browser: http://localhost:8000/docs
# Or use curl:
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@M:\Downloads\Technical Architect Job Description.docx"
```

## One-Line Commands

### Windows PowerShell (One Line)
```powershell
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search; venv\Scripts\Activate.ps1; python main.py "M:\Downloads\Technical Architect Job Description.docx"
```

### Git Bash (One Line)
```bash
cd /c/ai-learnings/ai-learnings/azure-agentic-ai/AI-powered-candidate-search && source venv/Scripts/activate && python main.py "/m/Downloads/Technical Architect Job Description.docx"
```

## Verify Setup First

```powershell
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
venv\Scripts\Activate.ps1
python verify_setup.py
```

## Expected Output

After running, you should see:
- Document parsing progress
- GitHub search results
- Web/LinkedIn search results
- Profile analysis
- Final results summary
- Results saved to `results\` directory

