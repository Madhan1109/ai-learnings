# Installation Guide for Python 3.13

Python 3.13 is very new, and some packages don't have pre-built wheels yet. This guide helps you install everything needed.

## Quick Fix: Use the Installation Script

```bash
# Run the installation script
install_fix.bat
```

Or manually follow the steps below.

## Manual Installation Steps

### Step 1: Upgrade pip and tools
```bash
python -m pip install --upgrade pip setuptools wheel
```

### Step 2: Install Pydantic with Pre-built Wheels
```bash
# Try to install latest pydantic (has wheels for 3.13)
python -m pip install "pydantic>=2.9.0" --only-binary :all:
python -m pip install "pydantic-settings>=2.6.0" --only-binary :all:
```

If that fails, try:
```bash
# Install from pre-built wheels only
python -m pip install pydantic --only-binary :all: --upgrade
python -m pip install pydantic-settings --only-binary :all: --upgrade
```

### Step 3: Install Core Packages
```bash
python -m pip install python-dotenv requests httpx fastapi uvicorn loguru
```

### Step 4: Install Document Processing
```bash
python -m pip install python-dotenv python-docx
```

### Step 5: Install GitHub Integration
```bash
python -m pip install PyGithub
```

### Step 6: Install LLM Packages
```bash
python -m pip install litellm openai langchain langchain-openai
```

### Step 7: Install Utilities
```bash
python -m pip install tenacity tqdm pyyaml
```

### Step 8: Install Optional Packages
```bash
python -m pip install beautifulsoup4 aiohttp python-multipart
```

## Skip These Packages (Not Essential)

You can skip these if they cause issues:
- `numpy` - Not needed for this project
- `pandas` - Not needed for this project  
- `nemoguardrails` - Will use basic pattern matching instead
- `guardrails-ai` - Optional enhancement

## Alternative: Use Minimal Requirements

```bash
pip install -r requirements-minimal.txt
```

## Verify Installation

```bash
# Test imports
python -c "from src.config import settings; print('✓ Config works')"
python -c "from src.flowise_client import FlowiseClient; print('✓ Flowise client works')"
```

## If Pydantic Still Fails

### Option 1: Install Rust (if you want to build from source)
1. Download Rust: https://rustup.rs/
2. Install Rust toolchain
3. Then try installing pydantic again

### Option 2: Use Python 3.11 or 3.12 (Recommended)
```bash
# Download Python 3.11 or 3.12 from python.org
# Create new virtual environment
python3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Option 3: Install Pydantic from Conda (if you have Conda)
```bash
conda install -c conda-forge pydantic pydantic-settings
```

## What Works Without These Packages?

The system will work fully without:
- ✅ NumPy/Pandas (not used in core functionality)
- ✅ NeMo Guardrails (uses basic pattern matching fallback)
- ✅ Some optional integrations

The core candidate search functionality will work perfectly!

---

**Recommended**: Use Python 3.11 or 3.12 for best compatibility, or follow the manual installation steps above.

