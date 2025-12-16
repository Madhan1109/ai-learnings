"""
Helper script to add API keys to .env file
"""

import os
from pathlib import Path

def add_api_keys():
    """Interactive script to add API keys to .env file"""
    
    env_file = Path(".env")
    
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Creating from template...")
        env_example = Path("env.example")
        if env_example.exists():
            with open(env_example, "r") as f:
                content = f.read()
            with open(env_file, "w") as f:
                f.write(content)
            print("✅ .env file created from template")
        else:
            print("❌ env.example not found!")
            return
    
    # Read current .env
    with open(env_file, "r") as f:
        lines = f.readlines()
    
    print("\n" + "="*60)
    print("  API KEYS CONFIGURATION")
    print("="*60 + "\n")
    
    # Get OpenAI API Key
    print("1. OpenAI API Key (Required)")
    print("   Get from: https://platform.openai.com/api-keys")
    openai_key = input("   Enter OpenAI API Key (starts with sk-): ").strip()
    
    if not openai_key:
        print("   ⚠️ Skipping OpenAI key")
    elif not openai_key.startswith("sk-"):
        print("   ⚠️ Warning: OpenAI key should start with 'sk-'")
    
    # Get GitHub Token
    print("\n2. GitHub Personal Access Token (Required)")
    print("   Get from: https://github.com/settings/tokens")
    github_token = input("   Enter GitHub Token (starts with ghp_): ").strip()
    
    if not github_token:
        print("   ⚠️ Skipping GitHub token")
    elif not github_token.startswith("ghp_"):
        print("   ⚠️ Warning: GitHub token should start with 'ghp_'")
    
    # Update .env file
    updated_lines = []
    for line in lines:
        if line.startswith("OPENAI_API_KEY="):
            if openai_key:
                updated_lines.append(f"OPENAI_API_KEY={openai_key}\n")
            else:
                updated_lines.append(line)
        elif line.startswith("GITHUB_TOKEN="):
            if github_token:
                updated_lines.append(f"GITHUB_TOKEN={github_token}\n")
            else:
                updated_lines.append(line)
        elif line.startswith("SECRET_KEY=") and "your_secret_key" in line:
            # Keep the generated secret key
            updated_lines.append(line)
        else:
            updated_lines.append(line)
    
    # Write updated .env
    with open(env_file, "w") as f:
        f.writelines(updated_lines)
    
    print("\n" + "="*60)
    print("  ✅ API KEYS ADDED TO .env FILE")
    print("="*60 + "\n")
    
    # Verify
    if openai_key:
        print(f"✅ OpenAI API Key: {openai_key[:10]}...{openai_key[-4:]}")
    if github_token:
        print(f"✅ GitHub Token: {github_token[:10]}...{github_token[-4:]}")
    
    print("\n✅ Configuration complete!")
    print("\nNext steps:")
    print("1. Start Flowise: npx flowise start")
    print("2. Open http://localhost:3000")
    print("3. Register custom tools (see FLOWISE_TOOLS_SETUP.md)")
    print("4. Build workflow (see FLOWISE_WORKFLOW.md)")

if __name__ == "__main__":
    try:
        add_api_keys()
    except KeyboardInterrupt:
        print("\n\n❌ Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

