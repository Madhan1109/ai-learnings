# API Keys Guide - What You Need & How to Get Them

## Required API Keys

For the AI-Powered Candidate Search system, you need these API keys:

### 1. OpenAI API Key ⭐ REQUIRED
**Purpose:** Powers the AI agents for document parsing, analysis, and summarization

### 2. GitHub Personal Access Token ⭐ REQUIRED
**Purpose:** Searches GitHub for developer profiles matching job requirements

### 3. SerpAPI Key (Optional)
**Purpose:** Searches the web for candidate profiles (alternative: Google Custom Search)

---

## How to Get Each API Key

### 🔑 API Key 1: OpenAI API Key (REQUIRED)

#### Step-by-Step:

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com/
   - Click **"Sign up"** or **"Log in"**

2. **Create Account (if new)**
   - Sign up with email or Google/Microsoft account
   - Verify your email
   - Complete account setup

3. **Get API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click **"Create new secret key"** button
   - **Name it:** "Candidate Search" (or any name)
   - Click **"Create secret key"**

4. **Copy the Key**
   - ⚠️ **IMPORTANT:** Copy the key immediately!
   - It starts with `sk-` followed by random characters
   - Example: `sk-proj-abc123def456ghi789...`
   - **You won't be able to see it again!**
   - Save it securely

5. **Add Credits (if needed)**
   - Go to: https://platform.openai.com/account/billing
   - Add payment method (required for API usage)
   - Or use free credits if available

#### Free Tier:
- New accounts often get free credits ($5-18)
- Check: https://platform.openai.com/usage

#### Cost:
- GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- GPT-3.5: Much cheaper (~$0.0015 per 1K tokens)
- For this project: ~$0.10-0.50 per search (depending on usage)

---

### 🔑 API Key 2: GitHub Personal Access Token (REQUIRED)

#### Step-by-Step:

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Log in to your GitHub account

2. **Generate New Token**
   - Click **"Generate new token"** dropdown
   - Select **"Generate new token (classic)"**

3. **Configure Token**
   - **Note:** Enter "Candidate Search" (or any name)
   - **Expiration:** Choose:
     - 30 days (for testing)
     - 90 days (recommended)
     - No expiration (for production)
   - **Description:** "For AI candidate search system"

