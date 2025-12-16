# 🚀 CrewAI Candidate Search - Real-Time Execution Guide

## 📋 Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Real-Time Execution Flow](#real-time-execution-flow)
3. [Step-by-Step Detailed Process](#step-by-step-detailed-process)
4. [How Agents Work](#how-agents-work)
5. [How Tools Work](#how-tools-work)
6. [Data Flow Diagram](#data-flow-diagram)
7. [Security & Guardrails](#security--guardrails)
8. [LLM Integration (LitELLM)](#llm-integration-litellm)

---

## 🏗️ System Architecture Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN ENTRY POINT                          │
│                    (main.py)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CANDIDATE SEARCH WORKFLOW                       │
│         (candidate_search_workflow.py)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Orchestrates 4 Sequential Steps                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   AGENTS     │ │    TOOLS     │ │   UTILITIES  │
│              │ │              │ │              │
│ • Document   │ │ • Document   │ │ • LitELLM    │
│   Parser     │ │   Parser     │ │   Client     │
│ • GitHub     │ │ • GitHub     │ │ • Guardrails │
│   Searcher   │ │   Search     │ │ • Windows    │
│ • Web/       │ │ • Web        │ │   Fix        │
│   LinkedIn   │ │   Search     │ │              │
│   Searcher   │ │ • LinkedIn   │ │              │
│ • Profile    │ │   Search     │ │              │
│   Summarizer │ │ • Profile    │ │              │
│              │ │   Analyzer   │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🔄 Real-Time Execution Flow

### High-Level Flow

```
START
  │
  ├─► [1] User runs: python main.py job_description.docx
  │
  ├─► [2] main.py initializes CandidateSearchWorkflow
  │
  ├─► [3] STEP 1: Parse Job Description
  │   ├─► Document Parser Agent uses Document Parser Tool
  │   ├─► Extracts: skills, technologies, keywords, location
  │   └─► Apply Guardrails (input filtering)
  │
  ├─► [4] STEP 2: Search GitHub (OPTIMIZED - Direct Tool Call)
  │   ├─► GitHub Search Tool called directly (bypasses agent)
  │   ├─► Makes GitHub API calls
  │   ├─► Finds matching developer profiles
  │   └─► Returns: List of GitHub profiles
  │
  ├─► [5] STEP 3: Search Web/LinkedIn
  │   ├─► Web/LinkedIn Searcher Agent uses Web Search Tool
  │   ├─► Makes SerpAPI or Google CSE API calls
  │   ├─► Finds professional profiles
  │   └─► Returns: List of web/LinkedIn profiles
  │
  ├─► [6] STEP 4: Summarize Profiles
  │   ├─► Profile Summarizer Agent uses Profile Analyzer Tool
  │   ├─► Analyzes each profile against job requirements
  │   ├─► Calculates match scores
  │   └─► Returns: Summarized profiles with recommendations
  │
  ├─► [7] Apply Guardrails (output filtering)
  │
  ├─► [8] Display Results
  │   ├─► Print to console
  │   └─► Save to JSON file
  │
  └─► END
```

---

## 📝 Step-by-Step Detailed Process

### **STEP 0: Initialization** (Before Execution)

**File:** `main.py`

```python
# 1. Windows Compatibility Fixes
   - Fix signal handling (SIGHUP, SIGCONT, etc.)
   - Set UTF-8 encoding for console
   - Configure environment variables

# 2. Load Configuration
   - Load .env file (API keys, settings)
   - Load config.yaml (agent configs, workflow settings)
   - Initialize Settings object

# 3. Initialize Workflow
   workflow = CandidateSearchWorkflow()
   # This creates all 4 agents:
   #   - document_parser
   #   - github_searcher
   #   - web_linkedin_searcher
   #   - profile_summarizer
```

**What Happens:**
- System checks for required API keys (OpenAI, GitHub)
- Creates agent instances with their tools
- Configures LLM via LitELLM client
- Initializes guardrails manager

**Time:** ~2-3 seconds

---

### **STEP 1: Parse Job Description**

**File:** `src/workflow/candidate_search_workflow.py` → `_parse_job_description()`

**Agent:** Document Parser Agent  
**Tool:** Document Parser Tool

#### Detailed Process:

```
1. Workflow receives: "M:\Downloads\Technical Architect Job Description.docx"

2. Creates Task for Document Parser Agent:
   Task(
     description="Parse the job description document at {path}...",
     agent=document_parser,
     expected_output="JSON with skills, technologies, keywords..."
   )

3. Creates Crew:
   Crew(
     agents=[document_parser],
     tasks=[task],
     process=Process.sequential,
     verbose=False
   )

4. Executes: crew.kickoff()
   ├─► Agent receives task
   ├─► Agent decides to use DocumentParserTool
   ├─► Tool reads .docx file using python-docx
   ├─► Tool extracts text from all paragraphs
   ├─► Tool uses regex to extract:
   │   ├─► Skills (Python, Java, AWS, etc.)
   │   ├─► Technologies (Docker, Kubernetes, etc.)
   │   ├─► Experience keywords (architect, lead, senior, etc.)
   │   ├─► Location (Chennai, Tamil Nadu)
   │   ├─► Job type (Full-Time)
   │   └─► Years of experience (7+ years)
   ├─► Tool returns JSON string
   ├─► Agent formats response (may wrap in markdown)
   └─► Returns result to workflow

5. Workflow parses result:
   ├─► Try extracting JSON from markdown code blocks (```json ... ```)
   ├─► If fails, try direct JSON parsing
   ├─► If fails, use tool directly as fallback
   └─► Returns structured dict: job_info

6. Apply Guardrails (Input):
   ├─► Check for sensitive info (SSN, credit cards, etc.)
   ├─► Block if sensitive data found
   └─► Return filtered job_info
```

**Example Output:**
```json
{
  "skills": ["Python", "Java", "AWS", "Azure", "GCP"],
  "technologies": ["Docker", "Kubernetes", "CI/CD", "Microservices"],
  "experience_keywords": ["architect", "technical", "lead", "design"],
  "location": "Chennai, Tamil Nadu",
  "job_type": "Full-Time",
  "years_of_experience": "7+"
}
```

**Time:** ~10-15 seconds (LLM processing + file parsing)

---

### **STEP 2: Search GitHub** (OPTIMIZED)

**File:** `src/workflow/candidate_search_workflow.py` → `_search_github()`

**Tool:** GitHub Search Tool (called directly, bypassing agent for speed)

#### Detailed Process:

```
1. Workflow receives: job_info (from Step 1)

2. Extracts:
   - keywords = ["architect", "technical", "lead", "design"]
   - skills = ["Python", "Java", "AWS", "Docker", "Kubernetes"]

3. Calls GitHub Search Tool DIRECTLY (no agent wrapper):
   tool = GitHubSearchTool()
   tool_result = tool._run(
       keywords=keywords[:5],  # Limit to 5
       skills=skills[:5],      # Limit to 5
       min_repos=3,
       language=None
   )

4. Inside GitHub Search Tool:
   ├─► Builds GitHub search query:
   │   Query: "(architect OR technical OR lead OR design) language:python"
   │
   ├─► Calls GitHub API:
   │   users = github.search_users(query)
   │
   ├─► Iterates through users (max 5 profiles):
   │   For each user:
   │   ├─► Quick check: Skip if public_repos < 3
   │   ├─► Get user repositories (limit to 10 repos)
   │   ├─► For each repo (up to 10):
   │   │   ├─► Get languages (Python, Java, etc.)
   │   │   ├─► Count stars and forks
   │   │   └─► Aggregate language usage
   │   ├─► Calculate top 5 languages
   │   ├─► Match skills against user's languages
   │   ├─► Build profile data:
   │   │   {
   │   │     "username": "john-doe",
   │   │     "name": "John Doe",
   │   │     "bio": "Technical Architect...",
   │   │     "top_languages": ["Python", "Java", "JavaScript"],
   │   │     "matched_skills": ["Python", "Java"],
   │   │     "public_repos": 25,
   │   │     "total_stars": 150,
   │   │     "profile_url": "https://github.com/john-doe"
   │   │   }
   │   └─► Print progress: "Found profile 1/5: john-doe"
   │
   └─► Returns JSON:
       {
         "total_results": 5,
         "profiles": [profile1, profile2, ...]
       }

5. Workflow parses result:
   ├─► Parse JSON from tool_result
   ├─► Extract profiles list
   └─► Return: List[Dict] of GitHub profiles
```

**Why Direct Tool Call?**
- **Faster:** Skips agent LLM processing (saves 30-60 seconds)
- **More Reliable:** Direct API calls, no JSON parsing issues
- **Better Progress:** Can show real-time progress indicators

**Time:** ~30-60 seconds (GitHub API calls)

**Progress Output:**
```
Found profile 1/5: john-doe
Found profile 2/5: jane-smith
Found profile 3/5: tech-architect
...
```

---

### **STEP 3: Search Web/LinkedIn**

**File:** `src/workflow/candidate_search_workflow.py` → `_search_web_linkedin()`

**Agent:** Web/LinkedIn Searcher Agent  
**Tool:** Web Search Tool

#### Detailed Process:

```
1. Workflow receives: job_info (from Step 1)

2. Creates Task for Web/LinkedIn Searcher Agent:
   Task(
     description="Search web and LinkedIn for profiles matching:
                  Keywords: architect, technical, lead
                  Skills: Python, Java, AWS
                  Location: Chennai, Tamil Nadu
                  Find up to 5 matching profiles.",
     agent=web_linkedin_searcher,
     expected_output="JSON array of professional profiles"
   )

3. Creates Crew and executes:
   crew = Crew(agents=[web_linkedin_searcher], tasks=[task])
   result = crew.kickoff()

4. Agent uses Web Search Tool:
   ├─► Builds enhanced query:
   │   "Technical Architect Python Java AWS Chennai"
   │
   ├─► Tries SerpAPI first (if API key available):
   │   ├─► Makes HTTP request to SerpAPI
   │   ├─► Parses search results
   │   └─► Extracts profile information
   │
   ├─► Falls back to Google Custom Search (if configured):
   │   ├─► Makes HTTP request to Google CSE API
   │   ├─► Parses JSON response
   │   └─► Extracts profile information
   │
   └─► Falls back to simulation (if no APIs):
       └─► Returns mock profiles for demo

5. Tool returns JSON:
   {
     "query": "Technical Architect Python Java AWS Chennai",
     "total_results": 5,
     "profiles": [
       {
         "title": "Senior Technical Architect - LinkedIn",
         "link": "https://linkedin.com/in/...",
         "snippet": "10+ years experience in Python, AWS...",
         "source": "serpapi"
       },
       ...
     ]
   }

6. Agent formats response (may wrap in markdown)

7. Workflow parses result:
   ├─► Extract JSON from markdown (```json ... ```)
   ├─► Parse profiles list
   └─► Return: List[Dict] of web/LinkedIn profiles
```

**Time:** ~20-40 seconds (API calls + LLM processing)

---

### **STEP 4: Summarize Profiles**

**File:** `src/workflow/candidate_search_workflow.py` → `_summarize_profiles()`

**Agent:** Profile Summarizer Agent  
**Tool:** Profile Analyzer Tool

#### Detailed Process:

```
1. Workflow receives:
   - all_profiles = github_profiles + web_profiles (combined list)
   - job_info (from Step 1)

2. Limits profiles to max_candidates (default: 10)

3. Creates Task for Profile Summarizer Agent:
   Task(
     description="Analyze and summarize {len(profiles)} candidate profiles
                  based on job requirements: {job_info}.
                  For each profile, provide:
                  - match_score (0-100)
                  - key highlights
                  - concise summary
                  - recommendation (Strong Match, Good Match, etc.)",
     agent=profile_summarizer,
     expected_output="JSON array with match_score, highlights, summary, recommendation"
   )

4. Creates Crew and executes:
   crew = Crew(agents=[profile_summarizer], tasks=[task])
   result = crew.kickoff()

5. Agent uses Profile Analyzer Tool:
   ├─► For each profile:
   │   ├─► Compares profile skills vs job requirements
   │   ├─► Calculates match score:
   │   │   - Skills match: +20 points per skill
   │   │   - Experience match: +10 points
   │   │   - Location match: +5 points
   │   │   - Max: 100 points
   │   ├─► Extracts key highlights:
   │   │   - Top matching skills
   │   │   - Relevant experience
   │   │   - Notable achievements
   │   ├─► Generates summary:
   │   │   - 2-3 sentence overview
   │   │   - Strengths and fit
   │   └─► Provides recommendation:
   │       - "Strong Match" (80-100)
   │       - "Good Match" (60-79)
   │       - "Moderate Match" (40-59)
   │       - "Weak Match" (<40)
   │
   └─► Returns JSON array of analyzed profiles

6. Agent formats response (may wrap in markdown)

7. Workflow parses result:
   ├─► Extract JSON from markdown
   ├─► Parse analyzed profiles
   └─► Return: List[Dict] of summarized profiles
```

**Example Output:**
```json
[
  {
    "profile_id": "github_john-doe",
    "match_score": 85,
    "recommendation": "Strong Match",
    "summary": "Experienced Technical Architect with 8+ years...",
    "highlights": [
      "Expert in Python and Java",
      "AWS certified architect",
      "Led microservices migration"
    ]
  },
  ...
]
```

**Time:** ~30-60 seconds (LLM processing for all profiles)

---

### **STEP 5: Apply Guardrails (Output)**

**File:** `src/utils/guardrails.py`

```
1. Workflow converts summaries to JSON string

2. Calls: apply_guardrails(summaries_str, is_input=False)

3. Guardrails Manager:
   ├─► Checks for sensitive patterns:
   │   - SSN: \d{3}-\d{2}-\d{4}
   │   - Credit cards: \d{4}[\s-]?\d{4}...
   │
   ├─► If NeMo Guardrails available:
   │   └─► Uses advanced filtering
   │
   └─► Returns filtered text (redacts sensitive info)

4. Workflow parses filtered JSON back to dict
```

**Time:** <1 second

---

### **STEP 6: Display & Save Results**

**File:** `main.py`

```
1. Prints to console:
   ════════════════════════════════════════════════════════
   CANDIDATE SEARCH RESULTS
   ════════════════════════════════════════════════════════
   
   Total candidates found: 10
   GitHub candidates: 5
   Web/LinkedIn candidates: 5
   
   ───────────────────────────────────────────────────────
   
   Candidate 1:
     Match Score: 85/100
     Recommendation: Strong Match
     Summary: Experienced Technical Architect...
     Highlights: Python, AWS, Microservices
   
   Candidate 2:
     ...

2. Saves to file:
   results/search_results_Technical_Architect_Job_Description.json
   {
     "job_requirements": {...},
     "total_candidates_found": 10,
     "github_candidates": 5,
     "web_linkedin_candidates": 5,
     "summaries": [...],
     "status": "success"
   }
```

**Time:** <1 second

---

## 🤖 How Agents Work

### Agent Structure

Each agent is created with:

```python
Agent(
    role="Document Parser",              # What the agent is
    goal="Extract key information...",   # What it should achieve
    backstory="You are an expert...",    # Context for LLM
    tools=[DocumentParserTool()],        # Tools it can use
    llm=get_litellm_llm(),              # LLM instance
    verbose=True,                        # Show detailed logs
    max_iter=3,                         # Max reasoning iterations
    allow_delegation=False              # Can't delegate to other agents
)
```

### Agent Execution Flow

```
1. Agent receives Task
   │
   ├─► Agent reads task description
   │
   ├─► Agent uses LLM to understand task
   │   ├─► LLM analyzes: "What do I need to do?"
   │   ├─► LLM decides: "I should use DocumentParserTool"
   │   └─► LLM formats tool call
   │
   ├─► Agent calls Tool
   │   ├─► Tool executes (reads file, makes API call, etc.)
   │   └─► Tool returns result
   │
   ├─► Agent receives tool result
   │
   ├─► Agent uses LLM to process result
   │   ├─► LLM analyzes tool output
   │   ├─► LLM formats response according to expected_output
   │   └─► LLM may wrap in markdown (```json ... ```)
   │
   └─► Agent returns final response
```

### Why Agents Sometimes Wrap JSON in Markdown?

LLMs are trained to format code/JSON in markdown code blocks for readability. The workflow handles this by:
1. First trying to extract JSON from markdown: `r'```json\s*(\{.*?\})\s*```'`
2. If that fails, trying direct JSON parsing
3. If that fails, using tool directly as fallback

---

## 🛠️ How Tools Work

### Tool Structure

Each tool extends `BaseTool` from CrewAI:

```python
class DocumentParserTool(BaseTool):
    name: str = "Document Parser"
    description: str = "Extracts information from documents..."
    args_schema: type[BaseModel] = DocumentParserInput
    
    def _run(self, file_path: str) -> str:
        # Actual tool logic here
        # Returns JSON string
        return json.dumps(result)
```

### Tool Execution

```
1. Agent decides to use tool
   │
   ├─► Agent calls: tool._run(keyword1="value1", keyword2="value2")
   │
   ├─► Tool validates input using args_schema
   │
   ├─► Tool executes _run() method:
   │   ├─► Makes API calls (GitHub, SerpAPI, etc.)
   │   ├─► Processes data
   │   └─► Returns JSON string
   │
   └─► Agent receives tool result
```

### Direct Tool Calls (Optimization)

For GitHub search, we bypass the agent and call the tool directly:

```python
# Instead of:
task = Task(description="...", agent=github_searcher)
crew = Crew(agents=[github_searcher], tasks=[task])
result = crew.kickoff()  # Slow: LLM processing overhead

# We do:
tool = GitHubSearchTool()
result = tool._run(keywords=..., skills=...)  # Fast: Direct API calls
```

**Benefits:**
- ✅ Faster execution (no LLM overhead)
- ✅ More reliable (no JSON parsing issues)
- ✅ Better progress tracking
- ✅ Lower cost (no LLM API calls)

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT: job_description.docx             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Document Parser                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Agent      │───►│    Tool      │───►│   .docx     │  │
│  │ (LLM)        │    │ (python-docx)│    │   File      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                              │
│         └────────────────────┘                              │
│                    │                                        │
│                    ▼                                        │
│         ┌─────────────────────┐                             │
│         │  job_info (JSON)    │                             │
│         │  - skills           │                             │
│         │  - technologies     │                             │
│         │  - keywords         │                             │
│         └─────────────────────┘                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: GitHub Search (Direct Tool Call)                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Tool       │───►│  GitHub API  │───►│   Profiles  │  │
│  │ (Direct)     │    │              │    │   (JSON)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                                  │
│         └──────────────────────────────────────────────────┘
│                    │                                        │
│                    ▼                                        │
│         ┌─────────────────────┐                             │
│         │  github_profiles    │                             │
│         │  [profile1, ...]    │                             │
│         └─────────────────────┘                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Web/LinkedIn Search                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Agent      │───►│    Tool      │───►│  SerpAPI/    │  │
│  │ (LLM)        │    │              │    │  Google CSE   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                              │
│         └────────────────────┘                              │
│                    │                                        │
│                    ▼                                        │
│         ┌─────────────────────┐                             │
│         │  web_profiles      │                             │
│         │  [profile1, ...]   │                             │
│         └─────────────────────┘                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Profile Summarization                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Agent      │───►│    Tool      │───►│  All Profiles│  │
│  │ (LLM)        │    │ (Analyzer)   │    │  + job_info  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                              │
│         └────────────────────┘                              │
│                    │                                        │
│                    ▼                                        │
│         ┌─────────────────────┐                             │
│         │  summaries         │                             │
│         │  [summary1, ...]  │                             │
│         └─────────────────────┘                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    OUTPUT: Results                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Console display                                    │   │
│  │  • JSON file: results/search_results_*.json          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Guardrails

### Guardrails Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT GUARDRAILS                          │
│  (Applied after Step 1: Job Description Parsing)            │
│                                                              │
│  1. Check for sensitive patterns:                           │
│     - SSN: 123-45-6789                                      │
│     - Credit cards: 1234 5678 9012 3456                    │
│     - Email addresses (optional)                            │
│                                                              │
│  2. If NeMo Guardrails available:                           │
│     - Use advanced AI-based filtering                       │
│                                                              │
│  3. If sensitive info found:                                │
│     - Block execution                                        │
│     - Return error: "Job description contains sensitive..." │
│                                                              │
│  4. If safe:                                                │
│     - Continue to next step                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    OUTPUT GUARDRAILS                         │
│  (Applied after Step 4: Profile Summarization)             │
│                                                              │
│  1. Check for sensitive patterns in summaries               │
│                                                              │
│  2. Redact sensitive information:                           │
│     - Replace SSN with [REDACTED]                           │
│     - Replace credit cards with [REDACTED]                  │
│                                                              │
│  3. Return filtered summaries                               │
└─────────────────────────────────────────────────────────────┘
```

### Guardrails Implementation

**File:** `src/utils/guardrails.py`

```python
# Basic pattern matching (always available)
sensitive_patterns = [
    r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
    r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card
]

# Advanced NeMo Guardrails (if installed)
if nemoguardrails_available:
    use_advanced_filtering()
else:
    use_basic_pattern_matching()
```

---

## 🌐 LLM Integration (LitELLM)

### LitELLM Gateway

**Purpose:** Unified interface for accessing multiple LLM providers

**File:** `src/utils/litellm_client.py`

```
┌─────────────────────────────────────────────────────────────┐
│                    LitELLM Gateway                          │
│              (http://localhost:4000)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenAI     │  │   Azure      │  │   Anthropic  │     │
│  │   GPT-4      │  │   OpenAI     │  │   Claude     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Benefits:                                                   │
│  • Model routing                                             │
│  • Fallback handling                                         │
│  • Rate limiting                                             │
│  • Cost tracking                                             │
└─────────────────────────────────────────────────────────────┘
```

### LLM Configuration

**File:** `.env`
```bash
LITELLM_HOST=http://localhost:4000
LITELLM_MODEL=gpt-4-turbo-preview
OPENAI_API_KEY=sk-...
```

**File:** `src/utils/litellm_client.py`
```python
def get_litellm_llm():
    llm = ChatOpenAI(
        model=settings.litellm_model,  # "gpt-4-turbo-preview"
        temperature=0.3,
        max_tokens=2000,
        openai_api_base=settings.litellm_host,  # "http://localhost:4000"
        openai_api_key=settings.openai_api_key
    )
    return llm
```

### How Agents Use LLM

```
1. Agent receives task
   │
   ├─► Agent calls LLM with:
   │   ├─► System prompt (role, goal, backstory)
   │   ├─► User prompt (task description)
   │   └─► Tool descriptions
   │
   ├─► LLM (via LitELLM) processes request
   │   ├─► Routes to configured model (GPT-4)
   │   ├─► Handles rate limits
   │   └─► Returns response
   │
   ├─► Agent receives LLM response
   │   ├─► Parses tool calls from response
   │   ├─► Executes tools
   │   └─► Formats final output
   │
   └─► Returns result
```

---

## ⏱️ Real-Time Execution Timeline

### Typical Execution Time

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 0: Initialization          │  ~2-3 seconds           │
├─────────────────────────────────────────────────────────────┤
│  STEP 1: Parse Job Description    │  ~10-15 seconds        │
│    • Read .docx file              │  ~1 second             │
│    • LLM processing               │  ~9-14 seconds         │
├─────────────────────────────────────────────────────────────┤
│  STEP 2: Search GitHub            │  ~30-60 seconds        │
│    • Build query                  │  <1 second             │
│    • GitHub API calls             │  ~25-50 seconds        │
│    • Process profiles             │  ~5-10 seconds         │
├─────────────────────────────────────────────────────────────┤
│  STEP 3: Search Web/LinkedIn     │  ~20-40 seconds        │
│    • LLM processing               │  ~5-10 seconds         │
│    • API calls (SerpAPI/CSE)      │  ~10-20 seconds        │
│    • Format results               │  ~5-10 seconds         │
├─────────────────────────────────────────────────────────────┤
│  STEP 4: Summarize Profiles       │  ~30-60 seconds        │
│    • LLM processing (all profiles)│  ~25-55 seconds        │
│    • Calculate match scores       │  ~5 seconds            │
├─────────────────────────────────────────────────────────────┤
│  STEP 5: Apply Guardrails         │  <1 second             │
├─────────────────────────────────────────────────────────────┤
│  STEP 6: Display & Save           │  <1 second             │
├─────────────────────────────────────────────────────────────┤
│  TOTAL TIME                      │  ~92-179 seconds       │
│                                  │  (~1.5-3 minutes)       │
└─────────────────────────────────────────────────────────────┘
```

### Factors Affecting Speed

**Faster:**
- ✅ Direct tool calls (GitHub search)
- ✅ Fewer profiles to process
- ✅ Good API response times
- ✅ Fast LLM (GPT-4 Turbo)

**Slower:**
- ❌ Agent wrapper overhead
- ❌ Many profiles to analyze
- ❌ Slow API responses
- ❌ Rate limiting
- ❌ Complex job descriptions

---

## 🎯 Key Takeaways

1. **Sequential Processing:** Steps run one after another (not parallel)
2. **Agent-Based:** Most steps use AI agents with LLM reasoning
3. **Tool Execution:** Agents use tools to perform actual work (API calls, file parsing)
4. **Optimization:** GitHub search uses direct tool calls for speed
5. **Security:** Guardrails filter input and output for sensitive information
6. **LLM Gateway:** LitELLM provides unified access to multiple LLM providers
7. **Error Handling:** Multiple fallback mechanisms (JSON parsing, tool direct calls)
8. **Progress Tracking:** Real-time progress indicators for long operations

---

## 📚 Related Files

- **Main Entry:** `main.py`
- **Workflow:** `src/workflow/candidate_search_workflow.py`
- **Agents:** `src/agents/*.py`
- **Tools:** `src/tools/*.py`
- **Config:** `src/config.py`
- **LitELLM:** `src/utils/litellm_client.py`
- **Guardrails:** `src/utils/guardrails.py`

---

**Last Updated:** 2025-12-15  
**Version:** 1.0

