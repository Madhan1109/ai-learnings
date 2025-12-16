# Day 2 - Letta Setup Guide

## 🚀 Quick Start

### Option 1: Use Simplified Example (No Installation)
The `DAY2_LETTA_HANDSON.py` file includes a simplified implementation that demonstrates all concepts without requiring the actual Letta package.

```bash
python docs/DAY2_LETTA_HANDSON.py
```

This runs immediately and shows:
- Memory blocks and schemas
- Long-term storage
- Human-in-the-loop
- Tool execution
- Reasoning steps

---

### Option 2: Install Letta (For Real Usage)

#### Step 1: Install Letta
```bash
pip install letta
```

Or from source:
```bash
git clone https://github.com/letta-ai/letta
cd letta
pip install -e .
```

#### Step 2: Verify Installation
```python
import letta
print(letta.__version__)
```

#### Step 3: Check Documentation
- GitHub: https://github.com/letta-ai/letta
- Documentation: Check repository README

---

## 📋 Prerequisites

### Python Version
- Python 3.8 or higher

### Optional Dependencies
```bash
# For type checking
pip install mypy

# For better development experience
pip install ipython
```

---

## 🔧 Configuration

### Environment Variables (If Needed)
```bash
# Set API keys if Letta requires them
export OPENAI_API_KEY="your-key"
export LETTA_API_KEY="your-key"  # If applicable
```

### Configuration File
Create a `letta_config.json` (if needed):
```json
{
    "memory": {
        "max_core_memory_size": 10000,
        "external_storage": "sqlite",
        "vector_db": "chroma"
    },
    "tools": {
        "require_approval_by_default": false,
        "max_execution_time": 30
    }
}
```

---

## 🧪 Testing the Setup

### Test 1: Basic Agent Creation
```python
from letta import Agent

agent = Agent(name="TestAgent")
print("✅ Agent created successfully")
```

### Test 2: Memory Block
```python
agent.create_memory_block("test", {"key": "value"})
memory = agent.get_memory("test")
print(f"✅ Memory block works: {memory}")
```

### Test 3: Tool Registration
```python
def test_tool(param: str) -> str:
    return f"Result: {param}"

agent.register_tool("test_tool", test_tool)
result = agent.execute_tool("test_tool", {"param": "test"})
print(f"✅ Tool execution works: {result}")
```

---

## 📁 Project Structure

```
medical-report-analyzer/
├── docs/
│   ├── DAY2_LETTA_ARCHITECTURE.md      # Comprehensive guide
│   ├── DAY2_LETTA_HANDSON.py           # Hands-on example
│   ├── DAY2_LETTA_QUICK_REFERENCE.md   # Quick reference
│   ├── DAY2_LETTA_EXERCISES.md         # Practice exercises
│   └── DAY2_LETTA_SETUP.md            # This file
├── backend/
│   └── src/main/java/...               # Your existing backend
└── requirements_letta.txt              # Letta dependencies
```

---

## 🎯 Using with Your Medical Report Analyzer

### Integration Approach

#### Option 1: Python Service Layer
Create a Python service that uses Letta and call it from your Java backend:

```python
# letta_service.py
from letta import Agent

class MedicalReportLettaService:
    def __init__(self):
        self.agent = self._create_agent()
    
    def _create_agent(self):
        agent = Agent(name="Medical Analyzer")
        # Set up memory blocks, tools, etc.
        return agent
    
    def analyze_report(self, report_text: str):
        # Use Letta agent to analyze
        return self.agent.analyze(report_text)
```

#### Option 2: REST API Wrapper
Expose Letta functionality via REST API:

```python
# letta_api.py
from flask import Flask, request, jsonify
from letta_service import MedicalReportLettaService

app = Flask(__name__)
service = MedicalReportLettaService()

@app.route('/analyze', methods=['POST'])
def analyze():
    report_text = request.json['report_text']
    result = service.analyze_report(report_text)
    return jsonify(result)
```

#### Option 3: Direct Integration
If you're adding Python to your stack, use Letta directly in your analysis pipeline.

---

## 🐛 Troubleshooting

### Issue: "Module not found: letta"
**Solution**: 
```bash
pip install letta
```

If Letta isn't available on PyPI, check the GitHub repository for installation instructions.

### Issue: "Schema validation failing"
**Solution**: 
- Check that all required schema fields are provided
- Verify field types match schema definitions
- Review schema definition for typos

### Issue: "Tool execution not working"
**Solution**:
- Verify tool is registered: `agent.tools`
- Check tool signature matches arguments
- Ensure required parameters are provided

### Issue: "Memory block not found"
**Solution**:
- Create memory block before using: `agent.create_memory_block(...)`
- Check block name spelling
- Verify block exists: `"block_name" in agent.core_memory`

---

## 📊 Expected Behavior

### Memory Operations
```
✅ Created memory block: 'human'
✅ Appended to memory block 'human'
✅ Replaced content in memory block 'human'
```

### Tool Execution
```
🛠️  Registered tool: 'search_knowledge_base' (approval: False)
⚙️  Executing tool: 'search_knowledge_base'
```

### HITL
```
⏸️  PAUSED: Tool 'send_email' requires human approval
   Request ID: req_1
   Arguments: {...}
   [SIMULATED] Human approves request req_1
```

---

## 🔍 Verification Checklist

- [ ] Letta installed (or using simplified version)
- [ ] Can create agents
- [ ] Can create memory blocks
- [ ] Can register and execute tools
- [ ] HITL workflow works
- [ ] External memory storage works
- [ ] Schema validation works

---

## 📚 Next Steps

1. **Run the example**: `python docs/DAY2_LETTA_HANDSON.py`
2. **Complete exercises**: Work through `DAY2_LETTA_EXERCISES.md`
3. **Read architecture guide**: Review `DAY2_LETTA_ARCHITECTURE.md`
4. **Integrate with project**: Apply to your medical report analyzer
5. **Experiment**: Try different memory structures and workflows

---

## 💡 Tips

1. **Start Simple**: Begin with basic memory blocks before complex schemas
2. **Test Incrementally**: Test each feature as you add it
3. **Use Mock Mode**: Use simplified version to understand concepts first
4. **Read Examples**: Study the hands-on example code
5. **Experiment**: Try different memory structures and workflows

---

## 🆘 Getting Help

- Check the example code: `DAY2_LETTA_HANDSON.py`
- Review the architecture guide: `DAY2_LETTA_ARCHITECTURE.md`
- Consult quick reference: `DAY2_LETTA_QUICK_REFERENCE.md`
- Check Letta GitHub repository for latest documentation

---

*Setup guide for Day 2 - Get started with Letta!*

