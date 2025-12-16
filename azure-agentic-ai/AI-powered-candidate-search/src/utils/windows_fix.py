"""
Windows compatibility fix for CrewAI signal issues
Import this module FIRST before any crewai imports
"""

import sys
import signal

if sys.platform == 'win32':
    # Windows doesn't have these signals, add them as aliases
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

