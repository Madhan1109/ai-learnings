# Visual Flow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   CLI        │              │   REST API    │            │
│  │  (main.py)   │              │  (FastAPI)    │            │
│  └──────┬───────┘              └──────┬───────┘            │
└─────────┼──────────────────────────────┼────────────────────┘
          │                              │
          └──────────────┬───────────────┘
                         │
          ┌──────────────▼───────────────┐
          │   WORKFLOW ORCHESTRATOR      │
          │  CandidateSearchWorkflow     │
          └──────────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                 │                │
        ▼                 ▼                ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   AGENT 1     │  │   AGENT 2     │  │   AGENT 3     │
│  Document     │  │   GitHub      │  │   Web/        │
│  Parser       │  │   Searcher    │  │   LinkedIn    │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   TOOL 1      │  │   TOOL 2      │  │   TOOL 3      │
│  Document     │  │   GitHub      │  │   Web Search   │
│  Parser       │  │   Search      │  │   LinkedIn    │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  python-docx  │  │  GitHub API   │  │  SerpAPI/     │
│               │  │               │  │  Google CSE   │
└───────────────┘  └───────────────┘  └───────────────┘
                         │
                         ▼
          ┌──────────────▼───────────────┐
          │   AGENT 4                    │
          │   Profile Summarizer         │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────▼───────────────┐
          │   TOOL 4                      │
          │   Profile Analyzer            │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────▼───────────────┐
          │   GUARDRAILS                  │
          │   (Output Filtering)          │
          └──────────────┬───────────────┘
                         │
                         ▼
                    RESULTS
```

## 2. Agent-Tool-LLM Relationship

```
┌─────────────────────────────────────────────────┐
│                    AGENT                         │
│  ┌───────────────────────────────────────────┐  │
│  │ Role: "Document Parser"                    │  │
│  │ Goal: "Extract key information"             │  │
│  │ Backstory: "You are an expert..."         │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────┐      ┌──────────────┐       │
│  │    TOOLS     │      │     LLM       │       │
│  │              │      │               │       │
│  │ Document     │      │  ChatOpenAI   │       │
│  │ Parser Tool  │      │  (via LitELLM)│       │
│  │              │      │               │       │
│  │ - Reads .docx│      │ - Reasoning   │       │
│  │ - Extracts   │      │ - Structuring │       │
│  │   info       │      │ - Analysis     │       │
│  └──────────────┘      └──────────────┘       │
│         │                      │                │
│         └──────────┬───────────┘                │
│                    │                             │
│                    ▼                             │
│            Agent Decision Making                 │
└─────────────────────────────────────────────────┘
```

## 3. Complete Workflow Sequence

```
START
 │
 ├─► Upload job_description.docx
 │
 ├─► [GUARDRAILS] Input Check
 │   ├─► SSN? → BLOCK
 │   ├─► Credit Card? → BLOCK
 │   └─► OK → Continue
 │
 ├─► [STEP 1] Document Parser Agent
 │   │
 │   ├─► DocumentParserTool
 │   │   ├─► Read .docx file
 │   │   ├─► Extract text
 │   │   └─► Parse patterns
 │   │
 │   ├─► LLM (via LitELLM)
 │   │   └─► Structure information
 │   │
 │   └─► Output: {
 │       "skills": ["Python", "AWS"],
 │       "technologies": [...],
 │       "keywords": [...]
 │     }
 │
 ├─► [STEP 2] GitHub Search Agent (Parallel)
 │   │
 │   ├─► GitHubSearchTool
 │   │   ├─► Build query
 │   │   ├─► Call GitHub API
 │   │   ├─► Get user profiles
 │   │   ├─► Analyze repos
 │   │   └─► Match skills
 │   │
 │   └─► Output: [GitHub profiles...]
 │
 ├─► [STEP 3] Web/LinkedIn Search Agent (Parallel)
 │   │
 │   ├─► WebSearchTool
 │   │   ├─► Call SerpAPI/Google CSE
 │   │   └─► Get web profiles
 │   │
 │   ├─► LinkedInSearchTool
 │   │   ├─► Call LinkedIn API
 │   │   └─► Get LinkedIn profiles
 │   │
 │   └─► Output: [Web/LinkedIn profiles...]
 │
 ├─► [STEP 4] Profile Summarizer Agent
 │   │
 │   ├─► ProfileAnalyzerTool
 │   │   ├─► Calculate match scores
 │   │   ├─► Extract highlights
 │   │   └─► Generate summaries
 │   │
 │   ├─► LLM (via LitELLM)
 │   │   └─► Create summaries
 │   │
 │   └─► Output: [Analyzed profiles with scores...]
 │
 ├─► [GUARDRAILS] Output Check
 │   ├─► Sanitize sensitive info
 │   └─► Replace with [REDACTED]
 │
 └─► Return Results
     {
       "total_candidates": 15,
       "summaries": [...]
     }