4. **Select Scopes (Permissions)**
   - ✅ **`public_repo`** - Access public repositories
   - ✅ **`read:user`** - Read user profile information
   - (Don't select more than needed)

5. **Generate Token**
   - Scroll down
   - Click **"Generate token"** (green button)

6. **Copy the Token**
   - ⚠️ **IMPORTANT:** Copy the token immediately!
   - It starts with `ghp_` followed by random characters
   - Example: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
   - **You won't be able to see it again!**
   - Save it securely

#### Free Tier:
- ✅ **Completely FREE**
- No limits for personal use
- Rate limit: 5,000 requests/hour (more than enough)

#### Cost:
- **FREE** - No cost for personal access tokens

---

### 🔑 API Key 3: SerpAPI Key (OPTIONAL - for web search)

#### Step-by-Step:

1. **Go to SerpAPI**
   - Visit: https://serpapi.com/
   - Click **"Sign up"** or **"Log in"**

2. **Create Account**
   - Sign up with email
   - Verify email
   - Complete registration

3. **Get API Key**
   - Go to dashboard: https://serpapi.com/dashboard
   - Your API key is displayed on the dashboard
   - Click **"Copy"** to copy it

#### Free Tier:
- ✅ **100 free searches per month**
- Perfect for testing and small projects

#### Paid Plans:
- Starter: $50/month (5,000 searches)
- Business: $250/month (25,000 searches)

#### Alternative: Google Custom Search API (Free)

If you don't want to use SerpAPI:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project (or use existing)

2. **Enable Custom Search API**
   - Go to "APIs & Services" → "Library"
   - Search for "Custom Search API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

4. **Create Custom Search Engine**
   - Visit: https://programmablesearchengine.google.com/
   - Click "Add" to create new search engine
   - Sites to search: `*` (search entire web)
   - Get your **Search Engine ID (CSE ID)**

5. **Add to .env:**
   ```env
   GOOGLE_API_KEY=your-google-api-key
   GOOGLE_CSE_ID=your-cse-id
   ```

---

## Summary: What You Need

### Minimum Required (System Works):
1. ✅ **OpenAI API Key** - For AI processing
2. ✅ **GitHub Token** - For GitHub search

### Optional (Enhanced Features):
3. ⚪ **SerpAPI Key** - For web search (or use Google Custom Search)

---

## Cost Summary

| API | Cost | Free Tier |
|-----|------|-----------|
| **OpenAI** | Pay-per-use | $5-18 free credits |
| **GitHub** | FREE | Unlimited |
| **SerpAPI** | $50+/month | 100 searches/month free |
| **Google CSE** | FREE | 100 searches/day free |

**Total Minimum Cost:** ~$0.10-0.50 per search (OpenAI only)

---

## How to Add API Keys to .env

### Method 1: Manual Edit (Recommended)

```bash
notepad .env
```

**Find and replace these lines:**

```env
# Replace this:
OPENAI_API_KEY=your_openai_api_key_here
# With:
OPENAI_API_KEY=sk-your-actual-key-here

# Replace this:
GITHUB_TOKEN=your_github_personal_access_token
# With:
GITHUB_TOKEN=ghp_your-actual-token-here
```

**Save and close**

### Method 2: Use Helper Script

```bash
venv\Scripts\Activate.ps1
python add_api_keys.py
```

Follow the prompts to enter your keys.

### Method 3: Direct Edit (PowerShell)

```powershell
# Read current .env
$content = Get-Content .env

# Replace OpenAI key (replace YOUR_KEY with actual key)
$content = $content -replace 'OPENAI_API_KEY=.*', 'OPENAI_API_KEY=sk-YOUR_KEY'

# Replace GitHub token (replace YOUR_TOKEN with actual token)
$content = $content -replace 'GITHUB_TOKEN=.*', 'GITHUB_TOKEN=ghp_YOUR_TOKEN'

# Save
$content | Set-Content .env
```

---

## Verify API Keys Are Set

```bash
venv\Scripts\Activate.ps1
python -c "from src.config import settings; print('OpenAI:', '✅' if settings.openai_api_key and len(settings.openai_api_key) > 20 else '❌'); print('GitHub:', '✅' if settings.github_token and len(settings.github_token) > 20 else '❌')"
```

---

## Security Best Practices

1. **Never commit .env to Git**
   - .env is already in .gitignore
   - Don't share your API keys publicly

2. **Use Environment Variables in Production**
   - Don't hardcode keys in code
   - Use secure secret management

3. **Rotate Keys Regularly**
   - Regenerate keys periodically
   - Revoke old keys if compromised

4. **Limit Key Permissions**
   - Only grant minimum required permissions
   - Don't give more access than needed

---

## Troubleshooting

### Issue: OpenAI API Key Invalid
**Solution:**
- Check key starts with `sk-`
- Verify key is not expired
- Check account has credits
- Test at: https://platform.openai.com/api-keys

### Issue: GitHub Token Not Working
**Solution:**
- Check token starts with `ghp_`
- Verify scopes: `public_repo`, `read:user`
- Check token hasn't expired
- Regenerate if needed

### Issue: Rate Limit Exceeded
**Solution:**
- Wait for rate limit to reset
- Use GitHub Personal Access Token (higher limits)
- Check OpenAI usage: https://platform.openai.com/usage

---

## Quick Links

- **OpenAI API Keys:** https://platform.openai.com/api-keys
- **GitHub Tokens:** https://github.com/settings/tokens
- **SerpAPI:** https://serpapi.com/
- **Google Cloud Console:** https://console.cloud.google.com/
- **Google Custom Search:** https://programmablesearchengine.google.com/

---

## Next Steps After Getting Keys

1. ✅ Get OpenAI API key
2. ✅ Get GitHub token
3. ✅ Add to .env file
4. ✅ Verify keys are set
5. ✅ Continue with Flowise setup

**See `CONTINUE_SETUP.md` for next steps!**

