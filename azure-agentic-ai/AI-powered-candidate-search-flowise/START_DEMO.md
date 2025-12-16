# 🚀 START YOUR DEMO - Quick Guide

## ✅ Current Status

- ✅ API keys configured
- ✅ Flowise starting
- ✅ All tools ready

## 🎯 Next 3 Steps (10 minutes)

### Step 1: Open Flowise (30 seconds)

**Wait 10-20 seconds, then open:**
```
http://localhost:3000
```

You should see the Flowise interface.

### Step 2: Register Tools (5 minutes)

**In Flowise UI:**

1. **Settings** → **Custom Tools** → **Add Tool** (4 times)

   **Tool 1:**
   - Name: `Document Parser`
   - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\document_parser.py`
   - Class: `DocumentParserTool`

   **Tool 2:**
   - Name: `GitHub Search`
   - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\github_search.py`
   - Class: `GitHubSearchTool`

   **Tool 3:**
   - Name: `Web Search`
   - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\web_search.py`
   - Class: `WebSearchTool`

   **Tool 4:**
   - Name: `Profile Analyzer`
   - Path: `C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise\flowise\custom_tools\profile_analyzer.py`
   - Class: `ProfileAnalyzerTool`

2. **Settings** → **Credentials** → Add:
   - OpenAI API Key
   - GitHub Token

### Step 3: Build Workflow (5 minutes)

1. **New Chatflow** → Name: `Candidate Search`

2. **Add Nodes:**
   ```
   Chat Input
     ↓
   Document Parser Tool
     ↓
   Split
     ├─→ GitHub Search Tool
     └─→ Web Search Tool
     ↓
   Merge
     ↓
   Profile Analyzer Tool
     ↓
   Chat Output
   ```

3. **Save** → **Test**

## 🎤 Demo Script

**Opening:**
"This AI system automates candidate search using multiple agents."

**Show:**
1. Upload job description
2. System processes it
3. Shows candidate results
4. Explains match scores

## 🆘 Backup Demo

If Flowise has issues:

```bash
python demo.py
```

This shows the complete workflow with sample data!

---

**You're ready! Follow the 3 steps above! 🚀**

