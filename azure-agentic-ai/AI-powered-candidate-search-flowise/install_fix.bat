@echo off
REM Installation script for Python 3.13 compatibility
REM This script installs packages with pre-built wheels only

echo ========================================
echo Installing AI-Powered Candidate Search
echo ========================================
echo.

echo Step 1: Upgrading pip...
python -m pip install --upgrade pip setuptools wheel
echo.

echo Step 2: Installing pydantic with pre-built wheels...
python -m pip install pydantic --only-binary :all: --upgrade
python -m pip install pydantic-settings --only-binary :all: --upgrade
echo.

echo Step 3: Installing core packages...
python -m pip install python-dotenv requests httpx fastapi uvicorn loguru
echo.

echo Step 4: Installing document processing...
python -m pip install python-docx
echo.

echo Step 5: Installing GitHub integration...
python -m pip install PyGithub
echo.

echo Step 6: Installing LLM packages...
python -m pip install litellm openai langchain langchain-openai
echo.

echo Step 7: Installing utilities...
python -m pip install tenacity tqdm pyyaml
echo.

echo Step 8: Installing optional packages (skip if errors)...
python -m pip install beautifulsoup4 aiohttp python-multipart || echo "Some optional packages failed, continuing..."
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Note: NumPy, Pandas, and NeMo Guardrails were skipped.
echo The system will work without them.
echo.
pause

