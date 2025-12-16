# Node.js Upgrade Guide

## Issue: Node.js 16 (Need 18+)

Flowise requires Node.js 18 or higher. Here's how to upgrade:

## Option 1: Upgrade Node.js (Recommended)

### Step 1: Check Current Version
```bash
node --version
```

### Step 2: Download Node.js 18+ LTS
1. Go to: https://nodejs.org/
2. Download **LTS version** (currently 20.x or 22.x)
3. Run the installer
4. **Important**: Check "Automatically install necessary tools" during installation

### Step 3: Verify Installation
```bash
# Close and reopen terminal first!
node --version
npm --version
```

Should show version 18.x, 20.x, or 22.x

### Step 4: Install Flowise
```bash
npm install -g flowise
```

## Option 2: Use NVM (Node Version Manager) - Advanced

If you need to manage multiple Node.js versions:

### Windows (nvm-windows)
1. Download from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Use commands:
```bash
nvm install 20
nvm use 20
node --version
```

### Mac/Linux
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20
nvm use 20
node --version
```

## Option 3: Use Docker (Alternative to Installing Node.js)

If you can't upgrade Node.js, use Flowise via Docker:

### Step 1: Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop

### Step 2: Run Flowise in Docker
```bash
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

### Step 3: Access Flowise
- Open: http://localhost:3000
- Flowise will run in Docker (no Node.js upgrade needed)

### Step 4: Stop Flowise Docker
```bash
docker stop flowise
docker start flowise  # To start again
```

## Option 4: Use Python-Only Version (No Flowise)

If you can't upgrade Node.js and don't want Docker, you can use the CrewAI version instead:

```bash
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search
# This version doesn't require Node.js
```

## Quick Decision Guide

**Choose based on your situation:**

1. **Can upgrade Node.js?** → Use Option 1 (Easiest)
2. **Need multiple Node versions?** → Use Option 2 (NVM)
3. **Have Docker?** → Use Option 3 (Docker)
4. **Can't upgrade?** → Use Option 4 (CrewAI version)

## Recommended: Upgrade to Node.js 20 LTS

**Why Node.js 20 LTS?**
- ✅ Long-term support
- ✅ Better performance
- ✅ Latest features
- ✅ Compatible with Flowise

**Steps:**
1. Download: https://nodejs.org/ (LTS version)
2. Install (overwrites Node.js 16)
3. Restart terminal
4. Verify: `node --version`
5. Install Flowise: `npm install -g flowise`

## Troubleshooting

### Issue: Node.js version still shows 16 after upgrade
**Solution:**
- Close ALL terminal windows
- Restart computer (sometimes needed)
- Check PATH environment variable

### Issue: npm not found after upgrade
**Solution:**
- Reinstall Node.js
- Check "Add to PATH" during installation
- Restart terminal

### Issue: Permission errors
**Solution:**
- Run terminal as Administrator
- Or use `nvm` to manage versions

## Verify Everything Works

After upgrading:
```bash
node --version  # Should be 18.x, 20.x, or 22.x
npm --version   # Should work
flowise --version  # After installing Flowise
```

---

**Recommendation: Upgrade to Node.js 20 LTS for best compatibility!**

