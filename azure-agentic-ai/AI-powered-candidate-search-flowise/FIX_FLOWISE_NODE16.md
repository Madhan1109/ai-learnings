# Fix Flowise - Node.js 16 Issue

## Problem
- **Your Node.js:** v16.13.2
- **Flowise requires:** Node.js 18+.
- **Result:** Flowise won't start.

## Solution Options

### Option 1: Upgrade Node.js (Recommended - 10 minutes)

**Quick Steps:**
1. Download Node.js 20 LTS: https://nodejs.org/
2. Run installer (check "Add to PATH")
3. **Close ALL terminals**
4. Open new terminal
5. Verify: `node --version` (should show v20.x)
6. Start Flowise: `npx flowise start`

**See:** `UPGRADE_NODEJS.md` for detailed steps.

### Option 2: Use Docker (If you have Docker)

```bash
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

Then open: http://localhost:3000

### Option 3: Use Demo Script (No Flowise Needed)

Since you need to demo soon, use the backup demo:

```bash
python demo.py
```

This shows the complete workflow with sample data and doesn't require Flowise!

## Quick Fix for Demo

**If you need to demo NOW:**

1. **Use Python Demo:**
   ```bash
   python demo.py
   ```
   Shows complete workflow with sample data.

2. **Or upgrade Node.js** (10 minutes):
   - Download from https://nodejs.org/
   - Install
   - Restart terminal
   - Start Flowise

## After Upgrading Node.js

1. Verify version:
   ```bash
   node --version
   # Should show: v20.x.x or v22.x.x
   ```

2. Start Flowise:
   ```bash
   npx flowise start
   ```

3. Open: http://localhost:3000

---

**Recommendation:** Use `python demo.py` for immediate demo, then upgrade Node.js for full Flowise setup.

