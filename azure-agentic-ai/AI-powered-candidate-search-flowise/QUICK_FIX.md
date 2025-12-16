# Quick Fix Guide

## Issue 1: `flowise: command not found`

### Solution: Install Flowise

**Check if Node.js is installed:**
```bash
node --version
npm --version
```

**If Node.js is NOT installed:**
1. Download from: https://nodejs.org/
2. Install LTS version
3. Restart terminal

**Install Flowise:**
```bash
# Option 1: Global installation (recommended)
npm install -g flowise

# Option 2: Use npx (no installation needed)
npx flowise start

# Option 3: Local installation
npm install flowise
npx flowise start
```

**Verify:**
```bash
flowise --version
# or
npx flowise --version
```

**Start Flowise:**
```bash
flowise start
# Flowise will be at: http://localhost:3000
```

## Issue 2: `.env.example` not found

### Solution: Create .env file

The file is named `env.example` (without the dot at the start on Windows).

**Option 1: Copy the file**
```bash
# On Git Bash / Linux / Mac
cp env.example .env

# On Windows PowerShell
Copy-Item env.example .env

# On Windows CMD
copy env.example .env
```

**Option 2: Create manually**
```bash
# Create .env file
touch .env
# or
notepad .env
```

Then copy the contents from `env.example` and fill in your API keys.

## Quick Setup Commands

```bash
# 1. Install Flowise
npm install -g flowise

# 2. Create .env file
cp env.example .env
# Edit .env with your API keys

# 3. Start Flowise
flowise start

# 4. In another terminal, install Python packages
pip install -r requirements-minimal.txt
```

## Next Steps

1. ✅ Flowise installed and running
2. ✅ .env file created with API keys
3. ✅ Python packages installed
4. Follow `FLOWISE_SETUP.md` for workflow setup

