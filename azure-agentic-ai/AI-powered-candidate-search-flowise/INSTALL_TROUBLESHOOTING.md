# Installation Troubleshooting Guide

## Common Installation Issues

### Issue 1: NumPy/Pandas Build Errors

**Error**: `ERROR: Failed to build 'numpy'` or `ERROR: Failed to build 'pandas'`

**Cause**: NumPy/Pandas trying to build from source but no C compiler available.

**Solutions**:

#### Solution A: Install Pre-built Wheels (Recommended)
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install numpy and pandas separately with pre-built wheels
pip install numpy --only-binary :all:
pip install pandas --only-binary :all:

# Then install rest of requirements
pip install -r requirements.txt
```

#### Solution B: Use Latest Versions
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install without version constraints for numpy/pandas
pip install numpy pandas
pip install -r requirements.txt --no-deps
pip install -r requirements.txt
```

#### Solution C: Install Visual Studio Build Tools (If you need to build from source)
1. Download Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
2. Install "Desktop development with C++" workload
3. Restart terminal and try again

### Issue 2: NeMo Guardrails Installation

**Error**: `ERROR: Could not find a version that satisfies the requirement nemoguardrails`

**Solutions**:

#### Solution A: Install Without Guardrails (Recommended for Quick Start)
```bash
# Install without nemoguardrails
pip install -r requirements.txt --ignore-installed nemoguardrails

# The system will use basic pattern matching instead
```

#### Solution B: Install NeMo Guardrails Separately
```bash
# Check Python version (requires 3.10-3.13)
python --version

# Install nemoguardrails
pip install nemoguardrails

# If it fails, try from GitHub
pip install git+https://github.com/NVIDIA/NeMo-Guardrails.git
```

### Issue 3: Python 3.13 Compatibility

**Note**: Python 3.13 is very new. Some packages may not have pre-built wheels yet.

**Solutions**:

#### Solution A: Use Python 3.11 or 3.12 (Recommended)
```bash
# Install Python 3.11 or 3.12 from python.org
# Create new virtual environment
python3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Solution B: Install Packages Individually
```bash
# Install core packages first
pip install python-dotenv pydantic pydantic-settings
pip install requests httpx
pip install fastapi uvicorn
pip install loguru

# Then install optional packages
pip install python-docx
pip install PyGithub
pip install litellm openai
```

### Issue 4: Flowise Not Found

**Error**: `'flowise' is not recognized as an internal or external command`

**Solution**:
```bash
# Install Flowise via npm
npm install -g flowise

# Verify installation
flowise --version

# If npm not found, install Node.js first
# Download from: https://nodejs.org/
```

### Issue 5: Missing Dependencies

**Error**: Various import errors

**Solution**: Install missing packages individually
```bash
# Core dependencies
pip install python-dotenv pydantic pydantic-settings
pip install requests httpx aiohttp
pip install fastapi uvicorn
pip install loguru

# Document processing
pip install python-docx

# GitHub
pip install PyGithub

# LLM
pip install litellm openai langchain langchain-openai

# Optional: Data processing (if needed)
pip install numpy pandas --only-binary :all:
```

## Step-by-Step Installation (Safe Method)

### Step 1: Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 2: Upgrade pip
```bash
python -m pip install --upgrade pip setuptools wheel
```

### Step 3: Install Core Packages First
```bash
pip install python-dotenv pydantic pydantic-settings
pip install requests httpx
pip install fastapi uvicorn
pip install loguru
```

### Step 4: Install Document Processing
```bash
pip install python-docx
```

### Step 5: Install API Integrations
```bash
pip install PyGithub
pip install beautifulsoup4
```

### Step 6: Install LLM Packages
```bash
pip install litellm openai langchain langchain-openai
```

### Step 7: Install Optional Packages (Skip if errors)
```bash
# Try these one by one, skip if they fail
pip install numpy --only-binary :all:
pip install pandas --only-binary :all:
pip install nemoguardrails  # Optional
pip install guardrails-ai  # Optional
```

### Step 8: Install Testing (Optional)
```bash
pip install pytest pytest-asyncio
```

## Minimal Installation (Without Optional Packages)

If you want to get started quickly without all features:

```bash
# Minimal requirements
pip install python-dotenv pydantic pydantic-settings
pip install requests httpx
pip install fastapi uvicorn
pip install loguru
pip install python-docx
pip install PyGithub
pip install litellm openai langchain langchain-openai
```

This will give you core functionality without:
- NumPy/Pandas (not essential for this project)
- NeMo Guardrails (will use basic pattern matching)
- Some optional integrations

## Verify Installation

```bash
# Test imports
python -c "from src.flowise_client import FlowiseClient; print('✓ Core imports work')"
python -c "from src.config import settings; print('✓ Config works')"
```

## Getting Help

If you continue to have issues:

1. Check Python version: `python --version` (should be 3.10-3.13)
2. Check pip version: `pip --version`
3. Try installing packages one by one to identify the problematic package
4. Consider using Python 3.11 or 3.12 instead of 3.13

---

**Remember**: You can run the system without NumPy/Pandas and NeMo Guardrails - they're optional enhancements!

