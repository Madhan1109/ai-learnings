# Day 2 - Letta Quick Reference

## 🧠 Memory Architecture

### Core Memory (In-Context)
```python
# Create memory block
agent.create_memory_block("human", content, schema=HumanSchema)

# Append to block
agent.core_memory_append("human", "New information")

# Replace block content
agent.core_memory_replace("human", old_content, new_content)

# Get block content
content = agent.get_memory("human")
```

### External Memory (Long-Term)
```python
# Store in external memory
agent.store_memory(content, metadata={"type": "analysis"})

# Search conversation history
results = agent.conversation_search("query", limit=5)
```

---

## 📋 Schemas

### Define Schema
```python
from typing import TypedDict

class HumanMemorySchema(TypedDict):
    name: str
    role: str
    preferences: str
    last_interaction: str
    interaction_count: int
```

### Use Schema
```python
agent.create_memory_block(
    "human",
    content={"name": "Dr. Smith", ...},
    schema=HumanMemorySchema
)
```

---

## 👤 Human-in-the-Loop

### Register Tool with Approval
```python
agent.register_tool(
    "send_email",
    send_email_function,
    requires_approval=True
)
```

### Execute Tool (Triggers HITL)
```python
# If tool requires approval, execution pauses
result = agent.execute_tool(
    "send_email",
    {"to": "...", "subject": "...", "body": "..."},
    auto_approve=False  # Triggers approval request
)
```

### Approval Request Structure
```python
{
    "request_id": "req_123",
    "tool_name": "send_email",
    "arguments": {...},
    "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🛠️ Tool Execution

### Register Tool
```python
def my_tool(param1: str, param2: int) -> dict:
    """Tool description"""
    return {"result": "..."}

agent.register_tool("my_tool", my_tool, requires_approval=False)
```

### Execute Tool
```python
result = agent.execute_tool(
    "my_tool",
    {"param1": "value", "param2": 10}
)
```

### Tool Signature
```python
@tool
def search_knowledge_base(
    query: str,        # Required parameter
    limit: int = 10    # Optional with default
) -> List[dict]:       # Return type
    """Search the knowledge base"""
    pass
```

---

## 🧩 Reasoning Steps

### Record Reasoning Step
```python
step = agent.reason_step(
    action="search",
    tool="search_knowledge_base",
    arguments={"query": "treatment"}
)
```

### Multi-Step Reasoning
```python
# Step 1
step1 = agent.reason_step("search", "search_kb", {"query": "..."})

# Step 2
step2 = agent.reason_step("analyze", "analyze_data", {"data": step1.result})

# Step 3
step3 = agent.reason_step("format", "format_output", {"analysis": step2.result})
```

---

## 🔄 Memory Update Cycle

```
1. Agent receives input
   ↓
2. Check core memory
   ↓
3. Search external memory if needed
   ↓
4. Update core memory
   ↓
5. Process with updated context
   ↓
6. Store important info long-term
   ↓
7. Repeat
```

---

## ✅ Validation Layers

### Layer 1: Schema Validation
```python
# Validates against schema structure
schema.validate(data)
```

### Layer 2: Type Validation
```python
# Validates parameter types
validate_type("param", str, value)
```

### Layer 3: Range Validation
```python
# Validates ranges/constraints
validate_range("limit", 1, 100, value)
```

### Layer 4: Business Logic
```python
# Custom validation rules
if not value.endswith("@hospital.com"):
    raise ValidationError("Invalid email domain")
```

---

## 📊 Common Memory Blocks

| Block Name | Purpose | Schema |
|------------|---------|--------|
| `"human"` | User information | `HumanMemorySchema` |
| `"persona"` | Agent personality | `PersonaMemorySchema` |
| `"report_cache"` | Report history | `ReportCacheSchema` |
| `"context"` | Current context | `ContextSchema` |

---

## 🎯 Common Patterns

### Pattern 1: Memory Replay
```python
# Search past conversations
past = agent.conversation_search("knee injury", limit=3)

# Load into context
for item in past:
    agent.core_memory_append("context", item["content"])
```

### Pattern 2: HITL Workflow
```python
# Tool requires approval
result = agent.execute_tool("critical_action", args, auto_approve=False)

# Human reviews and approves/denies
# Agent continues or adjusts
```

### Pattern 3: Multi-Step Analysis
```python
# Step 1: Gather information
info = agent.execute_tool("gather_info", {...})

# Step 2: Process
processed = agent.execute_tool("process", {"data": info})

# Step 3: Generate output
output = agent.execute_tool("generate", {"processed": processed})
```

### Pattern 4: Memory Update
```python
# Get current memory
current = agent.get_memory("block_name")

# Update
updated = {**current, "new_field": "new_value"}

# Replace
agent.core_memory_replace("block_name", current, updated)
```

---

## 🔍 Memory Search

### Search Conversation History
```python
results = agent.conversation_search(
    query="treatment options",
    limit=5
)
```

### Search External Memory
```python
# In real Letta, you might use vector search
similar = agent.search_memory(
    query="knee injury",
    top_k=3
)
```

---

## 🚨 Error Handling

### Validation Error
```python
try:
    agent.core_memory_replace("block", old, new)
except ValueError as e:
    print(f"Validation failed: {e}")
```

### Tool Execution Error
```python
try:
    result = agent.execute_tool("tool_name", args)
except PermissionError:
    print("Tool execution denied")
except ValueError as e:
    print(f"Invalid arguments: {e}")
```

---

## 📈 Best Practices

1. **Use Schemas**: Always define schemas for memory blocks
2. **Validate Early**: Validate inputs before storing
3. **HITL for Critical**: Require approval for important operations
4. **Memory Replay**: Search past conversations when relevant
5. **Long-term Storage**: Store important information externally
6. **Track Steps**: Record reasoning steps for debugging
7. **Error Handling**: Handle validation and execution errors

---

## 🔗 Key Concepts Summary

| Concept | Description |
|---------|-------------|
| **Memory Block** | Named, editable section of core memory |
| **Schema** | Structure and validation rules for memory |
| **Core Memory** | Fast, in-context memory (limited size) |
| **External Memory** | Long-term, persistent storage |
| **HITL** | Human approval for critical operations |
| **Tool Signature** | Definition of tool parameters and types |
| **Reasoning Step** | Individual logical operation |
| **Memory Replay** | Retrieving relevant past memories |

---

*Quick reference for Day 2 - Letta Architecture*

