# CrewAI 3-Agent Workflow - Quick Start Guide

## 🚀 Run Immediately (No Setup Required)

### Option 1: Simple Version (No Dependencies)
```bash
python docs/DAY1_CREWAI_SIMPLE.py
```

This runs a simplified version that demonstrates the concept without requiring any packages or API keys.

---

## 🎯 Full Version (With Real CrewAI)

### Step 1: Install
```bash
pip install crewai crewai-tools
```

### Step 2: Set API Key (Optional for mock mode)
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-key-here"

# Linux/Mac
export OPENAI_API_KEY="your-key-here"
```

### Step 3: Run
```bash
python docs/DAY1_CREWAI_HANDSON.py
```

By default, it runs in **MOCK MODE** (no API calls). To use real APIs:
1. Edit `DAY1_CREWAI_HANDSON.py`
2. Set `MOCK_MODE = False`
3. Add your API key

---

## 📋 What You'll See

### The 3-Agent Workflow:

```
┌─────────────────────────────────────┐
│   AGENT 1: RESEARCHER               │
│   • Gathers information             │
│   • Finds sources                   │
│   • Organizes findings              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   AGENT 2: SUMMARIZER               │
│   • Analyzes research               │
│   • Extracts key points             │
│   • Creates concise summary         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   AGENT 3: FORMATTER                │
│   • Structures content              │
│   • Applies formatting              │
│   • Creates final report            │
└──────────────┬──────────────────────┘
               │
               ▼
         FINAL REPORT
```

---

## 🎓 Understanding the Code

### 1. Define Agents
```python
researcher = Agent(
    role='Research Specialist',
    goal='Conduct thorough research...',
    backstory='You are an expert researcher...'
)
```

### 2. Define Tasks
```python
research_task = Task(
    description='Research the topic: {topic}',
    agent=researcher,
    expected_output='Comprehensive findings'
)
```

### 3. Create Crew
```python
crew = Crew(
    agents=[researcher, summarizer, formatter],
    tasks=[research_task, summarize_task, format_task]
)
```

### 4. Execute
```python
result = crew.kickoff(inputs={"topic": "Your topic"})
```

---

## ✏️ Try Different Topics

Edit the topic in the script:
```python
topic = "LangGraph Framework"
# or
topic = "Azure OpenAI Service"
# or
topic = "Medical Report Analysis"
```

---

## 🔧 Customize

### Change Agent Behavior
Modify the `role`, `goal`, or `backstory` in agent definitions.

### Add More Agents
```python
editor = Agent(role='Editor', goal='...', backstory='...')
edit_task = Task(description='...', agent=editor)
crew = Crew(agents=[..., editor], tasks=[..., edit_task])
```

### Add Tools
```python
from crewai_tools import SerperDevTool

researcher = Agent(
    role='Research Specialist',
    tools=[SerperDevTool()]  # Enables web search
)
```

---

## 📚 Files Created

1. **`DAY1_CREWAI_SIMPLE.py`** - Run immediately, no dependencies
2. **`DAY1_CREWAI_HANDSON.py`** - Full CrewAI implementation
3. **`DAY1_CREWAI_SETUP.md`** - Detailed setup instructions
4. **`requirements_crewai.txt`** - Package dependencies

---

## ✅ Learning Checklist

- [ ] Run the simple version
- [ ] Understand agent, task, and crew concepts
- [ ] Run the full version (mock mode)
- [ ] Customize agents and tasks
- [ ] Try with real API (optional)
- [ ] Apply to your medical report analyzer project

---

## 🆘 Need Help?

- Check `DAY1_CREWAI_SETUP.md` for detailed setup
- Review CrewAI docs: https://docs.crewai.com/
- Start with the simple version to understand concepts

---

*Happy learning! 🎉*

