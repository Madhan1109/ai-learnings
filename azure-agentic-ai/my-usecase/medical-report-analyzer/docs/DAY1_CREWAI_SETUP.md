# CrewAI Hands-On Setup Guide

## 🚀 Quick Start

### Step 1: Install CrewAI
```bash
pip install crewai crewai-tools
```

### Step 2: Get API Keys

#### Required: OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key

#### Optional: Serper API Key (for web search)
1. Go to https://serper.dev/api-key
2. Sign up and get your free API key
3. Copy the key

### Step 3: Configure Environment Variables

#### Option A: Set in Terminal (Temporary)
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-key-here"
$env:SERPER_API_KEY="your-key-here"

# Windows CMD
set OPENAI_API_KEY=your-key-here
set SERPER_API_KEY=your-key-here

# Linux/Mac
export OPENAI_API_KEY="your-key-here"
export SERPER_API_KEY="your-key-here"
```

#### Option B: Create .env File (Recommended)
Create a `.env` file in your project root:
```env
OPENAI_API_KEY=your-openai-api-key-here
SERPER_API_KEY=your-serper-api-key-here
```

Then install python-dotenv:
```bash
pip install python-dotenv
```

And load in your script:
```python
from dotenv import load_dotenv
load_dotenv()
```

### Step 4: Run the Example
```bash
python docs/DAY1_CREWAI_HANDSON.py
```

---

## 📝 Code Structure

### The 3-Agent Workflow

```
┌─────────────────────────────────────────┐
│         CREWAI WORKFLOW                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   AGENT 1: RESEARCHER            │  │
│  │   • Gathers information          │  │
│  │   • Finds sources                │  │
│  │   • Organizes findings           │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│                 ▼                       │
│  ┌──────────────────────────────────┐  │
│  │   AGENT 2: SUMMARIZER            │  │
│  │   • Analyzes research            │  │
│  │   • Extracts key points          │  │
│  │   • Creates concise summary      │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│                 ▼                       │
│  ┌──────────────────────────────────┐  │
│  │   AGENT 3: FORMATTER             │  │
│  │   • Structures content           │  │
│  │   • Applies formatting           │  │
│  │   • Creates final report         │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│                 ▼                       │
│            FINAL REPORT                 │
└─────────────────────────────────────────┘
```

---

## 🎯 Understanding the Code

### 1. Agent Definition
```python
researcher = Agent(
    role='Research Specialist',           # What the agent does
    goal='Conduct thorough research...',  # Agent's objective
    backstory='You are an expert...',     # Agent's personality/expertise
    tools=[...],                          # Tools agent can use
    verbose=True                          # Show thinking process
)
```

### 2. Task Definition
```python
research_task = Task(
    description='Research the topic: {topic}',  # What to do
    agent=researcher,                            # Who does it
    expected_output='Comprehensive findings...'  # What's expected
)
```

### 3. Crew Assembly
```python
crew = Crew(
    agents=[researcher, summarizer, formatter],  # Team members
    tasks=[task1, task2, task3],                 # Work to do
    process=Process.sequential                   # How they work together
)
```

### 4. Execution
```python
result = crew.kickoff(inputs={"topic": "Your topic here"})
```

---

## 🔧 Customization Examples

### Example 1: Change Research Topic
```python
result = run_crew_workflow("LangGraph Framework", mock_mode=False)
```

### Example 2: Add More Agents
```python
editor = Agent(
    role='Editor',
    goal='Review and improve content quality',
    backstory='Expert editor with attention to detail'
)

edit_task = Task(
    description='Review and edit the formatted report',
    agent=editor
)

crew = Crew(
    agents=[researcher, summarizer, formatter, editor],
    tasks=[research_task, summarize_task, format_task, edit_task]
)
```

### Example 3: Use Hierarchical Process
```python
manager = Agent(
    role='Project Manager',
    goal='Coordinate the team',
    backstory='Experienced project manager'
)

crew = Crew(
    agents=[researcher, summarizer, formatter],
    tasks=[research_task, summarize_task, format_task],
    process=Process.hierarchical,
    manager_llm=manager  # Manager coordinates the team
)
```

### Example 4: Add Tools
```python
from crewai_tools import SerperDevTool, WebsiteSearchTool

researcher = Agent(
    role='Research Specialist',
    tools=[
        SerperDevTool(),              # Web search
        WebsiteSearchTool()           # Website-specific search
    ]
)
```

---

## 🐛 Troubleshooting

### Issue: "API key not found"
**Solution**: Make sure you've set the environment variable:
```bash
export OPENAI_API_KEY="your-key"
```

### Issue: "Module not found: crewai"
**Solution**: Install the package:
```bash
pip install crewai crewai-tools
```

### Issue: Agents taking too long
**Solution**: 
- Use `max_iter` parameter to limit iterations
- Check your API rate limits
- Use mock mode for testing

### Issue: Cost concerns
**Solution**:
- Start with mock mode (`MOCK_MODE = True`)
- Use smaller models if available
- Monitor your API usage

---

## 📊 Expected Output

When you run the script, you should see:

```
======================================================================
CREWAI 3-AGENT WORKFLOW: Research → Summarize → Format
======================================================================

📋 Topic: Artificial Intelligence in Healthcare

======================================================================
AGENT 1: RESEARCHER
======================================================================
[Agent thinking process...]
[Research findings...]

======================================================================
AGENT 2: SUMMARIZER
======================================================================
[Agent thinking process...]
[Summary...]

======================================================================
AGENT 3: FORMATTER
======================================================================
[Agent thinking process...]
[Formatted report...]

✅ WORKFLOW COMPLETE
```

---

## 🎓 Learning Objectives Achieved

After completing this exercise, you should understand:

- ✅ How to create specialized agents in CrewAI
- ✅ How to define tasks for agents
- ✅ How to assemble a crew workflow
- ✅ How agents collaborate sequentially
- ✅ How to customize agent behavior
- ✅ How to integrate tools with agents

---

## 🚀 Next Steps

1. **Modify the agents**: Change roles, goals, or backstories
2. **Add more tasks**: Create additional processing steps
3. **Integrate tools**: Add web search, database queries, etc.
4. **Try hierarchical process**: Use a manager agent
5. **Connect to your project**: Use this pattern in your medical report analyzer

---

## 📚 Additional Resources

- CrewAI Documentation: https://docs.crewai.com/
- CrewAI GitHub: https://github.com/joaomdmoura/crewAI
- CrewAI Tools: https://github.com/joaomdmoura/crewAI-tools

---

*Happy learning! 🎉*

