# Quick Start - Real-Time Execution

## Fast Setup (15 minutes)

### 1. Install Flowise (2 min)
```bash
npm install -g flowise
```

### 2. Get API Keys (5 min)
- OpenAI: https://platform.openai.com/api-keys
- GitHub: https://github.com/settings/tokens

### 3. Set Up Python (3 min)
```bash
python -m venv venv
venv\Scripts\activate
pip install python-dotenv pydantic pydantic-settings requests httpx fastapi uvicorn loguru python-docx PyGithub litellm openai langchain langchain-openai
```

### 4. Configure .env (2 min)
```bash
cp env.example .env
notepad .env
# Add your API keys
```

### 5. Start Flowise (1 min)
```bash
flowise start
# Open: http://localhost:3000
```

### 6. Build Workflow (2 min)
- Open Flowise UI
- Create new Chatflow
- Add nodes (see FLOWISE_WORKFLOW.md)
- Save

### 7. Test (1 min)
```bash
python main.py sample_job_description.txt
```

---

## Detailed Steps

See `REAL_TIME_SETUP.md` for complete step-by-step guide.

---

## Common Issues

**Flowise not found?**
```bash
npm install -g flowise
```

**Python import errors?**
```bash
venv\Scripts\activate
pip install -r requirements-minimal.txt
```

**API keys not working?**
- Check `.env` file exists
- Verify keys are correct
- Test keys individually

---

**Ready in 15 minutes!**

