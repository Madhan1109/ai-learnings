# Fix Encoding Error - Windows Console

## Problem
```
[CrewAIEventsBus] Sync handler error: 'charmap' codec can't encode character '\U0001f680'
```

This happens because Windows console doesn't support Unicode emojis by default.

## Solutions

### Solution 1: Use the Fixed Code (Already Applied)
The code has been updated to:
- Set UTF-8 encoding automatically
- Disable verbose output (which includes emojis)
- Handle encoding errors gracefully

### Solution 2: Set Environment Variable Before Running

**PowerShell:**
```powershell
$env:PYTHONIOENCODING="utf-8"
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
venv\Scripts\Activate.ps1
python main.py "M:\Downloads\Technical Architect Job Description.docx"
```

**Git Bash:**
```bash
export PYTHONIOENCODING=utf-8
cd /c/ai-learnings/ai-learnings/azure-agentic-ai/AI-powered-candidate-search
source venv/Scripts/activate
python main.py "/m/Downloads/Technical Architect Job Description.docx"
```

**CMD:**
```cmd
set PYTHONIOENCODING=utf-8
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
venv\Scripts\activate
python main.py "M:\Downloads\Technical Architect Job Description.docx"
```

### Solution 3: Use Batch Script
```cmd
run_with_utf8.bat
```

### Solution 4: Configure Windows Terminal (Permanent Fix)

1. Open Windows Terminal Settings
2. Go to your profile (PowerShell/CMD)
3. Add to "Additional settings" → "Environment variables":
   ```
   PYTHONIOENCODING=utf-8
   ```

## What Was Fixed

1. ✅ Added UTF-8 encoding configuration in `main.py`
2. ✅ Set `verbose=False` in all Crew instances (reduces emoji output)
3. ✅ Added graceful error handling for encoding issues
4. ✅ Created batch script for easy execution

## Note

The errors are **warnings only** and don't stop execution. The system will still work, but you may see these warnings. The fixes above will eliminate them.

