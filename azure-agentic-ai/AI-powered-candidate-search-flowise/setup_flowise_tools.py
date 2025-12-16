"""
Setup script for Flowise custom tools
Registers custom tools with Flowise
"""

import json
import os
from pathlib import Path
from loguru import logger

def setup_flowise_tools():
    """Register custom tools with Flowise"""
    
    config_path = Path("flowise/config.json")
    
    if not config_path.exists():
        logger.error("flowise/config.json not found")
        return False
    
    with open(config_path, "r") as f:
        config = json.load(f)
    
    tools_config = config.get("tools", {})
    
    print("=" * 60)
    print("Flowise Custom Tools Setup")
    print("=" * 60)
    print("\nRegistered Tools:")
    print("-" * 60)
    
    for tool_name, tool_config in tools_config.items():
        tool_path = tool_config.get("path")
        tool_class = tool_config.get("class")
        
        # Check if tool file exists
        if Path(tool_path).exists():
            print(f"✓ {tool_name}")
            print(f"  Path: {tool_path}")
            print(f"  Class: {tool_class}")
        else:
            print(f"✗ {tool_name} - File not found: {tool_path}")
    
    print("\n" + "=" * 60)
    print("Next Steps:")
    print("1. Start Flowise: flowise start")
    print("2. Open Flowise UI: http://localhost:3000")
    print("3. Go to Settings → Custom Tools")
    print("4. Add the tools listed above")
    print("5. Import workflow from flowise/chatflows/")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    setup_flowise_tools()

