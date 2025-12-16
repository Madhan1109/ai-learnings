"""
Quick verification script for demo setup
"""

from src.config import settings

print("\n" + "="*60)
print("  SETUP VERIFICATION")
print("="*60 + "\n")

# Check API keys
openai_ok = bool(settings.openai_api_key and len(settings.openai_api_key) > 20)
github_ok = bool(settings.github_token and len(settings.github_token) > 20)

print("API Keys:")
print(f"  OpenAI: {'✅ VERIFIED' if openai_ok else '❌ NOT SET'}")
print(f"  GitHub: {'✅ VERIFIED' if github_ok else '❌ NOT SET'}")
print()

# Check Flowise
try:
    import requests
    try:
        response = requests.get("http://localhost:3000", timeout=3)
        flowise_ok = response.status_code == 200
    except:
        flowise_ok = False
except:
    flowise_ok = None

print("Flowise:")
if flowise_ok is None:
    print("  ⚠️  Cannot check (requests not available)")
elif flowise_ok:
    print("  ✅ RUNNING at http://localhost:3000")
else:
    print("  ⏳ NOT RUNNING - Start with: npx flowise start")

print()

# Summary
if openai_ok and github_ok:
    print("✅ API keys configured correctly!")
    print("\nNext steps:")
    print("1. Open http://localhost:3000")
    print("2. Register custom tools (see DEMO_SETUP_COMPLETE.md)")
    print("3. Build workflow")
    print("4. Test and demo!")
else:
    print("⚠️  Please configure API keys in .env file")

print("\n" + "="*60)

