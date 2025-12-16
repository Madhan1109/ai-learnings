# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Step 2: Configure API Keys

Create `.env` file:

```env
OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
SECRET_KEY=any_random_string
```

### Step 3: Run the Application

**Option A: Command Line**
```bash
python main.py sample_job_description.docx
```

**Option B: API Server**
```bash
# Terminal 1: Start API
python run_api.py

# Terminal 2: Upload job description
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@sample_job_description.docx"
```

## What Happens?

1. ✅ System parses your job description
2. ✅ Searches GitHub for matching developers
3. ✅ Searches web/LinkedIn for professionals
4. ✅ Analyzes and ranks candidates
5. ✅ Returns summarized results with match scores

## Expected Output

```
CANDIDATE SEARCH RESULTS
================================================================================

Total candidates found: 15
GitHub candidates: 8
Web/LinkedIn candidates: 7

--------------------------------------------------------------------------------

Candidate 1:
  Match Score: 85/100
  Recommendation: Strong Match
  Summary: John Doe is a professional developer with expertise in Python, AWS...
  Highlights: High GitHub activity with 150 stars, Active contributor...
```

## Next Steps

- Read `README.md` for detailed documentation
- Check `API.md` for API usage
- Review `ARCHITECTURE.md` for system design
- Customize `config.yaml` for your needs

## Troubleshooting

**"Module not found" error?**
→ Activate virtual environment: `venv\Scripts\activate`

**"API key invalid" error?**
→ Check your `.env` file has correct keys

**"LitELLM connection failed"?**
→ Optional - system works without it, or run: `python start_litellm.py`

## Need Help?

Check the logs in `logs/candidate_search.log` for detailed error messages.

