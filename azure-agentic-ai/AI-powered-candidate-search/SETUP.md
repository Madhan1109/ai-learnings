# Setup Guide

## Quick Start

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `SECRET_KEY` - Random secret key for security

**Optional (but recommended):**
- `AZURE_OPENAI_API_KEY` - For Azure OpenAI
- `SERPAPI_KEY` - For web search
- `GOOGLE_API_KEY` - For Google Custom Search
- `LINKEDIN_API_KEY` - For LinkedIn search

### 3. Get API Keys

#### GitHub Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `public_repo` scope
3. Copy token to `.env`

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy to `.env`

#### SerpAPI (Optional)
1. Sign up at https://serpapi.com
2. Get API key from dashboard
3. Copy to `.env`

### 4. Start LitELLM (Optional)

LitELLM provides unified LLM access:

```bash
python start_litellm.py
```

This starts LitELLM on `http://localhost:4000`

### 5. Test the System

```bash
# Using CLI
python main.py sample_job_description.docx

# Or start API server
python run_api.py
# Then visit http://localhost:8000/docs for API documentation
```

## Detailed Configuration

### LitELLM Setup

1. Edit `litellm_config.yaml`:
   ```yaml
   model_list:
     - model_name: gpt-4-turbo-preview
       litellm_params:
         model: azure/gpt-4-turbo
         api_key: os.environ/AZURE_OPENAI_API_KEY
         api_base: os.environ/AZURE_OPENAI_ENDPOINT
   ```

2. Start LitELLM:
   ```bash
   litellm --config litellm_config.yaml
   ```

### Guardrails Setup

1. NeMo Guardrails is automatically configured via `guardrails/config.yml`
2. The system will use basic filtering if NeMo Guardrails is not available
3. For full NeMo Guardrails:
   ```bash
   pip install nemo-guardrails
   ```

### Agent Configuration

Edit `config.yaml` to customize agent behavior:

```yaml
agents:
  document_parser:
    max_iter: 3
    verbose: true
  github_searcher:
    max_iter: 5
    verbose: true
```

## Verification

### Check Installation

```bash
python -c "from src.workflow import CandidateSearchWorkflow; print('✓ Installation successful')"
```

### Test API

```bash
# Start API
python run_api.py

# In another terminal
curl http://localhost:8000/health
```

### Test Workflow

```bash
python main.py sample_job_description.docx
```

## Troubleshooting

### Import Errors
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### API Connection Issues
- Check API keys in `.env`
- Verify network connectivity
- Check API rate limits

### LitELLM Issues
- Ensure LitELLM is running: `python start_litellm.py`
- Check `LITELLM_HOST` in `.env`
- Verify `litellm_config.yaml` syntax

### Guardrails Issues
- Check `guardrails/config.yml` exists
- Install NeMo Guardrails: `pip install nemo-guardrails`
- System will fallback to basic filtering if unavailable

## Next Steps

1. Read `README.md` for usage instructions
2. Review `ARCHITECTURE.md` for system design
3. Check `API.md` for API documentation
4. Test with your own job descriptions

