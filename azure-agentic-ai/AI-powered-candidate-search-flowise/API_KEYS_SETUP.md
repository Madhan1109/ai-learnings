# API Keys Setup Guide

## Quick Setup

If you have your API keys ready, follow these steps:

### Step 1: Edit .env File

```bash
notepad .env
```

### Step 2: Add Your API Keys

**Replace these lines in .env:**

```env
# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=sk-your-actual-openai-key-here
# Remove "your-actual-" and paste your real key starting with "sk-"

# GitHub Personal Access Token (REQUIRED)
GITHUB_TOKEN=ghp_your-actual-github-token-here
# Remove "your-actual-" and paste your real token starting with "ghp_"

# SECRET_KEY (already generated)
SECRET_KEY=cab0de21f79e1d065a6817047ddec552aec7f9c8ff966ec40e724cabebcea763
```

### Step 3: Verify Keys Are Set

```bash
venv\Scripts\Activate.ps1
python -c "from src.config import settings; print('OpenAI:', 'Set' if len(settings.openai_api_key) > 20 else 'Not Set'); print('GitHub:', 'Set' if len(settings.github_token) > 20 else 'Not Set')"
```

### Step 4: Test API Keys

**Test OpenAI:**
```bash
python -c "import openai; from src.config import settings; client = openai.OpenAI(api_key=settings.openai_api_key); print('OpenAI key works!')"
```

**Test GitHub:**
```bash
python -c "from github import Github; from src.config import settings; g = Github(settings.github_token); print('GitHub token works!'); print('User:', g.get_user().login)"
```

---

**After adding keys, continue with Flowise setup!**

