# Day 2 - Letta Practical Exercises

## 🎯 Exercise Goals
- Hands-on experience with Letta memory system
- Understanding schemas and validation
- Implementing HITL workflows
- Building tool execution with validation
- Applying to your medical report analyzer

---

## 📋 Exercise 1: Create Memory Blocks

### Objective
Create and manage memory blocks with schemas.

### Steps
1. Create an agent
2. Define a schema for user information
3. Create a memory block with the schema
4. Append and replace content
5. Validate that schema is enforced

### Expected Output
```
✅ Created memory block: 'user'
✅ Appended to memory block 'user'
✅ Replaced content in memory block 'user'
```

### Solution Template
```python
from typing import TypedDict

class UserSchema(TypedDict):
    name: str
    role: str
    preferences: str

# Create agent and memory block
agent = LettaAgent("MyAgent")
agent.create_memory_block(
    "user",
    {"name": "Dr. Smith", "role": "Doctor", "preferences": "Detailed"},
    schema=UserSchema
)

# Append
agent.core_memory_append("user", "\nLast visit: 2024-01-15")

# Replace
old = agent.get_memory("user")
new = {**old, "preferences": "Concise"}
agent.core_memory_replace("user", old, new)
```

---

## 📋 Exercise 2: Schema Validation

### Objective
Understand how schemas validate memory content.

### Steps
1. Create a schema with required fields
2. Try to create memory block with missing fields (should fail)
3. Try with all required fields (should succeed)
4. Try to update with invalid field (should fail)

### Expected Behavior
- Missing fields → Validation error
- Invalid types → Validation error
- Valid data → Success

### Solution Template
```python
class ReportSchema(TypedDict):
    report_id: str
    analysis: str
    confidence: float

# This should fail (missing fields)
try:
    agent.create_memory_block(
        "report",
        {"report_id": "123"},  # Missing analysis and confidence
        schema=ReportSchema
    )
except ValueError as e:
    print(f"Validation failed: {e}")

# This should succeed
agent.create_memory_block(
    "report",
    {"report_id": "123", "analysis": "...", "confidence": 0.85},
    schema=ReportSchema
)
```

---

## 📋 Exercise 3: External Memory Storage

### Objective
Store and retrieve information from external memory.

### Steps
1. Store multiple entries in external memory
2. Search conversation history
3. Retrieve relevant past information
4. Use in current context

### Expected Output
```
💾 Stored in external memory: 3 entries
🔍 Found 2 results for query: 'knee injury'
```

### Solution Template
```python
# Store entries
agent.store_memory("Knee injury analysis", {"type": "analysis"})
agent.store_memory("Treatment recommendations", {"type": "recommendation"})
agent.store_memory("Patient follow-up", {"type": "followup"})

# Search
results = agent.conversation_search("knee injury", limit=5)
print(f"Found {len(results)} results")

# Use in context
for result in results:
    agent.core_memory_append("context", result["content"])
```

---

## 📋 Exercise 4: Human-in-the-Loop

### Objective
Implement HITL for critical operations.

### Steps
1. Create a tool that requires approval (e.g., send_email)
2. Register it with `requires_approval=True`
3. Try to execute it
4. Simulate approval/denial
5. Observe behavior

### Expected Behavior
- Tool execution pauses
- Approval request generated
- Execution continues if approved
- Execution stops if denied

### Solution Template
```python
def send_email(to: str, subject: str, body: str):
    return {"status": "sent", "to": to}

# Register with approval required
agent.register_tool("send_email", send_email, requires_approval=True)

# Execute (will pause for approval)
try:
    result = agent.execute_tool(
        "send_email",
        {"to": "patient@example.com", "subject": "Report", "body": "..."},
        auto_approve=False
    )
except PermissionError:
    print("Execution denied by human")
```

---

## 📋 Exercise 5: Tool Execution with Validation

### Objective
Create tools with proper signatures and validation.

### Steps
1. Define a tool with type hints
2. Register the tool
3. Execute with valid arguments (should work)
4. Execute with invalid arguments (should fail)
5. Execute with missing arguments (should fail)

### Expected Behavior
- Valid args → Success
- Invalid types → Validation error
- Missing args → Validation error

### Solution Template
```python
def analyze_report(report_text: str, confidence_threshold: float = 0.8) -> dict:
    """Analyze medical report"""
    return {"analysis": "...", "confidence": 0.85}

agent.register_tool("analyze_report", analyze_report)

# Valid execution
result = agent.execute_tool(
    "analyze_report",
    {"report_text": "Patient has knee pain", "confidence_threshold": 0.75}
)

# Invalid (wrong type)
try:
    agent.execute_tool(
        "analyze_report",
        {"report_text": "Patient has knee pain", "confidence_threshold": "0.75"}
    )
except ValueError as e:
    print(f"Validation error: {e}")
```

---

## 📋 Exercise 6: Multi-Step Reasoning

### Objective
Build a multi-step reasoning workflow.

### Steps
1. Create a workflow with 3 steps:
   - Step 1: Search knowledge base
   - Step 2: Analyze findings
   - Step 3: Generate recommendations
