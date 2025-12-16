# Manager Demo - Quick Setup & Presentation

## 🎯 Goal: Complete Setup & Demo in 20 Minutes

## ✅ What's Already Done

- ✅ Python environment ready
- ✅ All packages installed
- ✅ API keys configured
- ✅ Flowise installed
- ✅ Custom tools created

## 🚀 Quick Setup Steps (15 minutes)

### Step 1: Start Flowise (1 min)

```bash
npx flowise start
```

**Open:** http://localhost:3000

**Keep terminal open!**

### Step 2: Register Tools (5 min)

1. Open http://localhost:3000
2. Settings → Custom Tools
3. Add 4 tools (see DEMO_SETUP_COMPLETE.md)
4. Settings → Credentials → Add API keys

### Step 3: Build Simple Workflow (8 min)

**Minimal workflow for demo:**

```
Chat Input
  ↓
Document Parser Tool
  ↓
GitHub Search Tool (parallel)
Web Search Tool (parallel)
  ↓
Merge
  ↓
Profile Analyzer Tool
  ↓
Chat Output
```

### Step 4: Test (1 min)

Click **Test** in Flowise, paste job description, click **Run**

## 🎤 Demo Presentation Script

### Introduction (1 min)
"This system automates candidate search using AI agents. It:
- Parses job descriptions
- Searches GitHub and web
- Analyzes and ranks candidates
- Provides match scores and summaries"

### Live Demo (3 min)
1. Upload job description
2. Show workflow processing
3. Display results with match scores
4. Explain top candidates

### Key Features (2 min)
- Multi-agent architecture
- Production-ready code
- Security guardrails
- Scalable design

## 📊 Demo Options

### Option 1: Flowise UI Demo (Recommended)
- Visual workflow
- Real-time processing
- Interactive interface

### Option 2: Python Script Demo (Backup)
```bash
python demo.py
```
- Shows complete workflow
- Sample data
- No Flowise needed

### Option 3: API Demo
```bash
python run_api.py
# Then use API endpoints
```

## ✅ Pre-Demo Checklist

- [ ] Flowise running
- [ ] Tools registered
- [ ] Workflow built
- [ ] Test successful
- [ ] Sample job description ready
- [ ] Browser open to Flowise UI

## 🎯 Success Criteria

Demo is successful if:
- ✅ System processes job description
- ✅ Finds candidate profiles
- ✅ Shows match scores
- ✅ Generates summaries

---

**Follow DEMO_SETUP_COMPLETE.md for detailed steps!**

