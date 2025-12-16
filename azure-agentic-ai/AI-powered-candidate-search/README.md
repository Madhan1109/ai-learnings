# AI-Powered Candidate Search System

A production-ready, agentic AI workflow for intelligent candidate search using multiple specialized AI agents. This system automates the entire candidate search process from job description parsing to profile summarization.

## 🎯 Features

### Core Workflow
1. **Upload & Input** - Accepts job description documents (.docx format)
2. **Extract Information** - Extracts skills, experience keywords, and requirements
3. **Search GitHub MCP** - Finds matching developer profiles on GitHub
4. **Search Web/LinkedIn** - Searches professional profiles across web and LinkedIn
5. **Summarize Profiles** - Creates concise summaries with key highlights and match scores

### Must-Have Features
- ✅ **AI Gateway (LitELLM)** - Unified LLM access and routing
- ✅ **Guardrails (NVIDIA NeMo Guardrails)** - Sensitive information blocking (input & output)
- ✅ **Multiple Agents** - Specialized agents for each workflow step
- ✅ **External APIs** - Integration with GitHub, LinkedIn, and web search APIs

## 🏗️ Architecture

### Agent Framework
This system uses **CrewAI** - a powerful framework for orchestrating multi-agent workflows. CrewAI provides:
- Clear agent role definitions
- Task delegation and coordination
- Built-in LLM integration
- Production-ready architecture

### Agents

1. **Document Parser Agent**
   - Role: Extract key information from job descriptions
   - Tools: DocumentParserTool
   - Output: Structured job requirements (skills, technologies, keywords)

2. **GitHub Search Agent**
   - Role: Search GitHub for matching developer profiles
   - Tools: GitHubSearchTool
   - Output: GitHub profiles with repositories and contributions

3. **Web/LinkedIn Search Agent**
   - Role: Search web and LinkedIn for professional profiles
   - Tools: WebSearchTool, LinkedInSearchTool
   - Output: Professional candidate profiles

4. **Profile Summarizer Agent**
   - Role: Summarize candidate profiles with key highlights
   - Tools: ProfileAnalyzerTool
   - Output: Analyzed profiles with match scores and summaries

## 📋 Prerequisites

- Python 3.9 or higher
- API Keys:
  - OpenAI API key (or Azure OpenAI)
  - GitHub Personal Access Token
  - (Optional) SerpAPI key for web search
  - (Optional) LinkedIn API credentials
  - (Optional) Google Custom Search API key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Configure LitELLM** (optional but recommended)
   ```bash
   # Edit litellm_config.yaml with your LLM configuration
   python start_litellm.py
   ```

## 🔧 Configuration

### Environment Variables (.env)

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_api_key
AZURE_OPENAI_API_KEY=your_azure_key  # Optional
AZURE_OPENAI_ENDPOINT=your_endpoint   # Optional

# LitELLM
LITELLM_HOST=http://localhost:4000
LITELLM_MODEL=gpt-4-turbo-preview

# GitHub
GITHUB_TOKEN=your_github_token

# Web Search (Optional)
SERPAPI_KEY=your_serpapi_key
GOOGLE_API_KEY=your_google_key
GOOGLE_CSE_ID=your_cse_id

# LinkedIn (Optional)
LINKEDIN_API_KEY=your_linkedin_key

# Security
SECRET_KEY=your_secret_key
```

### Configuration File (config.yaml)

Edit `config.yaml` to customize:
- Agent behavior and parameters
- Workflow settings
- LLM configuration
- Guardrails settings

## 📖 Usage

### Command Line Interface

```bash
# Run candidate search with a job description file
python main.py path/to/job_description.docx
```

### API Server

1. **Start the API server**
   ```bash
   python run_api.py
   ```

2. **Upload job description**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/search/upload" \
     -F "file=@job_description.docx"
   ```

3. **Check results**
   ```bash
   curl "http://localhost:8000/api/v1/search/{job_id}"
   ```

### Python API

```python
from src.workflow import CandidateSearchWorkflow

# Initialize workflow
workflow = CandidateSearchWorkflow()

# Execute search
results = workflow.execute("path/to/job_description.docx")

# Access results
print(f"Found {results['total_candidates_found']} candidates")
for summary in results['summaries']:
    print(f"Match Score: {summary['match_score']}/100")
    print(f"Summary: {summary['summary']}")
```

