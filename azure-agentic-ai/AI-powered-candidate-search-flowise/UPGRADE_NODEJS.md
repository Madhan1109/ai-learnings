# Upgrade Node.js to 18+ - Step by Step

## Current Status
- **Current:** Node.js 16.13.2
- **Target:** Node.js 18+ (20 LTS recommended)

## Method 1: Direct Installation (Recommended - 5 minutes)

### Step 1: Download Node.js 20 LTS

1. **Go to:** https://nodejs.org/
2. **Click the "LTS" button** (Long Term Support - recommended)
3. **Download:** Windows Installer (.msi) for your system (64-bit)
4. **File name:** Something like `node-v20.x.x-x64.msi`

### Step 2: Install Node.js

1. **Run the downloaded installer**
2. **Follow the installation wizard:**
   - Click "Next" through the setup
   - **Important:** Check "Automatically install necessary tools" if prompted
   - Accept license agreement
   - Choose installation location (default is fine)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

### Step 3: Verify Installation

**Close ALL terminal windows first!** (This is important)

Then open a **new terminal** and run:

```bash
node --version
```

**Expected output:** `v20.x.x` or `v22.x.x` (should NOT be 16.x.x)

```bash
npm --version
```

**Expected output:** Version number (should be updated too)

### Step 4: Verify Flowise Still Works

```bash
npx flowise --version
```

Should still work and show Flowise version.

## Method 2: Using NVM (Node Version Manager) - Advanced

If you need to manage multiple Node.js versions:

### Step 1: Install nvm-windows

1. **Download:** https://github.com/coreybutler/nvm-windows/releases
2. **Download:** `nvm-setup.exe` (latest release)
3. **Run installer**
4. **Follow installation wizard**

### Step 2: Use NVM to Install Node.js 20

```bash
# Install Node.js 20 LTS
nvm install 20

# Use Node.js 20
nvm use 20

# Verify
node --version
```

### Step 3: Set as Default (Optional)

```bash
nvm alias default 20
```

## Troubleshooting

### Issue: Node.js version still shows 16 after installation

**Solutions:**

1. **Close ALL terminal windows**
   - Close PowerShell, CMD, Git Bash, VS Code terminals
   - Restart terminal

2. **Restart computer** (sometimes needed)
   - Windows may cache the old PATH
   - Restart ensures PATH is refreshed

3. **Check PATH environment variable:**
   - Open System Properties → Environment Variables
   - Check if Node.js path is in PATH
   - Should include: `C:\Program Files\nodejs\`

4. **Verify installation location:**
   ```bash
   where node
   ```
   Should show: `C:\Program Files\nodejs\node.exe`

### Issue: npm not found after upgrade

**Solution:**
- Reinstall Node.js
- Make sure "Add to PATH" is checked during installation
- Restart terminal

### Issue: Flowise not working after upgrade

**Solution:**
```bash
# Reinstall Flowise
npm install -g flowise

# Verify
flowise --version
```

## After Upgrading

### Step 1: Verify Node.js Version

```bash
node --version
# Should show: v20.x.x or v22.x.x
```

### Step 2: Verify npm Version

```bash
npm --version
# Should show updated version
```

### Step 3: Reinstall Flowise (if needed)

```bash
npm install -g flowise
flowise --version
```

### Step 4: Test Flowise

```bash
npx flowise start
```

Should work without issues now!

## Quick Upgrade Steps Summary

1. ✅ Download Node.js 20 LTS from https://nodejs.org/
2. ✅ Run installer
3. ✅ Close all terminals
4. ✅ Open new terminal
5. ✅ Verify: `node --version` (should show 20.x)
6. ✅ Test: `npx flowise --version`

## Expected Results

**Before:**
```bash
node --version
# v16.13.2
```

**After:**
```bash
node --version
# v20.x.x (or v22.x.x)
```

---

**After upgrading, continue with REAL_TIME_SETUP.md Step 4!**