```

## 4. Data Transformation Flow

```
INPUT: job_description.docx
│
├─► Raw Text
│   "Technical Architect Job Description
│    Location: Chennai
│    Skills: AWS, Python, Docker..."
│
├─► Document Parser Tool
│   │
│   ├─► Pattern Matching
│   │   ├─► Skills: ["AWS", "Python", "Docker"]
│   │   ├─► Location: "Chennai"
│   │   └─► Experience: "7+ years"
│   │
│   └─► Structured JSON
│       {
│         "skills": ["AWS", "Python"],
│         "technologies": ["AWS", "Docker"],
│         "location": "Chennai",
│         "years_of_experience": "7"
│       }
│
├─► Search Queries
│   ├─► GitHub: "Python AWS architecture"
│   └─► Web: "Python AWS Chennai profile"
│
├─► API Responses
│   ├─► GitHub: [user profiles...]
│   └─► Web: [web results...]
│
├─► Profile Analysis
│   ├─► Match Score Calculation
│   │   ├─► Python skill: +10 points
│   │   ├─► AWS skill: +10 points
│   │   └─► Total: 85/100
│   │
│   └─► Summary Generation
│       "John Doe is a professional developer
│        with expertise in Python, AWS..."
│
└─► OUTPUT: Final Results
    {
      "summaries": [
        {
          "match_score": 85,
          "summary": "...",
          "recommendation": "Strong Match"
        }
      ]
    }
```

## 5. Configuration Hierarchy

```
┌─────────────────────────────────────────┐
│      ENVIRONMENT VARIABLES (.env)       │
│      Highest Priority                   │
│  - OPENAI_API_KEY                       │
│  - GITHUB_TOKEN                         │
│  - LITELLM_HOST                         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      YAML CONFIGURATION (config.yaml)   │
│      Medium Priority                    │
│  - Agent settings                       │
│  - Workflow settings                   │
│  - LLM configuration                   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      CODE DEFAULTS                      │
│      Lowest Priority                    │
│  - Hardcoded fallbacks                  │
│  - Default values                       │
└─────────────────────────────────────────┘
```

## 6. Security Flow

```
INPUT
 │
 ├─► apply_guardrails(text, is_input=True)
 │   │
 │   ├─► Pattern Check
 │   │   ├─► SSN Pattern: \d{3}-\d{2}-\d{4}
 │   │   ├─► Credit Card: \d{4}[\s-]?\d{4}...
 │   │   └─► PII Patterns
 │   │
 │   ├─► NeMo Guardrails (if available)
 │   │   └─► Advanced filtering
 │   │
 │   └─► Result
 │       ├─► BLOCKED → Return error
 │       └─► ALLOWED → Continue
 │
 ├─► Processing (Agents, Tools, LLM)
 │
 ├─► apply_guardrails(text, is_input=False)
 │   │
 │   ├─► Pattern Check
 │   │   └─► Replace with [REDACTED]
 │   │
 │   ├─► NeMo Guardrails (if available)
 │   │   └─► Sanitization
 │   │
 │   └─► Result
 │       └─► Sanitized output
 │
 └─► OUTPUT (Safe)
```

## 7. LLM Access Flow

```
Agent Needs LLM
 │
 ├─► get_litellm_llm()
 │   │
 │   ├─► Check LITELLM_HOST
 │   │   └─► http://localhost:4000
 │   │
 │   ├─► Create ChatOpenAI client
 │   │   ├─► base_url = LITELLM_HOST
 │   │   ├─► model = LITELLM_MODEL
 │   │   └─► api_key = OPENAI_API_KEY
 │   │
 │   └─► Return LLM instance
 │
 ├─► Agent uses LLM
 │   └─► LLM request → LitELLM server
 │
 ├─► LitELLM Server
 │   ├─► Reads litellm_config.yaml
 │   ├─► Routes to provider
 │   │   ├─► Azure OpenAI
 │   │   ├─► OpenAI
 │   │   └─► Other providers
 │   │
 │   ├─► Caching (if enabled)
 │   │
 │   └─► Returns response
 │
 └─► Agent receives response
```

## 8. Error Handling Flow

```
Operation
 │
 ├─► Try
 │   │
 │   ├─► Tool Execution
 │   │   ├─► Success → Return result
 │   │   └─► Error → Catch
 │   │
 │   ├─► Agent Execution
 │   │   ├─► Success → Continue
 │   │   └─► Error → Retry (if configured)
 │   │
 │   └─► Workflow Execution
 │       ├─► Success → Return results
 │       └─► Error → Log and return error
 │
 └─► Catch
     ├─► Log error
     ├─► Return error message
     └─► Continue (if possible)
```

## 9. File Structure with Data Flow

```
uploads/
 └─► job_description.docx
     │
     └─► [Document Parser Tool reads]
         │
         └─► Extracted to memory
             │
             └─► Used by agents
                 │
                 └─► Results stored in memory
                     │
                     └─► [If using CLI]
                         │
                         └─► results/
                             └─► search_results_*.json
```

## 10. API Request Flow

```
Client
 │
 ├─► POST /api/v1/search/upload
 │   │
 │   ├─► FastAPI receives file
 │   │
 │   ├─► Validate file type
 │   │
 │   ├─► Save to uploads/
 │   │
 │   ├─► Apply input guardrails
 │   │
 │   ├─► Generate job_id
 │   │
 │   ├─► Start background task
 │   │   └─► execute_search()
 │   │       └─► workflow.execute()
 │   │
 │   └─► Return job_id
 │
 ├─► GET /api/v1/search/{job_id}/status
 │   └─► Return status: processing/completed/failed
 │
 └─► GET /api/v1/search/{job_id}
     │
     ├─► Check job_store
     │
     ├─► Apply output guardrails
     │
     └─► Return results
```

---

These diagrams show how all components interact in the system!