## 🔒 Security & Guardrails

### NVIDIA NeMo Guardrails

The system includes integrated guardrails to:
- Block sensitive information (SSN, credit cards, etc.)
- Filter inappropriate content
- Sanitize PII in outputs
- Validate responses

Configuration: `guardrails/config.yml`

### Input/Output Filtering

All inputs and outputs are automatically filtered through guardrails:
- Job descriptions are checked before processing
- Candidate profiles are sanitized before returning
- Sensitive patterns are detected and blocked

## 📊 Workflow Process

```
1. Upload Job Description
   ↓
2. Document Parser Agent extracts requirements
   ↓
3. GitHub Search Agent finds developer profiles
   ↓
4. Web/LinkedIn Search Agent finds professional profiles
   ↓
5. Profile Summarizer Agent analyzes and summarizes
   ↓
6. Return ranked candidate summaries
```

## 🛠️ Development

### Project Structure

```
AI-powered-candidate-search/
├── src/
│   ├── agents/          # Agent definitions
│   ├── tools/           # Custom tools for agents
│   ├── workflow/        # Workflow orchestration
│   ├── api/             # FastAPI application
│   ├── utils/           # Utilities (guardrails, litellm)
│   └── config.py        # Configuration management
├── guardrails/          # NeMo Guardrails configuration
├── uploads/             # Uploaded job descriptions
├── results/             # Search results
├── logs/                # Application logs
├── config.yaml          # Main configuration
├── litellm_config.yaml  # LitELLM configuration
├── requirements.txt     # Python dependencies
├── main.py              # CLI entry point
└── run_api.py           # API server entry point
```

### Adding New Agents

1. Create agent file in `src/agents/`
2. Define agent with role, goal, and backstory
3. Assign appropriate tools
4. Add to workflow in `src/workflow/candidate_search_workflow.py`

### Adding New Tools

1. Create tool file in `src/tools/`
2. Inherit from `BaseTool` (crewai_tools)
3. Implement `_run` method
4. Add to agent's tools list

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest tests/

# Test with sample job description
python main.py sample_job_description.docx
```

## 📝 Sample Job Description

See `sample_job_description.docx` for an example job description format.

## 🚨 Troubleshooting

### Common Issues

1. **LitELLM connection error**
   - Ensure LitELLM server is running: `python start_litellm.py`
   - Check `LITELLM_HOST` in `.env`

2. **GitHub API rate limit**
   - Use GitHub Personal Access Token
   - Reduce `max_candidates` in config

3. **Guardrails not working**
   - Check `guardrails/config.yml` exists
   - Verify NeMo Guardrails is installed: `pip install nemo-guardrails`

4. **Import errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

## 🎯 Production Deployment

### Recommended Setup

1. **Use production LLM gateway**
   - Deploy LitELLM on dedicated server
   - Configure load balancing
   - Set up monitoring

2. **Database for job storage**
   - Replace in-memory `job_store` with Redis/PostgreSQL
   - Implement job queue (Celery, RQ)

3. **API Security**
   - Add authentication (JWT, OAuth)
   - Rate limiting
   - Request validation

4. **Monitoring**
   - Logging (structured logs)
   - Metrics (Prometheus)
   - Error tracking (Sentry)

## 📄 License

This project is created for demonstration and competition purposes.

## 🤝 Contributing

This is a competition project. For improvements:
1. Fork the repository
2. Create feature branch
3. Submit pull request

## 🏆 Competition Features

This implementation includes:
- ✅ Multi-agent architecture with CrewAI
- ✅ Production-ready code structure
- ✅ Comprehensive error handling
- ✅ Security guardrails
- ✅ API integration
- ✅ Detailed documentation
- ✅ Scalable design

## 📞 Support

For issues or questions, please check:
- Configuration files
- Log files in `logs/`
- API documentation at `http://localhost:8000/docs`

---

**Built with ❤️ using CrewAI, LitELLM, and NVIDIA NeMo Guardrails**

