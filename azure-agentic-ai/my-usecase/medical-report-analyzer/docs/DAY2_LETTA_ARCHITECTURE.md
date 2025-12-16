# Day 2 — Letta Architecture: Memory, Schemas, Long-Term Storage, Human-in-the-Loop

## 🎯 Objective
Understand Letta's memory-centric agent architecture (memory blocks, schemas, long-term storage, and how humans can steer agents).

---

## 📚 Table of Contents
1. [Letta Overview](#letta-overview)
2. [Memory-Centric Architecture](#memory-centric-architecture)
3. [Memory Blocks](#memory-blocks)
4. [Schemas](#schemas)
5. [Long-Term Storage](#long-term-storage)
6. [Memory Replay and Update Cycles](#memory-replay-and-update-cycles)
7. [Human-in-the-Loop Model](#human-in-the-loop-model)
8. [Tool Execution](#tool-execution)
9. [Tool Signatures and Validation](#tool-signatures-and-validation)
10. [Reasoning Steps](#reasoning-steps)
11. [Control and Input Validation](#control-and-input-validation)
12. [Practical Examples](#practical-examples)

---

## 🏗️ Letta Overview

### What is Letta?
**Letta** is a memory-centric agent framework designed for building sophisticated AI agents that can:
- Maintain persistent memory across conversations
- Organize information in structured memory blocks
- Interact with humans through approval workflows
- Execute tools programmatically with validation
- Reason through multi-step processes

### Key Differentiators
- **Memory-First**: Memory is a first-class citizen, not an afterthought
- **Structured Storage**: Uses schemas to organize and validate memory
- **Human Control**: Built-in human-in-the-loop mechanisms
- **Production-Ready**: Designed for reliable, observable agent systems

---

## 🧠 Memory-Centric Architecture

### Core Concept
Letta's architecture revolves around **memory blocks** - structured, editable sections of information that agents can read, write, and update.

### Two Types of Memory

#### 1. **Core Memory (In-Context Memory)**
- **Location**: Within the agent's context window
- **Purpose**: Active, immediately accessible information
- **Characteristics**:
  - Fast access
  - Limited by context window size
  - Organized into editable blocks
  - Updated using memory tools

#### 2. **External Memory (Out-of-Context Memory)**
- **Location**: Outside the context window (database, vector store)
- **Purpose**: Long-term storage and retrieval
- **Characteristics**:
  - Unlimited capacity
  - Requires search/retrieval operations
  - Includes conversation history
  - Persists across sessions

### Memory Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    LETTA AGENT                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         CORE MEMORY (In-Context)                 │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │  Block   │  │  Block   │  │  Block   │      │  │
│  │  │ "human"  │  │ "persona"│  │ "custom" │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  │                                                 │  │
│  │  • Fast access                                  │  │
│  │  • Editable via tools                           │  │
│  │  • Limited by context window                    │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │      EXTERNAL MEMORY (Out-of-Context)            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • Conversation History (Recall Memory)          │  │
│  │  • Vector Database                               │  │
│  │  • Long-term Storage                             │  │
│  │  • Searchable via tools                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Memory Blocks

### What are Memory Blocks?
Memory blocks are **named, editable sections** of core memory. Think of them like files in a file system - each block has a name and contains specific information.

### Common Memory Blocks

#### 1. **"human" Block**
Stores information about the human user:
```python
{
    "name": "Dr. Smith",
    "preferences": "Prefers detailed explanations",
    "role": "Medical professional"
}
```

#### 2. **"persona" Block**
Stores the agent's personality and behavior:
```python
{
    "name": "Medical Assistant",
    "tone": "Professional and empathetic",
    "expertise": "Medical report analysis"
}
```

#### 3. **Custom Blocks**
You can create any named block:
```python
{
    "report_history": [...],
    "analysis_cache": {...},
    "user_context": {...}
}
```

### Memory Block Operations

#### Reading Memory
```python
# Agent can read memory blocks
core_memory = agent.get_memory("human")
```

#### Writing/Updating Memory
```python
# Append to memory block
agent.core_memory_append(
    block_name="human",
    content="New information to add"
)

# Replace memory block
agent.core_memory_replace(
    block_name="human",
    old_content="Old info",
    new_content="New info"
)
```

### Memory Block Structure

```
Memory Block: "human"
├── Content: "User information..."
├── Last Updated: 2024-01-15 10:30:00
├── Size: 250 tokens
└── Access Count: 15
```

---

## 📋 Schemas

### What is a Schema?
A **schema** in Letta defines the **structure and validation rules** for memory blocks. It ensures:
- Data consistency
- Type safety
- Validation of memory content
- Clear structure for agents

### Why Schemas are Needed

1. **Type Safety**: Ensures memory contains expected data types
2. **Validation**: Prevents invalid data from being stored
3. **Structure**: Provides clear organization
4. **Documentation**: Serves as documentation for memory structure
5. **Error Prevention**: Catches errors before they cause issues

### Schema Definition Example

```python
from typing import TypedDict, List, Optional
from datetime import datetime

class HumanMemorySchema(TypedDict):
    """Schema for 'human' memory block"""
    name: str
    preferences: str
    role: Optional[str]
    last_interaction: datetime
    interaction_count: int

class ReportHistorySchema(TypedDict):
    """Schema for report history block"""
    reports: List[dict]
    total_analyzed: int
    last_report_date: Optional[datetime]
```

### Schema Validation

```python
# When agent tries to update memory
agent.core_memory_replace(
    block_name="human",
    old_content=current_memory,
    new_content={
        "name": "Dr. Smith",  # ✅ Valid
        "preferences": "Detailed",  # ✅ Valid
        "role": "Doctor",  # ✅ Valid
        "invalid_field": "value"  # ❌ Not in schema - rejected
    }
)
```

### Schema Benefits

| Benefit | Description |
|---------|-------------|
| **Type Safety** | Ensures correct data types |
| **Validation** | Prevents invalid data |
| **Documentation** | Self-documenting structure |
| **IDE Support** | Autocomplete and type hints |
| **Error Detection** | Catches errors early |

---

## 💾 Long-Term Storage

### Overview
Long-term storage allows agents to persist information beyond the context window, enabling:
- Conversation history retention
- Knowledge accumulation over time
- Cross-session memory
- Large-scale information storage

### Storage Mechanisms

#### 1. **Recall Memory (Conversation History)**
Automatically tracks all conversations:
```python
# Agent can search conversation history
results = agent.conversation_search(
    query="knee injury treatment",
    limit=5
)
```

#### 2. **Vector Database Storage**
For semantic search and retrieval:
```python
# Store embeddings
agent.store_memory(
    content="Medical report analysis findings",
    metadata={"report_id": "123", "date": "2024-01-15"}
)

# Retrieve similar memories
similar = agent.search_memory(
    query="treatment recommendations",
    top_k=3
)
```

#### 3. **Structured Database**
For relational data:
```python
# Store structured information
agent.save_to_database(
    table="report_analyses",
    data={
        "report_id": "123",
        "analysis": "...",
        "timestamp": datetime.now()
    }
)
```

### Storage Architecture

```
┌─────────────────────────────────────────┐
│      LONG-TERM STORAGE LAYER             │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   Recall Memory                  │   │
│  │   • Conversation history         │   │
│  │   • Searchable via tools         │   │
│  │   • Automatic tracking           │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   Vector Database                │   │
│  │   • Semantic search              │   │
│  │   • Embeddings storage           │   │
│  │   • Similarity retrieval         │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │   Structured Database             │   │
│  │   • Relational data              │   │
│  │   • Queryable                    │   │
│  │   • Transactional                │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Storage Workflow

```
1. Agent processes information
   ↓
2. Decide: Core Memory or Long-term?
   ↓
3. If Long-term:
   - Store in appropriate system
   - Generate embeddings (if vector)
   - Add metadata
   ↓
4. Later: Retrieve when needed
   - Search conversation history
   - Semantic search in vector DB
   - Query structured database
```

---

## 🔄 Memory Replay and Update Cycles

### Memory Replay
**Memory replay** is the process of retrieving and loading relevant past memories into the current context.

### Replay Process

```
1. Agent receives new input
   ↓
2. Identify relevant past memories
   ↓
3. Search long-term storage
   ↓
4. Retrieve matching memories
   ↓
5. Load into core memory (if needed)
   ↓
6. Agent processes with full context
```

### Update Cycles

#### Cycle 1: Initial Memory Creation
```python
# First interaction
agent.core_memory_append(
    block_name="human",
    content="User: Dr. Smith, Medical Professional"
)
```

#### Cycle 2: Memory Update
```python
# Later interaction - update existing memory
agent.core_memory_replace(
    block_name="human",
    old_content="User: Dr. Smith",
    new_content="User: Dr. Smith, Prefers detailed analysis"
)
```

#### Cycle 3: Memory Replay
```python
# Agent searches for relevant past memories
past_context = agent.conversation_search(
    query="knee injury",
    limit=3
)
# Past context loaded into current session
```

#### Cycle 4: Long-term Storage
```python
# Store important information for later
agent.store_memory(
    content=analysis_result,
    metadata={"type": "analysis", "report_id": "123"}
)
```

### Update Cycle Diagram

```
┌─────────────────────────────────────────┐
│         MEMORY UPDATE CYCLE             │
├─────────────────────────────────────────┤
│                                         │
│  1. Agent receives input                 │
│     ↓                                    │
│  2. Check core memory                    │
│     ↓                                    │
│  3. Search long-term if needed           │
│     ↓                                    │
│  4. Update core memory                   │
│     ↓                                    │
│  5. Process with updated context         │
│     ↓                                    │
│  6. Store important info long-term       │
│     ↓                                    │
│  7. Repeat cycle                         │
│                                         │
└─────────────────────────────────────────┘
```

### Best Practices

1. **Regular Updates**: Update memory blocks as new information arrives
2. **Selective Replay**: Only load relevant past memories
3. **Efficient Storage**: Store only important information long-term
4. **Memory Cleanup**: Periodically clean up outdated information
5. **Validation**: Always validate memory updates against schemas

---

## 👤 Human-in-the-Loop Model

### What is Human-in-the-Loop (HITL)?
HITL is a mechanism where **certain agent actions require human approval** before execution, giving humans control over critical operations.

### Why HITL?

1. **Safety**: Prevent harmful or incorrect actions
2. **Control**: Human oversight of critical operations
3. **Quality**: Ensure outputs meet standards
4. **Compliance**: Meet regulatory requirements
5. **Trust**: Build confidence in agent systems

### HITL Workflow

```
┌─────────────────────────────────────────┐
│      HUMAN-IN-THE-LOOP WORKFLOW         │
├─────────────────────────────────────────┤
│                                         │
│  1. Agent decides to execute tool        │
│     ↓                                    │
│  2. Check: Does tool require approval?   │
│     ↓                                    │
│  3. If YES:                              │
│     • Pause execution                    │
│     • Send approval request              │
│     • Wait for human response            │
│     ↓                                    │
│  4. Human reviews request                │
│     ↓                                    │
│  5. Human responds:                      │
│     • APPROVE → Continue execution       │
│     • DENY → Agent adjusts plan          │
│     • MODIFY → Agent uses modified input │
│     ↓                                    │
│  6. Agent proceeds accordingly           │
│                                         │
└─────────────────────────────────────────┘
```

### Approval Request Structure

```python
{
    "request_id": "req_12345",
    "tool_name": "send_email",
    "arguments": {
        "to": "patient@example.com",
        "subject": "Medical Report Analysis",
        "body": "..."
    },
    "reason": "Agent wants to send analysis to patient",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Implementing HITL

#### 1. Define Tools Requiring Approval
```python
@tool(requires_approval=True)
def send_email(to: str, subject: str, body: str):
    """Send email - requires human approval"""
    # This tool will pause and request approval
    pass
```

#### 2. Handle Approval Requests
```python
def handle_approval_request(request):
    """Human reviews and responds to approval request"""
    print(f"Tool: {request['tool_name']}")
    print(f"Arguments: {request['arguments']}")
    
    response = input("Approve? (y/n/modify): ")
    
    if response == "y":
        return {"approved": True}
    elif response == "n":
        return {"approved": False, "reason": "Denied by human"}
    else:
        # Modify arguments
        modified_args = get_modified_arguments()
        return {"approved": True, "modified_args": modified_args}
```

#### 3. Agent Execution with HITL
```python
# Agent tries to execute tool
result = agent.execute_tool(
    tool_name="send_email",
    arguments={"to": "...", "subject": "...", "body": "..."}
)

# If tool requires approval:
# 1. Execution pauses
# 2. Approval request sent
# 3. Human responds
# 4. Execution continues or stops
```

### HITL Use Cases

| Use Case | Why HITL Needed |
|-----------|----------------|
| **Sending Emails** | Prevent spam, ensure accuracy |
| **Database Writes** | Prevent data corruption |
| **API Calls** | Control external interactions |
| **File Operations** | Prevent accidental deletion |
| **Medical Decisions** | Regulatory compliance |
| **Financial Transactions** | Security and compliance |

### HITL Benefits

- ✅ **Safety**: Prevents harmful actions
- ✅ **Control**: Human oversight
- ✅ **Quality**: Ensures correctness
- ✅ **Compliance**: Meets regulations
- ✅ **Trust**: Builds confidence

---

## 🛠️ Tool Execution

### Programmatic Tool Execution
Letta agents can execute tools **programmatically** - meaning they can call functions, APIs, and operations as part of their reasoning process.

### Tool Execution Flow

```
1. Agent identifies need for tool
   ↓
2. Select appropriate tool
   ↓
3. Validate tool signature
   ↓
4. Prepare arguments
   ↓
5. Check if approval needed (HITL)
   ↓
6. Execute tool
   ↓
7. Process result
   ↓
8. Continue reasoning
```

### Basic Tool Execution

```python
# Agent executes a tool
result = agent.execute_tool(
    tool_name="search_knowledge_base",
    arguments={
        "query": "knee injury treatment",
        "limit": 5
    }
)

# Result is used in agent's reasoning
analysis = agent.reason(
    context=result,
    task="Analyze treatment options"
)
```

### Tool Categories

#### 1. **Memory Tools**
```python
core_memory_append(block_name, content)
core_memory_replace(block_name, old, new)
conversation_search(query, limit)
```

#### 2. **Knowledge Tools**
```python
search_knowledge_base(query, limit)
retrieve_document(doc_id)
query_database(query)
```

#### 3. **Action Tools**
```python
send_email(to, subject, body)
create_file(path, content)
call_api(endpoint, data)
```

#### 4. **Analysis Tools**
```python
analyze_document(document)
extract_entities(text)
classify_content(content)
```

---

## 📝 Tool Signatures and Validation

### What is a Tool Signature?
A **tool signature** defines:
- Tool name
- Required parameters
- Parameter types
- Return type
- Description

### Tool Signature Example

```python
from typing import TypedDict

class SearchKnowledgeBaseSignature(TypedDict):
    """Tool signature for knowledge base search"""
    query: str  # Required: search query
    limit: int  # Required: max results (default: 10)
    filters: dict  # Optional: additional filters

# Tool definition
@tool
def search_knowledge_base(
    query: str,
    limit: int = 10,
    filters: dict = None
) -> List[dict]:
    """
    Search the knowledge base for relevant information.
    
    Args:
        query: The search query string
        limit: Maximum number of results (default: 10)
        filters: Optional filters (e.g., {"category": "medical"})
    
    Returns:
        List of matching documents with scores
    """
    # Implementation
    pass
```

### Input Validation

#### 1. **Type Validation**
```python
# Agent tries to call tool
agent.execute_tool(
    tool_name="search_knowledge_base",
    arguments={
        "query": "treatment",  # ✅ Valid: str
        "limit": "5"  # ❌ Invalid: expected int, got str
    }
)
# Validation fails, error returned
```

#### 2. **Required Parameter Validation**
```python
# Missing required parameter
agent.execute_tool(
    tool_name="search_knowledge_base",
    arguments={
        # "query" missing - ❌ Validation fails
        "limit": 10
    }
)
```

#### 3. **Range Validation**
```python
# Invalid range
agent.execute_tool(
    tool_name="search_knowledge_base",
    arguments={
        "query": "treatment",
        "limit": -5  # ❌ Invalid: must be > 0
    }
)
```

### Validation Process

```
1. Check tool exists
   ↓
2. Validate required parameters present
   ↓
3. Validate parameter types
   ↓
4. Validate parameter ranges/constraints
   ↓
5. If all valid → Execute
   ↓
6. If invalid → Return error with details
```

### Validation Error Response

```python
{
    "error": "validation_failed",
    "tool": "search_knowledge_base",
    "issues": [
        {
            "parameter": "limit",
            "issue": "Expected int, got str",
            "value": "5"
        }
    ],
    "suggestion": "Use limit: 5 (integer)"
}
```

---

## 🧩 Reasoning Steps

### What are Reasoning Steps?
**Reasoning steps** are the individual logical operations an agent performs to solve a problem. They represent the agent's thought process.

### Reasoning Step Structure

```python
{
    "step_id": "step_1",
    "type": "tool_call",
    "tool": "search_knowledge_base",
    "arguments": {"query": "knee injury"},
    "result": {...},
    "next_step": "step_2"
}
```

### Multi-Step Reasoning Example

```python
# Step 1: Search knowledge base
step1 = agent.reason_step(
    action="search",
    tool="search_knowledge_base",
    arguments={"query": "knee injury treatment"}
)

# Step 2: Analyze results
step2 = agent.reason_step(
    action="analyze",
    tool="analyze_findings",
    arguments={"findings": step1.result}
)

# Step 3: Generate summary
step3 = agent.reason_step(
    action="summarize",
    tool="generate_summary",
    arguments={"analysis": step2.result}
)
```

### Reasoning Chain

```
Input: "Analyze knee injury report"
  ↓
Step 1: Search knowledge base
  → Result: Found 5 relevant documents
  ↓
Step 2: Extract key information
  → Result: Treatment options identified
  ↓
Step 3: Analyze patient report
  → Result: Patient condition assessed
  ↓
Step 4: Generate recommendations
  → Result: Treatment plan created
  ↓
Output: Complete analysis report
```

### Reasoning Step Types

1. **Tool Call**: Execute a tool
2. **Memory Access**: Read/write memory
3. **Decision**: Make a choice
4. **Iteration**: Repeat steps
5. **Validation**: Check conditions

---

## 🎛️ Control and Input Validation

### Control Mechanisms

#### 1. **Execution Control**
```python
# Limit number of reasoning steps
agent.max_steps = 10

# Set timeout
agent.timeout = 30  # seconds

# Enable/disable tools
agent.enable_tool("search_knowledge_base")
agent.disable_tool("send_email")
```

#### 2. **Memory Control**
```python
# Limit memory block size
agent.max_memory_block_size = 1000  # tokens

# Control memory updates
agent.require_approval_for_memory_updates = True
```

#### 3. **Tool Execution Control**
```python
# Rate limiting
agent.tool_rate_limit = {
    "search_knowledge_base": 10,  # 10 calls per minute
    "send_email": 1  # 1 call per minute
}
```

### Input Validation Layers

#### Layer 1: Schema Validation
```python
# Validate against schema
schema = HumanMemorySchema
data = {"name": "Dr. Smith", "role": "Doctor"}
validate(data, schema)  # ✅ Passes
```

#### Layer 2: Type Validation
```python
# Validate types
validate_type("query", str, "treatment")  # ✅ Valid
validate_type("limit", int, "5")  # ❌ Invalid
```

#### Layer 3: Range Validation
```python
# Validate ranges
validate_range("limit", 1, 100, 5)  # ✅ Valid
validate_range("limit", 1, 100, 150)  # ❌ Invalid
```

#### Layer 4: Business Logic Validation
```python
# Custom business rules
def validate_email_sending(to: str, subject: str):
    if not to.endswith("@hospital.com"):
        raise ValidationError("Can only send to hospital emails")
    if len(subject) > 100:
        raise ValidationError("Subject too long")
```

### Validation Flow

```
Input Received
  ↓
Layer 1: Schema Validation
  ↓ (if passes)
Layer 2: Type Validation
  ↓ (if passes)
Layer 3: Range Validation
  ↓ (if passes)
Layer 4: Business Logic Validation
  ↓ (if passes)
Execute Tool
```

---

## 💡 Practical Examples

### Example 1: Medical Report Analyzer with Letta

```python
from letta import Agent, MemoryBlock, Schema

# Define schemas
class ReportAnalysisSchema(Schema):
    report_id: str
    analysis: str
    recommendations: List[str]
    confidence: float

# Create agent with memory
agent = Agent(
    name="Medical Analyzer",
    memory_blocks={
        "persona": MemoryBlock(
            content="Expert medical report analyst",
            schema=PersonaSchema
        ),
        "report_cache": MemoryBlock(
            content={},
            schema=ReportAnalysisSchema
        )
    }
)

# Agent workflow
def analyze_report(report_text: str):
    # Step 1: Search knowledge base
    knowledge = agent.execute_tool(
        "search_knowledge_base",
        {"query": extract_keywords(report_text)}
    )
    
    # Step 2: Analyze (requires approval)
    analysis = agent.execute_tool(
        "generate_analysis",  # Requires HITL approval
        {"report": report_text, "knowledge": knowledge}
    )
    
    # Step 3: Store in memory
    agent.core_memory_replace(
        "report_cache",
        old_content=agent.get_memory("report_cache"),
        new_content={
            "report_id": generate_id(),
            "analysis": analysis,
            "timestamp": datetime.now()
        }
    )
    
    return analysis
```

### Example 2: Memory Replay

```python
# Agent searches past conversations
past_analyses = agent.conversation_search(
    query="knee injury",
    limit=3
)

# Load relevant context
for analysis in past_analyses:
    agent.core_memory_append(
        "context",
        f"Previous analysis: {analysis['content']}"
    )

# Use context in current analysis
current_analysis = agent.analyze_with_context(
    new_report,
    context=agent.get_memory("context")
)
```

---

## 📊 Comparison: Letta vs Other Frameworks

| Feature | Letta | LangGraph | CrewAI |
|---------|-------|-----------|--------|
| **Memory-First** | ✅ Core feature | ⚠️ State-based | ⚠️ Basic |
| **Schemas** | ✅ Built-in | ⚠️ TypedDict | ❌ No |
| **Long-term Storage** | ✅ Native | ⚠️ Manual | ⚠️ Manual |
| **HITL** | ✅ Built-in | ⚠️ Custom | ⚠️ Custom |
| **Tool Validation** | ✅ Strong | ⚠️ Basic | ⚠️ Basic |
| **Production-Ready** | ✅ Yes | ✅ Yes | ⚠️ Growing |

---

## 🎓 Key Takeaways

1. **Memory-Centric**: Letta organizes everything around memory blocks
2. **Schemas Matter**: Schemas provide structure and validation
3. **Two-Tier Memory**: Core (fast) + External (persistent)
4. **HITL Built-in**: Human approval for critical operations
5. **Strong Validation**: Multiple layers of input validation
6. **Programmatic Tools**: Agents execute tools as part of reasoning

---

## 📚 Next Steps

- [ ] Set up Letta environment
- [ ] Create your first memory block
- [ ] Define schemas for your use case
- [ ] Implement HITL for critical operations
- [ ] Build tool signatures with validation
- [ ] Integrate with your medical report analyzer

---

*Day 2 - Letta Architecture: Understanding memory-centric agent design*

