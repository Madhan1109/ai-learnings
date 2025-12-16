# How to Start Flowise

## Issue: `flowise` command not found

Even though Flowise is installed, the command might not be in PATH. Here are solutions:

## Solution 1: Use npx (Recommended)

```bash
# Start Flowise with npx
npx flowise start

# Or with custom port
npx flowise start --PORT=3000
```

## Solution 2: Add to PATH

1. Find Flowise installation:
   ```bash
   npm list -g flowise
   ```
   Usually at: `C:\Users\YourName\AppData\Roaming\npm\`

2. Add to PATH:
   - Open System Properties → Environment Variables
   - Add npm global path to PATH
   - Restart terminal

## Solution 3: Use Full Path

```bash
# Find where flowise is installed
npm list -g flowise

# Use full path (example)
C:\Users\YourName\AppData\Roaming\npm\flowise.cmd start
```

## Solution 4: Reinstall Flowise

```bash
# Uninstall
npm uninstall -g flowise

# Reinstall
npm install -g flowise

# Restart terminal
flowise start
```

## Solution 5: Use Docker (No Node.js Issues)

```bash
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

## Quick Start Command

**Try this first:**
```bash
npx flowise start
```

Then open: http://localhost:3000

---

**After Flowise starts, continue with REAL_TIME_SETUP.md Step 6**

