# Quick API Keys Guide

## What You Need (Minimum)

1. **OpenAI API Key** ⭐ REQUIRED
2. **GitHub Token** ⭐ REQUIRED

## Quick Steps

### Get OpenAI API Key (5 minutes)

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up/Login
3. Click **"Create new secret key"**
4. Copy key (starts with `sk-...`)
5. ⚠️ Save it - you won't see it again!

**Cost:** ~$0.10-0.50 per search (new accounts get free credits)

### Get GitHub Token (3 minutes)

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: "Candidate Search"
4. Select: ✅ `public_repo`, ✅ `read:user`
5. Click **"Generate token"**
6. Copy token (starts with `ghp_...`)
7. ⚠️ Save it - you won't see it again!

**Cost:** FREE

## Add to .env File

```bash
notepad .env
```

**Update these lines:**
```env
OPENAI_API_KEY=sk-paste-your-key-here
GITHUB_TOKEN=ghp_paste-your-token-here
```

**Save and close**

## Verify

```bash
venv\Scripts\Activate.ps1
python -c "from src.config import settings; print('OpenAI:', 'OK' if len(settings.openai_api_key) > 20 else 'Not Set'); print('GitHub:', 'OK' if len(settings.github_token) > 20 else 'Not Set')"
```

---

**For detailed instructions, see `API_KEYS_GUIDE.md`**

