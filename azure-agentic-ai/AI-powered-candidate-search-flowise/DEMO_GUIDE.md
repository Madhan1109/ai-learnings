# Demo Guide - AI-Powered Candidate Search

## Quick Demo (No Setup Required)

Run the demo script to see the system in action:

```bash
python demo.py
```

This will show:
1. ✅ Document parsing
2. ✅ GitHub search results
3. ✅ Web/LinkedIn search results
4. ✅ Profile analysis and scoring
5. ✅ Final results summary

**No API keys or Flowise needed for this demo!**

## What the Demo Shows

### Step 1: Document Parsing
- Extracts skills, technologies, and requirements from job description
- Shows structured data extraction

### Step 2: GitHub Search
- Simulated GitHub profile search
- Shows matching developer profiles
- Displays repositories, stars, and skills

### Step 3: Web/LinkedIn Search
- Simulated professional profile search
- Shows experience, skills, and qualifications

### Step 4: Profile Analysis
- Calculates match scores
- Generates summaries
- Provides recommendations

### Step 5: Final Results
- Combines all results
- Ranks candidates by match score
- Saves to JSON file

## Demo Output

The demo will show:
```
================================================================================
  AI-POWERED CANDIDATE SEARCH - DEMO
================================================================================

================================================================================
  DEMO: Document Parser
================================================================================
📄 Job Description Parsed:
   Title: Technical Architect
   Location: Chennai, Tamil Nadu
   Skills Required: AWS, Azure, Python, Docker, Kubernetes
   ...

================================================================================
  DEMO: GitHub Search Results
================================================================================
🔍 Found 3 GitHub profiles:
   1. Rajesh Kumar (@dev_architect_001)
      Languages: Python, JavaScript, Go
      ...
```

## For Live Demo (With Real APIs)

### Option 1: Quick Setup
```bash
# 1. Install minimal requirements
pip install -r requirements-minimal.txt

# 2. Create .env file
cp env.example .env
# Edit .env with your API keys

# 3. Run demo
python demo.py
```

### Option 2: Full Setup with Flowise
```bash
# 1. Install Flowise
npm install -g flowise

# 2. Start Flowise
flowise start

# 3. Install Python packages
pip install -r requirements-minimal.txt

# 4. Set up .env file
cp env.example .env
# Edit with API keys

# 5. Build workflow in Flowise UI (http://localhost:3000)
# Follow FLOWISE_WORKFLOW.md

# 6. Run with real data
python main.py sample_job_description.docx
```

## Demo Presentation Tips

### 1. Start with Demo Script
```bash
python demo.py
```
Shows the complete workflow without any setup.

### 2. Explain the Architecture
- Show the 5-step workflow
- Explain each component
- Highlight the multi-agent approach

### 3. Show Code Structure
```bash
# Show project structure
tree /F src/
tree /F flowise/
```

### 4. Demonstrate Features
- Document parsing accuracy
- Multi-source search (GitHub + Web)
- Intelligent matching and scoring
- Professional summaries

### 5. Show Results
- Open the generated JSON file
- Show match scores
- Explain recommendations

## Demo Scripts

### Simple Demo (Current)
- `demo.py` - Shows complete workflow with sample data

### Interactive Demo (Future)
- Can be extended to accept user input
- Can show real-time processing
- Can integrate with Flowise UI

## Customizing the Demo

Edit `demo.py` to:
- Change sample job descriptions
- Add more candidate profiles
- Modify scoring algorithm
- Customize output format

## Troubleshooting Demo

### Issue: Import errors
```bash
# Install minimal requirements
pip install python-dotenv loguru
```

### Issue: Results directory not found
```bash
# Create results directory
mkdir results
```

### Issue: Logs directory not found
```bash
# Create logs directory
mkdir logs
```

## Next Steps After Demo

1. **Set up real environment**
   - Install Flowise
   - Configure API keys
   - Build workflow

2. **Test with real data**
   - Use actual job descriptions
   - Test with real GitHub profiles
   - Validate results

3. **Customize for your needs**
   - Modify tools
   - Adjust scoring
   - Add new features

---

**Ready to demo! Run `python demo.py` to see it in action!**