2. Execute steps sequentially
3. Use results from previous steps
4. Track all reasoning steps

### Expected Flow
```
Step 1: Search → Found 5 documents
Step 2: Analyze → Analysis complete
Step 3: Generate → Recommendations ready
```

### Solution Template
```python
# Step 1: Search
step1 = agent.reason_step(
    "search",
    "search_knowledge_base",
    {"query": "knee injury", "limit": 5}
)

# Step 2: Analyze
step2 = agent.reason_step(
    "analyze",
    "analyze_findings",
    {"findings": step1["result"]}
)

# Step 3: Generate
step3 = agent.reason_step(
    "generate",
    "generate_recommendations",
    {"analysis": step2["result"]}
)

# Display reasoning chain
for step in agent.reasoning_steps:
    print(f"{step['step_id']}: {step['tool']} → {step['result']}")
```

---

## 📋 Exercise 7: Memory Replay

### Objective
Implement memory replay for context.

### Steps
1. Store several past analyses in external memory
2. Receive new query
3. Search past conversations for relevant context
4. Load relevant context into core memory
5. Use context in current analysis

### Expected Behavior
- Past conversations found
- Relevant context loaded
- Current analysis uses past context

### Solution Template
```python
# Store past analyses
agent.store_memory("Knee injury: RICE method recommended", {"type": "analysis"})
agent.store_memory("Knee injury: Physical therapy needed", {"type": "analysis"})

# New query
query = "knee injury treatment"

# Search past
past_context = agent.conversation_search(query, limit=3)

# Load into core memory
agent.core_memory_append("context", f"Found {len(past_context)} past analyses:")
for item in past_context:
    agent.core_memory_append("context", f"- {item['content']}")

# Use context
context = agent.get_memory("context")
# Use context in current analysis
```

---

## 📋 Exercise 8: Complete Medical Report Analyzer

### Objective
Build a complete medical report analyzer using Letta concepts.

### Steps
1. Create agent with memory blocks:
   - `persona`: Agent personality
   - `user`: User information
   - `report_cache`: Report history
2. Register tools:
   - `search_knowledge_base` (no approval)
   - `generate_analysis` (requires approval)
   - `store_report` (no approval)
3. Implement workflow:
   - Search knowledge base
   - Generate analysis (HITL)
   - Store in memory
   - Search past analyses
4. Test with sample report

### Expected Output
Complete workflow with all Letta features demonstrated.

### Solution Template
```python
def create_complete_analyzer():
    agent = LettaAgent("Medical Analyzer")
    
    # Memory blocks
    agent.create_memory_block("persona", {...}, schema=PersonaSchema)
    agent.create_memory_block("user", {...}, schema=UserSchema)
    agent.create_memory_block("report_cache", {...}, schema=ReportCacheSchema)
    
    # Tools
    agent.register_tool("search_kb", search_kb, requires_approval=False)
    agent.register_tool("generate_analysis", generate_analysis, requires_approval=True)
    agent.register_tool("store_report", store_report, requires_approval=False)
    
    return agent

def analyze_report(agent, report_text):
    # Step 1: Search
    knowledge = agent.execute_tool("search_kb", {"query": "..."})
    
    # Step 2: Generate (HITL)
    analysis = agent.execute_tool("generate_analysis", {...}, auto_approve=False)
    
    # Step 3: Store
    agent.execute_tool("store_report", {"analysis": analysis})
    
    # Step 4: Replay
    past = agent.conversation_search("knee", limit=3)
    
    return analysis
```

---

## 🎓 Challenge Exercises

### Challenge 1: Dynamic Memory Blocks
Create memory blocks dynamically based on user input, with appropriate schemas.

### Challenge 2: Approval Workflow
Build a multi-level approval system where different tools require different approval levels.

### Challenge 3: Memory Optimization
Implement memory cleanup that removes old, irrelevant information while preserving important data.

### Challenge 4: Tool Chaining
Create a system where tools can be chained together, with each tool's output feeding into the next.

### Challenge 5: Schema Evolution
Handle schema changes over time, migrating old memory blocks to new schemas.

---

## ✅ Completion Checklist

- [ ] Exercise 1: Create Memory Blocks
- [ ] Exercise 2: Schema Validation
- [ ] Exercise 3: External Memory Storage
- [ ] Exercise 4: Human-in-the-Loop
- [ ] Exercise 5: Tool Execution with Validation
- [ ] Exercise 6: Multi-Step Reasoning
- [ ] Exercise 7: Memory Replay
- [ ] Exercise 8: Complete Medical Report Analyzer
- [ ] At least one Challenge Exercise

---

## 📚 Resources

- Letta Documentation: Check GitHub repository
- Example Code: `DAY2_LETTA_HANDSON.py`
- Quick Reference: `DAY2_LETTA_QUICK_REFERENCE.md`
- Architecture Guide: `DAY2_LETTA_ARCHITECTURE.md`

---

*Practice exercises for Day 2 - Build your Letta skills through hands-on coding!*

