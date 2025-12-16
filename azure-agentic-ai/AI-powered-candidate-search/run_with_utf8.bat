@echo off
REM Batch script to run with UTF-8 encoding on Windows
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"
venv\Scripts\activate
python main.py "M:\Downloads\Technical Architect Job Description.docx"
pause

