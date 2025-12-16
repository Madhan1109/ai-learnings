"""
Windows compatibility fix for CrewAI signal issues
Run this before importing crewai
"""

import signal
import sys

# Windows doesn't have SIGHUP, SIGCONT, etc.
# Add them as aliases to existing signals
if sys.platform == 'win32':
    if not hasattr(signal, 'SIGHUP'):
        signal.SIGHUP = signal.SIGTERM
    if not hasattr(signal, 'SIGCONT'):
        signal.SIGCONT = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR1'):
        signal.SIGUSR1 = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR2'):
        signal.SIGUSR2 = signal.SIGTERM

print("✅ Windows signal compatibility fix applied")

