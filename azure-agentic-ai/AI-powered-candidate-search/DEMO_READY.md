# 🚀 CrewAI Demo Ready - Real-Time Execution

## ✅ Setup Complete!

- ✅ Virtual environment created
- ✅ All dependencies installed
- ✅ API keys configured (OpenAI + GitHub)
- ✅ Windows compatibility fixes applied
- ✅ System ready for real-time demo

## 🎯 Run Real-Time Demo

### Option 1: Command Line (Recommended)

```bash
# Activate environment
venv\Scripts\Activate.ps1

# Run with sample job description
python main.py sample_job_description.docx
```

### Option 2: API Server

```bash
# Terminal 1: Start API server
venv\Scripts\Activate.ps1
python run_api.py

# Terminal 2: Upload job description
curl -X POST "http://localhost:8000/api/v1/search/upload" -F "file=@sample_job_description.docx"
```

Or open: http://localhost:8000/docs for interactive API documentation

## 📊 What the Demo Shows

1. **Document Parsing**
   - Extracts skills, technologies, experience requirements
   - Identifies location, job type, keywords

2. **GitHub Search**
   - Searches GitHub for matching developer profiles
   - Finds repositories, contributions, skills

3. **Web/LinkedIn Search**
   - Searches web and LinkedIn for professional profiles
   - Finds candidate experience and skills

4. **Profile Analysis**
   - Analyzes all candidate profiles
   - Calculates match scores
   - Generates summaries with key highlights

5. **Results**
   - Top candidates ranked by match score
   - Detailed summaries
   - Recommendations

## 🎤 Demo Presentation Points

**Opening:**
"This is a production-ready AI-Powered Candidate Search system using CrewAI multi-agent framework."

**Key Features:**
- ✅ Multi-agent architecture (4 specialized agents)
- ✅ AI Gateway (LitELLM) for LLM routing
- ✅ Guardrails for security
- ✅ External API integrations (GitHub, Web, LinkedIn)
- ✅ Production-ready code

**Live Demo:**
1. Run the system with a job description
2. Show real-time processing
3. Display results with match scores
4. Explain the workflow

## 📁 Important Files

- `main.py` - CLI entry point
- `run_api.py` - API server
- `sample_job_description.docx` - Sample input
- `results/` - Output directory

## ✅ Pre-Demo Checklist

- [ ] Virtual environment activated
- [ ] API keys configured in .env
- [ ] Sample job description ready
- [ ] System tested successfully

---

**You're ready for the real-time demo! 🚀**

Run: `python main.py sample_job_description.docx`

