"""
Quick verification script for CrewAI setup
"""

# Windows compatibility fix - MUST be before any crewai imports
import sys
import signal
if sys.platform == 'win32':
    if not hasattr(signal, 'SIGHUP'):
        signal.SIGHUP = signal.SIGTERM
    if not hasattr(signal, 'SIGCONT'):
        signal.SIGCONT = signal.SIGTERM
    if not hasattr(signal, 'SIGTSTP'):
        signal.SIGTSTP = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR1'):
        signal.SIGUSR1 = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR2'):
        signal.SIGUSR2 = signal.SIGTERM

from pathlib import Path

print("\n" + "="*60)
print("  CREWAI SETUP VERIFICATION")
print("="*60 + "\n")

# Check API keys
try:
    from src.config import settings
    openai_ok = bool(settings.openai_api_key and len(settings.openai_api_key) > 20)
    github_ok = bool(settings.github_token and len(settings.github_token) > 20)
    
    print("API Keys:")
    print(f"  OpenAI: {'✅ VERIFIED' if openai_ok else '❌ NOT SET'}")
    print(f"  GitHub: {'✅ VERIFIED' if github_ok else '❌ NOT SET'}")
    print()
except Exception as e:
    print(f"❌ Error loading config: {e}")
    openai_ok = False
    github_ok = False

# Check dependencies
print("Dependencies:")
missing = []
try:
    import crewai
    print("  ✅ crewai")
except ImportError:
    print("  ❌ crewai")
    missing.append("crewai")

try:
    import langchain
    print("  ✅ langchain")
except ImportError:
    print("  ❌ langchain")
    missing.append("langchain")

try:
    import openai
    print("  ✅ openai")
except ImportError:
    print("  ❌ openai")
    missing.append("openai")

try:
    import docx
    print("  ✅ python-docx")
except ImportError:
    print("  ❌ python-docx")
    missing.append("python-docx")

# Check sample file
print()
print("Files:")
if Path("sample_job_description.docx").exists():
    print("  ✅ sample_job_description.docx")
else:
    print("  ❌ sample_job_description.docx")

# Summary
print()
print("="*60)
if openai_ok and github_ok and not missing:
    print("✅ SETUP COMPLETE - Ready for demo!")
    print()
    print("To run demo:")
    print("  python main.py sample_job_description.docx")
    print()
    print("Or start API server:")
    print("  python run_api.py")
else:
    if missing:
        print("⚠️  Missing dependencies. Install with:")
        print(f"  pip install {' '.join(missing)}")
    if not openai_ok or not github_ok:
        print("⚠️  Please configure API keys in .env file")
print("="*60)

