# Complete Step-by-Step Walkthrough

## Table of Contents
1. [Overall System Flow](#overall-system-flow)
2. [Project Structure Explained](#project-structure-explained)
3. [Configuration Files](#configuration-files)
4. [Core Components Deep Dive](#core-components-deep-dive)
5. [Agent System Explained](#agent-system-explained)
6. [Tool System Explained](#tool-system-explained)
7. [Workflow Orchestration](#workflow-orchestration)
8. [API Layer](#api-layer)
9. [Integration Layer](#integration-layer)
10. [Complete Execution Flow](#complete-execution-flow)

---

## Overall System Flow

### High-Level Flow Diagram

```
User Uploads Job Description
         ↓
    FastAPI Receives File
         ↓
    Apply Input Guardrails (Security Check)
         ↓
    Workflow Orchestrator Initializes
         ↓
    ┌─────────────────────────────────────┐
    │  STEP 1: Document Parser Agent      │
    │  - Reads .docx file                 │
    │  - Extracts skills, keywords        │
    │  - Returns structured JSON          │
    └──────────────┬──────────────────────┘
                   ↓
    ┌─────────────────────────────────────┐
    │  STEP 2: Parallel Search            │
    │  ├─ GitHub Search Agent             │
    │  │  └─ GitHub API                   │
    │  └─ Web/LinkedIn Search Agent       │
    │     ├─ SerpAPI / Google CSE         │
    │     └─ LinkedIn API                 │
    └──────────────┬──────────────────────┘
                   ↓
    ┌─────────────────────────────────────┐
    │  STEP 3: Profile Summarizer Agent   │
    │  - Analyzes all profiles            │
    │  - Calculates match scores          │
    │  - Generates summaries              │
    └──────────────┬──────────────────────┘
                   ↓
    Apply Output Guardrails (Security Check)
                   ↓
    Return Results to User
```

---

## Project Structure Explained

### Directory Tree with Explanations

```
AI-powered-candidate-search/
│
├── src/                          # Main source code directory
│   ├── __init__.py              # Package initialization
│   ├── config.py                # Configuration management (READS .env and config.yaml)
│   │
│   ├── agents/                  # AI Agent Definitions
│   │   ├── __init__.py          # Exports all agents
│   │   ├── document_parser_agent.py      # Agent 1: Parses job descriptions
│   │   ├── github_searcher_agent.py     # Agent 2: Searches GitHub
│   │   ├── web_linkedin_searcher_agent.py # Agent 3: Searches web/LinkedIn
│   │   └── profile_summarizer_agent.py   # Agent 4: Summarizes profiles
│   │
│   ├── tools/                   # Custom Tools for Agents
│   │   ├── __init__.py          # Exports all tools
│   │   ├── document_parser.py   # Tool: Parse .docx files
│   │   ├── github_search.py     # Tool: Search GitHub API
│   │   ├── web_search.py        # Tool: Search web (SerpAPI/Google)
│   │   ├── linkedin_search.py   # Tool: Search LinkedIn
│   │   └── profile_analyzer.py  # Tool: Analyze and score profiles
│   │
│   ├── workflow/                # Workflow Orchestration
│   │   ├── __init__.py          # Exports workflow
│   │   └── candidate_search_workflow.py # Main orchestrator
│   │
│   ├── api/                     # FastAPI Application
│   │   ├── __init__.py          # Package initialization
│   │   └── main.py              # FastAPI endpoints and routes
│   │
│   └── utils/                   # Utility Functions
│       ├── __init__.py          # Package initialization
│       ├── litellm_client.py    # LitELLM integration for LLM access
│       └── guardrails.py        # NeMo Guardrails integration
│
├── guardrails/                  # Guardrails Configuration
│   └── config.yml               # NeMo Guardrails settings
│
├── config.yaml                  # Main application configuration
├── litellm_config.yaml          # LitELLM gateway configuration
├── requirements.txt             # Python dependencies
│
├── main.py                      # CLI entry point (command-line usage)
├── run_api.py                   # API server entry point
├── start_litellm.py            # Script to start LitELLM server
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
│
├── uploads/                     # Directory for uploaded job descriptions
├── results/                     # Directory for search results
└── logs/                        # Application logs
```

---

## Configuration Files

### 1. `.env` File (Environment Variables)

**Purpose**: Stores sensitive information and runtime configuration

**Location**: Root directory (create from `.env.example`)

**Key Variables Explained**:

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_api_key_here
# ↑ Required: Your OpenAI API key for LLM access
# Used by: litellm_client.py, agents

AZURE_OPENAI_API_KEY=your_azure_openai_key_here
# ↑ Optional: Azure OpenAI key (alternative to OpenAI)
# Used by: litellm_client.py (fallback)

AZURE_OPENAI_ENDPOINT=your_azure_endpoint_here
# ↑ Optional: Azure OpenAI endpoint URL
# Format: https://your-resource.openai.azure.com/

AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
# ↑ Optional: Name of your Azure deployment
# Example: gpt-4-turbo

# LitELLM Configuration
LITELLM_API_KEY=your_litellm_key
# ↑ Optional: LitELLM API key (if using hosted LitELLM)

LITELLM_HOST=http://localhost:4000
# ↑ LitELLM server URL
# Default: http://localhost:4000 (local server)
# Used by: litellm_client.py to route LLM requests

LITELLM_MODEL=gpt-4-turbo-preview
# ↑ Model name to use through LitELLM
# Used by: litellm_client.py

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
# ↑ Required: GitHub Personal Access Token
# Get from: GitHub Settings → Developer settings → Personal access tokens
# Used by: github_search.py tool

GITHUB_USERNAME=your_github_username
# ↑ Optional: Your GitHub username
# Used by: github_search.py (for authentication)

# LinkedIn Configuration (Optional)
LINKEDIN_EMAIL=your_linkedin_email
# ↑ Optional: LinkedIn email (for LinkedIn API)

LINKEDIN_PASSWORD=your_linkedin_password
# ↑ Optional: LinkedIn password (for LinkedIn API)

LINKEDIN_API_KEY=your_linkedin_api_key
# ↑ Optional: LinkedIn API key (official API)

# Web Search Configuration (Optional)
SERPAPI_KEY=your_serpapi_key
# ↑ Optional: SerpAPI key for web search
# Get from: https://serpapi.com
# Used by: web_search.py

GOOGLE_API_KEY=your_google_api_key
# ↑ Optional: Google Custom Search API key
# Used by: web_search.py (alternative to SerpAPI)

GOOGLE_CSE_ID=your_google_cse_id
# ↑ Optional: Google Custom Search Engine ID
# Used by: web_search.py

# Guardrails Configuration
NEMO_GUARDRAILS_CONFIG_PATH=./guardrails/config.yml
# ↑ Path to NeMo Guardrails configuration
# Used by: guardrails.py

# Application Configuration
LOG_LEVEL=INFO
# ↑ Logging level: DEBUG, INFO, WARNING, ERROR
# Used by: All modules for logging

MAX_CANDIDATES=10
# ↑ Maximum number of candidates to return
# Used by: candidate_search_workflow.py

SEARCH_TIMEOUT=30
# ↑ Timeout for API calls (seconds)
# Used by: All API tools

# Security
SECRET_KEY=your_secret_key_here
# ↑ Secret key for security (generate random string)
# Used by: FastAPI for security features

ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000
# ↑ CORS allowed origins (comma-separated)
# Used by: FastAPI CORS middleware
```

**How It's Loaded**:
- Loaded by `src/config.py` using `pydantic-settings`
- Automatically reads from `.env` file
- Validates required fields
- Makes values available as `settings.VARIABLE_NAME`

---

### 2. `config.yaml` (Application Configuration)

**Purpose**: YAML-based configuration for application behavior

**Location**: Root directory

**Structure Explained**:

```yaml
# Agent Configuration
agents:
  document_parser:
    name: "Document Parser Agent"
    role: "Extract key information from job descriptions"
    goal: "Identify skills, experience requirements, and keywords"
    backstory: "You are an expert at analyzing job descriptions..."
    max_iter: 3          # Maximum iterations agent can take
    verbose: true        # Print detailed logs

  github_searcher:
    # Similar structure for GitHub search agent
    max_iter: 5          # More iterations for complex searches

  web_linkedin_searcher:
    # Similar structure for web/LinkedIn agent
    max_iter: 5

  profile_summarizer:
    # Similar structure for profile summarizer
    max_iter: 3

# Workflow Configuration
workflow:
  max_candidates: 10           # Maximum candidates to return
  search_timeout: 30          # Timeout for searches (seconds)
  parallel_searches: true      # Run searches in parallel
  enable_caching: true        # Enable result caching

# LLM Configuration
llm:
  provider: "litellm"          # LLM provider: "litellm" or "direct"
  model: "gpt-4-turbo-preview" # Model to use
  temperature: 0.3            # LLM temperature (0-1, lower = more focused)
  max_tokens: 2000            # Maximum tokens in response

# Guardrails Configuration
guardrails:
  enabled: true               # Enable/disable guardrails
  config_path: "./guardrails/config.yml"
  block_sensitive_info: true  # Block sensitive information
  input_filtering: true       # Filter input
  output_filtering: true      # Filter output

# API Configuration
apis:
  github:
    rate_limit: 5000          # GitHub API rate limit
    timeout: 30               # Request timeout
    retry_attempts: 3         # Retry on failure

  linkedin:
    rate_limit: 100
    timeout: 30
    retry_attempts: 3

  web_search:
    rate_limit: 100
    timeout: 30
    retry_attempts: 3

# Logging Configuration
logging:
  level: "INFO"               # Log level
  format: "json"             # Log format: "json" or "text"
  file: "logs/candidate_search.log"
  max_size: "10MB"           # Max log file size
  backup_count: 5            # Number of backup log files
```

**How It's Loaded**:
- Loaded by `src/config.py` using `yaml.safe_load()`
- Available as `yaml_config` dictionary
- Used by agents and workflow for configuration

---

### 3. `litellm_config.yaml` (LitELLM Configuration)

**Purpose**: Configuration for LitELLM gateway (unified LLM access)

**Location**: Root directory

**Structure Explained**:

```yaml
model_list:
  - model_name: gpt-4-turbo-preview
    litellm_params:
      model: azure/gpt-4-turbo        # Format: provider/model
      api_key: os.environ/AZURE_OPENAI_API_KEY  # Read from environment
      api_base: os.environ/AZURE_OPENAI_ENDPOINT
      api_version: "2024-02-15-preview"

litellm_settings:
  drop_params: true          # Drop unsupported parameters
  set_verbose: true          # Verbose logging
  num_retries: 3             # Retry failed requests
  timeout: 60                # Request timeout (seconds)
  
  cache:
    type: redis              # Cache type: redis, in_memory
    host: localhost
    port: 6379
    ttl: 3600                # Cache TTL (seconds)

router_settings:
  routing_strategy: "simple-shuffle"  # Load balancing strategy
  allowed_fails: 2           # Allowed failures before switching
  cooldown_time: 60          # Cooldown after failure (seconds)

monitoring:
  enabled: true
  provider: "prometheus"      # Monitoring provider
  metrics_port: 4001         # Port for metrics
```

**How It's Used**:
- Read by LitELLM server when started
- Provides unified interface to multiple LLM providers
- Routes requests to appropriate provider

---

### 4. `guardrails/config.yml` (Guardrails Configuration)

**Purpose**: NeMo Guardrails configuration for security

**Location**: `guardrails/config.yml`

**Structure Explained**:

```yaml
models:
  - type: main
    engine: openai
    model: gpt-4-turbo-preview

instructions:
  - type: general
    content: |
      You are a professional candidate search assistant.
      Always maintain privacy and security.
      Do not expose sensitive personal information like:
      - Social Security Numbers
      - Credit Card Numbers
      - Passwords
      - Home Addresses
      - Phone Numbers
      - Email Addresses (unless explicitly required)
      - Financial Information

rails:
  input:
    flows:
      - check_sensitive_info    # Check for sensitive patterns
      - check_profanity         # Check for inappropriate language
      - check_pii               # Check for PII
  
  output:
    flows:
      - check_sensitive_info
      - check_profanity
      - check_pii
      - validate_response       # Validate response format

flows:
  - name: check_sensitive_info
    steps:
      - Check for sensitive patterns (SSN, credit cards, etc.)
      - Block if detected
  
  - name: check_profanity
    steps:
      - Check for inappropriate language
      - Block if detected
  
  - name: check_pii
    steps:
      - Check for personally identifiable information
      - Sanitize if detected
  
  - name: validate_response
    steps:
      - Ensure response is relevant and professional
      - Validate format
```

**How It's Used**:
- Loaded by `src/utils/guardrails.py`
- Applied to all inputs and outputs
- Blocks or sanitizes sensitive information

---

## Core Components Deep Dive

### 1. `src/config.py` - Configuration Management

**Purpose**: Central configuration management

**What It Does**:
1. Loads environment variables from `.env`
2. Loads YAML configuration from `config.yaml`
3. Provides `settings` object for environment variables
4. Provides `yaml_config` dictionary for YAML config

**Code Breakdown**:

```python
from pydantic_settings import BaseSettings
from pydantic import Field
import yaml

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # LLM Configuration
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    # ↑ Required field, reads from OPENAI_API_KEY env var
    
    azure_openai_api_key: Optional[str] = Field(None, env="AZURE_OPENAI_API_KEY")
    # ↑ Optional field, defaults to None
    
    # ... more fields ...
    
    class Config:
        env_file = ".env"          # Read from .env file
        env_file_encoding = "utf-8"

# Global settings instance
settings = Settings()  # ← This loads all env vars

# Load YAML config
def load_yaml_config(config_path: str = "config.yaml") -> dict:
    """Load configuration from YAML file"""
    with open(config_path, "r") as f:
        return yaml.safe_load(f)

yaml_config = load_yaml_config()  # ← This loads YAML config
```

**Usage Example**:
```python
from src.config import settings, yaml_config

# Access environment variable
api_key = settings.openai_api_key

# Access YAML config
max_candidates = yaml_config.get("workflow", {}).get("max_candidates", 10)
```

---

### 2. `src/utils/litellm_client.py` - LLM Client

**Purpose**: Provides unified LLM access through LitELLM or direct connection

**What It Does**:
1. Creates LLM instances configured for LitELLM gateway
2. Provides fallback to direct OpenAI/Azure OpenAI
3. Handles configuration from environment variables

**Code Breakdown**:

```python
from langchain_openai import ChatOpenAI
from src.config import settings

def get_litellm_llm():
    """
    Get LLM instance configured to use LitELLM gateway
    """
    # Get LitELLM server URL from config
    base_url = settings.litellm_host  # e.g., "http://localhost:4000"
    
    # Create OpenAI-compatible client pointing to LitELLM
    llm = ChatOpenAI(
        model=settings.litellm_model,        # Model name
        temperature=0.3,                     # Creativity level
        max_tokens=2000,                     # Max response length
        openai_api_base=base_url,            # LitELLM server URL
        openai_api_key=settings.openai_api_key or "dummy-key",
    )
    
    return llm

def get_direct_llm():
    """
    Get direct LLM instance (bypassing LitELLM) for fallback
    """
    # Check if Azure OpenAI is configured
    if settings.azure_openai_endpoint and settings.azure_openai_api_key:
        # Use Azure OpenAI
        llm = ChatOpenAI(
            model=settings.azure_openai_deployment_name or "gpt-4-turbo",
            temperature=0.3,
            max_tokens=2000,
            openai_api_base=settings.azure_openai_endpoint,  # Azure endpoint
            openai_api_key=settings.azure_openai_api_key,
            api_version="2024-02-15-preview"
        )
    else:
        # Use OpenAI directly
        llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.3,
            max_tokens=2000,
            openai_api_key=settings.openai_api_key
        )
    
    return llm
```

**Flow**:
```
Agent needs LLM
    ↓
Calls get_litellm_llm()
    ↓
Creates ChatOpenAI client
    ↓
Points to LitELLM server (http://localhost:4000)
    ↓
LitELLM routes to actual LLM provider
    ↓
Returns response
```

**Why LitELLM?**:
- Unified interface to multiple LLM providers
- Load balancing across providers
- Caching and rate limiting
- Cost tracking
- Fallback mechanisms

---

### 3. `src/utils/guardrails.py` - Security Guardrails

**Purpose**: Applies security filters to inputs and outputs

**What It Does**:
1. Initializes NeMo Guardrails (if available)
2. Filters input for sensitive information
3. Sanitizes output for sensitive information
4. Falls back to basic pattern matching if NeMo not available

**Code Breakdown**:

```python
class GuardrailsManager:
    """Manager for NVIDIA NeMo Guardrails"""
    
    def __init__(self):
        self.enabled = yaml_config.get("guardrails", {}).get("enabled", True)
        self.config_path = settings.nemo_guardrails_config_path
        
        if self.enabled:
            self._initialize_guardrails()
    
    def filter_input(self, text: str) -> tuple[str, bool]:
        """
        Filter input text for sensitive information
        Returns: (filtered_text, is_blocked)
        """
        if not self.enabled:
            return text, False
        
        # Basic sensitive information patterns
        sensitive_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN: 123-45-6789
            r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card
        ]
        
        import re
        for pattern in sensitive_patterns:
            if re.search(pattern, text):
                return text, True  # Block if sensitive info found
        
        # Use NeMo Guardrails if available
        if self._guardrails_instance:
            # Advanced filtering with NeMo
            pass
        
        return text, False
    
    def filter_output(self, text: str) -> tuple[str, bool]:
        """
        Filter output text for sensitive information
        Returns: (filtered_text, is_blocked)
        """
        # Similar to filter_input but also sanitizes
        filtered_text = text
        
        # Replace sensitive patterns with [REDACTED]
        for pattern in sensitive_patterns:
            filtered_text = re.sub(pattern, "[REDACTED]", filtered_text)
        
        return filtered_text, False
```

**Usage Flow**:
```
User uploads job description
    ↓
apply_guardrails(text, is_input=True)
    ↓
Check for SSN, credit cards, etc.
    ↓
If found → Block request
If not found → Continue processing
    ↓
Agent generates response
    ↓
apply_guardrails(text, is_input=False)
    ↓
Sanitize sensitive information
    ↓
Return safe response
```

---

## Agent System Explained

### What is an Agent?

An **Agent** in CrewAI is an AI entity with:
- **Role**: What the agent does (e.g., "Document Parser")
- **Goal**: What the agent wants to achieve
- **Backstory**: Context about the agent's expertise
- **Tools**: Functions the agent can use
- **LLM**: Language model for reasoning

### Agent Architecture

```
Agent
├── Role: "Document Parser"
├── Goal: "Extract key information"
├── Backstory: "You are an expert..."
├── Tools: [DocumentParserTool]
└── LLM: ChatOpenAI (via LitELLM)
```

### 1. Document Parser Agent

**File**: `src/agents/document_parser_agent.py`

**Purpose**: Extracts structured information from job descriptions

**Code Breakdown**:

```python
from crewai import Agent
from src.tools import DocumentParserTool
from src.utils.litellm_client import get_litellm_llm
from src.config import yaml_config

def create_document_parser_agent() -> Agent:
    """Create the document parser agent"""
    
    # Get agent config from YAML
    agent_config = yaml_config.get("agents", {}).get("document_parser", {})
    
    # Get LLM instance
    llm = get_litellm_llm()
    
    # Create agent
    agent = Agent(
        role=agent_config.get("role", "Document Parser"),
        # ↑ What the agent does
        
        goal=agent_config.get("goal", "Extract key information"),
        # ↑ What the agent wants to achieve
        
        backstory=agent_config.get("backstory", "You are an expert..."),
        # ↑ Context for the LLM
        
        tools=[DocumentParserTool()],
        # ↑ Tools the agent can use
        
        llm=llm,
        # ↑ Language model for reasoning
        
        verbose=agent_config.get("verbose", True),
        # ↑ Print detailed logs
        
        max_iter=agent_config.get("max_iter", 3),
        # ↑ Maximum reasoning iterations
        
        allow_delegation=False
        # ↑ Can't delegate to other agents
    )
    
    return agent
```

**How It Works**:
1. Agent receives task: "Parse job description at path X"
2. Agent uses `DocumentParserTool` to read and parse file
3. Agent uses LLM to extract structured information
4. Agent returns JSON with skills, keywords, etc.

---

### 2. GitHub Search Agent

**File**: `src/agents/github_searcher_agent.py`

**Purpose**: Searches GitHub for matching developer profiles

**Code Breakdown**:

```python
def create_github_searcher_agent() -> Agent:
    agent = Agent(
        role="GitHub Search Specialist",
        goal="Find GitHub profiles matching job requirements",
        backstory="You are a GitHub expert...",
        tools=[GitHubSearchTool()],  # ← Uses GitHubSearchTool
        llm=get_litellm_llm(),
        verbose=True,
        max_iter=5,  # More iterations for complex searches
        allow_delegation=False
    )
    return agent
```

**How It Works**:
1. Agent receives task: "Find developers with Python, AWS skills"
2. Agent uses `GitHubSearchTool` to search GitHub API
3. Agent analyzes results and filters by requirements
4. Agent returns list of matching GitHub profiles

---

### 3. Web/LinkedIn Search Agent

**File**: `src/agents/web_linkedin_searcher_agent.py`

**Purpose**: Searches web and LinkedIn for professional profiles

**Code Breakdown**:

```python
def create_web_linkedin_searcher_agent() -> Agent:
    agent = Agent(
        role="Web/LinkedIn Search Specialist",
        goal="Find professional profiles matching job requirements",
        backstory="You are a recruitment expert...",
        tools=[WebSearchTool(), LinkedInSearchTool()],  # ← Two tools
        llm=get_litellm_llm(),
        verbose=True,
        max_iter=5,
        allow_delegation=False
    )
    return agent
```

**How It Works**:
1. Agent receives task: "Find professionals with X skills"
2. Agent uses `WebSearchTool` to search web (SerpAPI/Google)
3. Agent uses `LinkedInSearchTool` to search LinkedIn
4. Agent combines and filters results
5. Agent returns list of professional profiles

---

### 4. Profile Summarizer Agent

**File**: `src/agents/profile_summarizer_agent.py`

**Purpose**: Analyzes and summarizes candidate profiles

**Code Breakdown**:

```python
def create_profile_summarizer_agent() -> Agent:
    agent = Agent(
        role="Profile Summarizer",
        goal="Create concise summaries highlighting candidate strengths",
        backstory="You are an expert at analyzing candidate profiles...",
        tools=[ProfileAnalyzerTool()],  # ← Uses ProfileAnalyzerTool
        llm=get_litellm_llm(),
        verbose=True,
        max_iter=3,
        allow_delegation=False
    )
    return agent
```

**How It Works**:
1. Agent receives task: "Analyze these 10 profiles"
2. Agent uses `ProfileAnalyzerTool` to calculate match scores
3. Agent uses LLM to generate summaries
4. Agent returns analyzed profiles with scores and summaries

---

## Tool System Explained

### What is a Tool?

A **Tool** is a function that an agent can use to perform actions. Tools extend agent capabilities beyond just LLM reasoning.

### Tool Architecture

```
Tool (BaseTool from crewai_tools)
├── name: "Document Parser"
├── description: "What the tool does"
├── args_schema: Input validation
└── _run(): Actual implementation
```

### 1. Document Parser Tool

**File**: `src/tools/document_parser.py`

**Purpose**: Parses .docx files and extracts information

**Code Breakdown**:

```python
from crewai_tools import BaseTool
from docx import Document
from pydantic import BaseModel, Field

class DocumentParserInput(BaseModel):
    """Input schema for document parser"""
    file_path: str = Field(..., description="Path to the document")

class DocumentParserTool(BaseTool):
    name: str = "Document Parser"
    description: str = "Extracts information from job description documents"
    args_schema: type[BaseModel] = DocumentParserInput

    def _run(self, file_path: str) -> str:
        """Parse document and extract information"""
        # Read the document
        doc = Document(file_path)
        
        # Extract text
        full_text = "\n".join([para.text for para in doc.paragraphs])
        
        # Extract structured information
        extracted_info = self._extract_information(full_text)
        
        return json.dumps(extracted_info, indent=2)
    
    def _extract_information(self, text: str) -> Dict[str, Any]:
        """Extract structured information from text"""
        info = {
            "skills": [],
            "technologies": [],
            "experience_keywords": [],
            "years_of_experience": "",
            "location": "",
            "job_type": ""
        }
        
        # Extract skills (e.g., "AWS", "Python")
        common_skills = ["AWS", "Azure", "GCP", "Docker", "Kubernetes", ...]
        for skill in common_skills:
            if skill.lower() in text.lower():
                info["technologies"].append(skill)
        
        # Extract years of experience (e.g., "7+ years")
        experience_pattern = r'(\d+)\+?\s*years?\s*(?:of\s*)?experience'
        matches = re.findall(experience_pattern, text, re.IGNORECASE)
        if matches:
            info["years_of_experience"] = max(matches)
        
        # Extract location
        location_pattern = r'Location:\s*([^\n]+)'
        location_match = re.search(location_pattern, text, re.IGNORECASE)
        if location_match:
            info["location"] = location_match.group(1).strip()
        
        return info
```

**Flow**:
```
Agent calls tool with file_path
    ↓
Tool reads .docx file
    ↓
Extracts text from paragraphs
    ↓
Uses regex patterns to extract:
  - Skills (AWS, Python, etc.)
  - Experience (7+ years)
  - Location (Chennai, etc.)
  - Technologies
    ↓
Returns JSON with extracted info
```

---

### 2. GitHub Search Tool

**File**: `src/tools/github_search.py`

**Purpose**: Searches GitHub API for developer profiles

**Code Breakdown**:

```python
from github import Github
from src.config import settings

class GitHubSearchTool(BaseTool):
    name: str = "GitHub Profile Search"
    description: str = "Searches GitHub for developer profiles"
    args_schema: type[BaseModel] = GitHubSearchInput

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize GitHub API client
        self.github = Github(settings.github_token)

    def _run(self, keywords: List[str], skills: List[str], ...) -> str:
        """Search GitHub for matching profiles"""
        # Build search query
        query = " ".join(keywords)  # e.g., "Python AWS architecture"
        
        # Search GitHub
        users = self.github.search_users(query)
        
        results = []
        for user in users:
            # Get user profile details
            profile_data = self._get_user_profile(user, skills, min_repos)
            if profile_data:
                results.append(profile_data)
        
        return json.dumps({"profiles": results})
    
    def _get_user_profile(self, user, required_skills, min_repos):
        """Get detailed profile information"""
        # Get repositories
        repos = list(user.get_repos())
        
        if len(repos) < min_repos:
            return None
        
        # Analyze repositories
        languages = {}
        for repo in repos[:20]:
            repo_languages = repo.get_languages()
            for lang, bytes_count in repo_languages.items():
                languages[lang] = languages.get(lang, 0) + bytes_count
        
        # Get top languages
        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Check skill matches
        matched_skills = [skill for skill in required_skills if ...]
        
        return {
            "username": user.login,
            "name": user.name,
            "top_languages": [lang[0] for lang in top_languages],
            "public_repos": user.public_repos,
            "matched_skills": matched_skills,
            "profile_url": user.html_url
        }
```

**Flow**:
```
Agent calls tool with keywords and skills
    ↓
Tool builds GitHub search query
    ↓
Searches GitHub API for users
    ↓
For each user:
  - Get repositories
  - Analyze languages used
  - Check skill matches
  - Calculate profile score
    ↓
Returns JSON with matching profiles
```

---

### 3. Web Search Tool

**File**: `src/tools/web_search.py`

**Purpose**: Searches web for candidate profiles

**Code Breakdown**:

```python
class WebSearchTool(BaseTool):
    name: str = "Web Profile Search"
    
    def _run(self, query: str, skills: List[str], ...) -> str:
        """Search web for candidate profiles"""
        # Build enhanced query
        enhanced_query = f"{query} {' '.join(skills)} profile"
        
        # Try SerpAPI first
        if settings.serpapi_key:
            results = self._search_serpapi(enhanced_query, max_results)
        # Fallback to Google CSE
        elif settings.google_api_key:
            results = self._search_google_cse(enhanced_query, max_results)
        else:
            # Simulate search (for demo)
            results = self._simulate_web_search(enhanced_query, max_results)
        
        return json.dumps({"profiles": results})
    
    def _search_serpapi(self, query: str, max_results: int):
        """Search using SerpAPI"""
        url = "https://serpapi.com/search"
        params = {
            "q": query,
            "api_key": settings.serpapi_key,
            "engine": "google",
            "num": max_results
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        results = []
        for item in data.get("organic_results", []):
            results.append({
                "title": item.get("title"),
                "link": item.get("link"),
                "snippet": item.get("snippet"),
                "source": "web_search"
            })
        return results
```

**Flow**:
```
Agent calls tool with query and skills
    ↓
Tool builds search query
    ↓
Calls SerpAPI or Google CSE
    ↓
Parses search results
    ↓
Returns JSON with profile links
```

---

### 4. Profile Analyzer Tool

**File**: `src/tools/profile_analyzer.py`

**Purpose**: Analyzes profiles and calculates match scores

**Code Breakdown**:

```python
class ProfileAnalyzerTool(BaseTool):
    name: str = "Profile Analyzer"
    
    def _run(self, profiles: List[Dict], job_requirements: Dict) -> str:
        """Analyze profiles and generate summaries"""
        analyzed_profiles = []
        
        for profile in profiles:
            analysis = self._analyze_profile(profile, job_requirements)
            analyzed_profiles.append(analysis)
        
        # Sort by match score
        analyzed_profiles.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        return json.dumps({"analyzed_profiles": analyzed_profiles})
    
    def _analyze_profile(self, profile: Dict, job_requirements: Dict):
        """Analyze a single profile"""
        required_skills = job_requirements.get("skills", [])
        required_technologies = job_requirements.get("technologies", [])
        
        # Calculate match score
        match_score = 0
        matched_skills = []
        
        profile_skills = profile.get("skills", []) + profile.get("top_languages", [])
        
        # Check skill matches
        for skill in required_skills:
            if any(skill.lower() in ps.lower() for ps in profile_skills):
                matched_skills.append(skill)
                match_score += 10  # 10 points per matched skill
        
        # Check technology matches
        for tech in required_technologies:
            if any(tech.lower() in ps.lower() for ps in profile_skills):
                match_score += 15  # 15 points per matched technology
        
        # Extract highlights
        highlights = self._extract_highlights(profile)
        
        # Generate summary
        summary = self._generate_summary(profile, matched_skills, highlights)
        
        return {
            "profile": profile,
            "match_score": min(match_score, 100),  # Cap at 100
            "matched_skills": matched_skills,
            "highlights": highlights,
            "summary": summary,
            "recommendation": "Strong Match" if match_score >= 50 else "Moderate Match"
        }
```

**Flow**:
```
Agent calls tool with profiles and requirements
    ↓
For each profile:
  - Compare skills with requirements
  - Calculate match score (0-100)
  - Extract highlights
  - Generate summary
    ↓
Sort by match score
    ↓
Return analyzed profiles
```

---

## Workflow Orchestration

### Main Workflow File

**File**: `src/workflow/candidate_search_workflow.py`

**Purpose**: Orchestrates the complete candidate search process

**Code Breakdown**:

```python
from crewai import Crew, Process, Task
from src.agents.document_parser_agent import create_document_parser_agent
from src.agents.github_searcher_agent import create_github_searcher_agent
# ... other imports

class CandidateSearchWorkflow:
    """Orchestrates the complete candidate search workflow"""
    
    def __init__(self):
        """Initialize the workflow with all agents"""
        # Create all agents
        self.document_parser = create_document_parser_agent()
        self.github_searcher = create_github_searcher_agent()
        self.web_linkedin_searcher = create_web_linkedin_searcher_agent()
        self.profile_summarizer = create_profile_summarizer_agent()
        
        # Load workflow config
        self.workflow_config = yaml_config.get("workflow", {})
        self.max_candidates = self.workflow_config.get("max_candidates", 10)
    
    def execute(self, job_description_path: str) -> Dict[str, Any]:
        """Execute the complete candidate search workflow"""
        
        # STEP 1: Parse job description
        job_info = self._parse_job_description(job_description_path)
        
        # Apply input guardrails
        job_info_str = json.dumps(job_info)
        filtered_info, is_blocked = apply_guardrails(job_info_str, is_input=True)
        if is_blocked:
            raise ValueError("Job description contains sensitive information")
        
        job_info = json.loads(filtered_info)
        
        # STEP 2: Search GitHub
        github_profiles = self._search_github(job_info)
        
        # STEP 3: Search Web/LinkedIn
        web_profiles = self._search_web_linkedin(job_info)
        
        # STEP 4: Summarize profiles
        all_profiles = github_profiles + web_profiles
        summaries = self._summarize_profiles(all_profiles, job_info)
        
        # Apply output guardrails
        summaries_str = json.dumps(summaries)
        filtered_summaries, _ = apply_guardrails(summaries_str, is_input=False)
        summaries = json.loads(filtered_summaries)
        
        return {
            "job_requirements": job_info,
            "total_candidates_found": len(all_profiles),
            "github_candidates": len(github_profiles),
            "web_linkedin_candidates": len(web_profiles),
            "summaries": summaries,
            "status": "success"
        }
    
    def _parse_job_description(self, file_path: str) -> Dict[str, Any]:
        """Parse job description using document parser agent"""
        # Create task for document parsing
        task = Task(
            description=f"Parse the job description at {file_path}...",
            agent=self.document_parser,
            expected_output="JSON object with extracted requirements"
        )
        
        # Create crew and execute
        crew = Crew(
            agents=[self.document_parser],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        result = crew.kickoff()  # ← Execute the task
        return json.loads(str(result))
    
    def _search_github(self, job_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search GitHub for matching profiles"""
        keywords = job_info.get("experience_keywords", [])
        skills = job_info.get("technologies", [])
        
        task = Task(
            description=f"Search GitHub for profiles matching: {keywords}, {skills}",
            agent=self.github_searcher,
            expected_output="JSON array of GitHub profiles"
        )
        
        crew = Crew(
            agents=[self.github_searcher],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        result = crew.kickoff()
        # Parse and return results
        return json.loads(str(result)).get("profiles", [])
    
    # Similar methods for _search_web_linkedin and _summarize_profiles
```

**Flow**:
```
execute(job_description_path)
    ↓
_parse_job_description()
  → Creates Task
  → Creates Crew with Document Parser Agent
  → Executes task
  → Returns extracted info
    ↓
_search_github()
  → Creates Task
  → Creates Crew with GitHub Search Agent
  → Executes task
  → Returns GitHub profiles
    ↓
_search_web_linkedin()
  → Creates Task
  → Creates Crew with Web/LinkedIn Search Agent
  → Executes task
  → Returns web profiles
    ↓
_summarize_profiles()
  → Creates Task
  → Creates Crew with Profile Summarizer Agent
  → Executes task
  → Returns analyzed profiles
    ↓
Apply guardrails to output
    ↓
Return final results
```

**Key Concepts**:

1. **Task**: A specific job for an agent
   ```python
   task = Task(
       description="What to do",
       agent=which_agent,
       expected_output="What format to return"
   )
   ```

2. **Crew**: A group of agents working on tasks
   ```python
   crew = Crew(
       agents=[agent1, agent2],
       tasks=[task1, task2],
       process=Process.sequential,  # or Process.hierarchical
       verbose=True
   )
   ```

3. **kickoff()**: Execute the crew
   ```python
   result = crew.kickoff()  # Runs all tasks
   ```

---

## API Layer

### FastAPI Application

**File**: `src/api/main.py`

**Purpose**: Provides REST API endpoints for the candidate search system

**Code Breakdown**:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.workflow import CandidateSearchWorkflow

# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered Candidate Search API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store (in production, use database)
job_store: Dict[str, Dict[str, Any]] = {}

@app.post("/api/v1/search/upload")
async def upload_job_description(file: UploadFile = File(...)):
    """Upload job description and start search"""
    # Validate file type
    if not file.filename.endswith(('.docx', '.doc')):
        raise HTTPException(400, "Only .docx files supported")
    
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # Save file
    file_path = UPLOAD_DIR / f"{job_id}_{file.filename}"
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Apply input guardrails
    content_str = content.decode('utf-8', errors='ignore')
    filtered_content, is_blocked = apply_guardrails(content_str, is_input=True)
    if is_blocked:
        os.remove(file_path)
        raise HTTPException(400, "File contains sensitive information")
    
    # Initialize workflow
    workflow = CandidateSearchWorkflow()
    
    # Store job info
    job_store[job_id] = {
        "status": "processing",
        "file_path": str(file_path),
        "results": None
    }
    
    # Execute workflow in background
    background_tasks.add_task(execute_search, job_id, str(file_path), workflow)
    
    return {
        "job_id": job_id,
        "status": "processing",
        "message": "Search started"
    }

@app.get("/api/v1/search/{job_id}")
async def get_search_results(job_id: str):
    """Get search results by job ID"""
    if job_id not in job_store:
        raise HTTPException(404, "Job not found")
    
    job_info = job_store[job_id]
    
    # Apply output guardrails
    if job_info.get("results"):
        results_str = str(job_info["results"])
        filtered_results, is_blocked = apply_guardrails(results_str, is_input=False)
        if is_blocked:
            return JSONResponse(403, {"error": "Results blocked"})
    
    return {
        "job_id": job_id,
        "status": job_info["status"],
        "results": job_info.get("results")
    }

def execute_search(job_id: str, file_path: str, workflow: CandidateSearchWorkflow):
    """Execute candidate search workflow"""
    try:
        job_store[job_id]["status"] = "processing"
        
        # Execute workflow
        results = workflow.execute(file_path)
        
        # Store results
        job_store[job_id]["results"] = results
        job_store[job_id]["status"] = "completed"
    except Exception as e:
        job_store[job_id]["status"] = "failed"
        job_store[job_id]["error"] = str(e)
```

**API Endpoints**:

1. **POST /api/v1/search/upload**
   - Uploads job description file
   - Starts background search
   - Returns job ID

2. **GET /api/v1/search/{job_id}**
   - Gets search results
   - Returns candidate summaries

3. **GET /api/v1/search/{job_id}/status**
   - Gets search status
   - Returns: processing/completed/failed

4. **GET /health**
   - Health check endpoint

---

## Complete Execution Flow

### End-to-End Flow

```
1. USER ACTION
   User uploads job_description.docx via API or CLI
   ↓
2. API LAYER (if using API)
   FastAPI receives file
   - Validates file type
   - Saves to uploads/
   - Applies input guardrails
   - Generates job_id
   ↓
3. WORKFLOW INITIALIZATION
   CandidateSearchWorkflow.__init__()
   - Creates all 4 agents
   - Loads configuration
   ↓
4. STEP 1: DOCUMENT PARSING
   _parse_job_description()
   - Creates Task for Document Parser Agent
   - Agent uses DocumentParserTool
   - Tool reads .docx file
   - Tool extracts skills, keywords, etc.
   - Agent uses LLM to structure data
   - Returns JSON with requirements
   ↓
5. INPUT GUARDRAILS
   apply_guardrails(job_info, is_input=True)
   - Checks for SSN, credit cards, etc.
   - Blocks if sensitive info found
   ↓
6. STEP 2: GITHUB SEARCH
   _search_github(job_info)
   - Creates Task for GitHub Search Agent
   - Agent uses GitHubSearchTool
   - Tool calls GitHub API
   - Tool analyzes profiles
   - Returns matching GitHub profiles
   ↓
7. STEP 3: WEB/LINKEDIN SEARCH
   _search_web_linkedin(job_info)
   - Creates Task for Web/LinkedIn Search Agent
   - Agent uses WebSearchTool and LinkedInSearchTool
   - Tools call SerpAPI/Google CSE/LinkedIn API
   - Returns matching professional profiles
   ↓
8. STEP 4: PROFILE SUMMARIZATION
   _summarize_profiles(all_profiles, job_info)
   - Creates Task for Profile Summarizer Agent
   - Agent uses ProfileAnalyzerTool
   - Tool calculates match scores
   - Tool generates summaries
   - Returns analyzed profiles with scores
   ↓
9. OUTPUT GUARDRAILS
   apply_guardrails(summaries, is_input=False)
   - Sanitizes sensitive information
   - Replaces patterns with [REDACTED]
   ↓
10. RETURN RESULTS
    Workflow returns:
    {
      "job_requirements": {...},
      "total_candidates_found": 15,
      "summaries": [...]
    }
    ↓
11. API RESPONSE (if using API)
    Returns results to user
    ↓
12. CLI OUTPUT (if using CLI)
    Prints results to console
    Saves to results/ directory
```

### Data Flow Example

```
Input: job_description.docx
  ↓
Document Parser Tool extracts:
  {
    "skills": ["Python", "AWS"],
    "technologies": ["AWS", "Docker", "Kubernetes"],
    "experience_keywords": ["architecture", "microservices"],
    "years_of_experience": "7",
    "location": "Chennai"
  }
  ↓
GitHub Search Tool searches for:
  Query: "Python AWS architecture microservices"
  Returns: [
    {
      "username": "dev123",
      "top_languages": ["Python", "JavaScript"],
      "matched_skills": ["Python", "AWS"]
    },
    ...
  ]
  ↓
Web Search Tool searches for:
  Query: "Python AWS architecture profile"
  Returns: [
    {
      "title": "John Doe - Python Developer",
      "link": "https://...",
      "snippet": "Expert in Python and AWS..."
    },
    ...
  ]
  ↓
Profile Analyzer Tool analyzes:
  For each profile:
    - Compare skills: Python ✓, AWS ✓
    - Calculate score: 85/100
    - Generate summary: "John Doe is a professional..."
  ↓
Output: [
  {
    "profile": {...},
    "match_score": 85,
    "summary": "John Doe is a professional...",
    "recommendation": "Strong Match"
  },
  ...
]
```

---

## Key Concepts Summary

### 1. Agent
- AI entity with role, goal, backstory
- Uses tools to perform actions
- Uses LLM for reasoning

### 2. Tool
- Function that extends agent capabilities
- Performs specific actions (API calls, file operations)
- Returns structured data

### 3. Task
- Specific job for an agent
- Has description and expected output

### 4. Crew
- Group of agents working together
- Executes tasks sequentially or hierarchically

### 5. Workflow
- Orchestrates multiple agents
- Manages data flow
- Applies security guardrails

### 6. Guardrails
- Security filters for inputs/outputs
- Blocks sensitive information
- Sanitizes responses

### 7. LitELLM
- Unified LLM gateway
- Routes to different providers
- Provides caching and load balancing

---

## Configuration Priority

1. **Environment Variables** (`.env`) - Highest priority
   - API keys
   - Secrets
   - Runtime configuration

2. **YAML Configuration** (`config.yaml`)
   - Agent behavior
   - Workflow settings
   - Application defaults

3. **Code Defaults**
   - Fallback values
   - Hardcoded defaults

---

## Error Handling

### Levels of Error Handling

1. **Tool Level**
   - Try-catch in `_run()` methods
   - Returns error messages as strings

2. **Agent Level**
   - CrewAI handles agent errors
   - Retries on failure

3. **Workflow Level**
   - Try-catch in `execute()`
   - Returns error status

4. **API Level**
   - HTTPException for API errors
   - Returns error responses

---

## Logging

### Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about execution
- **WARNING**: Warning messages
- **ERROR**: Error messages

### Log Locations

- Console: Real-time output
- File: `logs/candidate_search.log`
- Format: JSON (configurable)

---

This completes the comprehensive walkthrough! Each component is explained with code examples and flow diagrams. If you need clarification on any specific part, let me know!

