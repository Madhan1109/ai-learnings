# Flowise Installation Guide

## Issue: `flowise: command not found`

This means Flowise is not installed. Follow these steps:

## Step 1: Install Node.js (if not installed)

Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed:
1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (recommended)
3. Restart your terminal

## Step 2: Install Flowise

### Option A: Global Installation (Recommended)
```bash
npm install -g flowise
```

### Option B: Using npx (No installation needed)
```bash
npx flowise start
```

### Option C: Local Installation
```bash
npm install flowise
npx flowise start
```

## Step 3: Verify Installation

```bash
flowise --version
```

Or:
```bash
npx flowise --version
```

## Step 4: Start Flowise

```bash
# If installed globally
flowise start

# Or with npx
npx flowise start

# Or with custom port
flowise start --PORT=3000
```

Flowise will be available at: `http://localhost:3000`

## Troubleshooting

### Issue: npm command not found
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Issue: Permission errors (Linux/Mac)
```bash
sudo npm install -g flowise
```

### Issue: Port already in use
```bash
flowise start --PORT=3001
```

## Next Steps

After Flowise is running:
1. Open browser: `http://localhost:3000`
2. Follow `FLOWISE_SETUP.md` for next steps

