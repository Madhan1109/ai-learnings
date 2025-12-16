# Next Steps - Complete Real-Time Setup

## ✅ What's Already Done

1. ✅ Python 3.13.9 installed
2. ✅ Virtual environment created
3. ✅ All Python packages installed
4. ✅ .env file created from template
5. ✅ Python imports verified

## ⏳ What You Need to Do Next

### Step 1: Upgrade Node.js (5 minutes)

**Current:** Node.js 16.13.2  
**Required:** Node.js 18+ (20 LTS recommended)

**Action:**
1. Download: https://nodejs.org/ (click "LTS" button)
2. Install (replaces Node.js 16)
3. Restart terminal
4. Verify: `node --version` (should show 20.x)

**OR use Docker (no Node.js upgrade needed):**
```bash
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

### Step 2: Get API Keys (10 minutes)

**Required Keys:**

1. **OpenAI API Key**
   - Go to: https://platform.openai.com/api-keys
   - Create account/login
   - Create new API key
   - Copy key (starts with `sk-...`)

2. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Select: `public_repo`, `read:user`
   - Copy token (starts with `ghp_...`)

3. **Generate SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
   Copy the output

### Step 3: Configure .env File (2 minutes)

```bash
notepad .env
```

**Fill in:**
- `OPENAI_API_KEY=sk-your-actual-key-here`
- `GITHUB_TOKEN=ghp_your-actual-token-here`
- `SECRET_KEY=paste-generated-secret-key-here`

**Save and close**

### Step 4: Install Flowise (2 minutes)

**After Node.js upgrade:**
```bash
npm install -g flowise
flowise --version
```

### Step 5: Start Flowise (1 minute)

```bash
flowise start
```

Open: http://localhost:3000

**Keep this terminal open!**

### Step 6: Set Up Tools in Flowise (5 minutes)

1. Open http://localhost:3000
2. Go to **Settings** → **Custom Tools**
3. Add 4 tools (see REAL_TIME_SETUP.md Step 6)
4. Go to **Settings** → **Credentials**
5. Add your API keys

### Step 7: Build Workflow (10 minutes)

1. Click **"New Chatflow"**
2. Name: `Candidate Search`
3. Add nodes (see REAL_TIME_SETUP.md Step 7 or FLOWISE_WORKFLOW.md)
4. Save workflow

### Step 8: Test (5 minutes)

```bash
# Activate venv
venv\Scripts\Activate.ps1

# Test
python main.py sample_job_description.txt
```

---

## Quick Commands Reference

```bash
# Activate Python environment
venv\Scripts\Activate.ps1

# Start Flowise
flowise start

# Run candidate search
python main.py job_description.docx

# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Verify setup
python -c "from src.config import settings; print('OK')"
```

---

## Estimated Time to Complete

- Node.js upgrade: 5 min
- Get API keys: 10 min
- Configure .env: 2 min
- Install Flowise: 2 min
- Set up tools: 5 min
- Build workflow: 10 min
- Test: 5 min

**Total: ~40 minutes**

---

## Need Help?

- **Detailed guide:** See `REAL_TIME_SETUP.md`
- **Workflow building:** See `FLOWISE_WORKFLOW.md`
- **Troubleshooting:** See `INSTALL_TROUBLESHOOTING.md`

---

**Follow these steps and you'll be running real-time candidate search! 🚀**

