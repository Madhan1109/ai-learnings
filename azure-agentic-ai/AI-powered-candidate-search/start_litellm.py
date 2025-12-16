"""
Start LitELLM proxy server
"""

import subprocess
import sys
from pathlib import Path

def start_litellm():
    """Start LitELLM proxy server"""
    config_path = Path("litellm_config.yaml")
    
    if not config_path.exists():
        print(f"Warning: LitELLM config file not found at {config_path}")
        print("Starting LitELLM with default configuration...")
        config_path = None
    
    cmd = ["litellm", "--config", str(config_path)] if config_path else ["litellm"]
    
    print("Starting LitELLM proxy server on http://localhost:4000")
    print("Press Ctrl+C to stop")
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\nLitELLM server stopped")
    except FileNotFoundError:
        print("Error: litellm command not found. Please install litellm:")
        print("  pip install litellm")
        sys.exit(1)
    except Exception as e:
        print(f"Error starting LitELLM: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_litellm()

