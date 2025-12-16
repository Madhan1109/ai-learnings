# Day 1 - Quick Reference Guide

## 🎯 Framework Decision Matrix

### Choose LangGraph if:
- ✅ You need complex stateful workflows
- ✅ You want programmatic control
- ✅ You're building multi-step processes
- ✅ You need conditional routing
- ✅ You want Python or TypeScript

### Choose CrewAI if:
- ✅ You need multiple specialized agents
- ✅ You want role-based agent teams
- ✅ You're building collaborative systems
- ✅ You prefer agent-centric approach
- ✅ You're using Python

### Choose Flowise if:
- ✅ You want visual/no-code interface
- ✅ You need rapid prototyping
- ✅ Non-technical users will build flows
- ✅ You want quick integrations
- ✅ You prefer Node.js backend

### Choose Letta if:
- ✅ You need production-grade reliability
- ✅ You want built-in observability
- ✅ You're building enterprise systems
- ✅ You need advanced error handling
- ✅ You're using Python

---

## 📝 Key Concepts Cheat Sheet

### Orchestration
```
Raw LLM: Single prompt → Single response
Framework: Multiple steps → Coordinated workflow
```

### Planning
```
Reactive: Respond to current state
Proactive: Pre-plan entire workflow
Dynamic: Adjust plan based on results
```

### Tool Use
```
LLM alone: Can only generate text
With tools: Can call APIs, search, calculate, etc.
```

### Multi-Agent
```
Single agent: One AI handles everything
Multi-agent: Specialized agents collaborate
```

### Memory
```
Short-term: Current conversation
Long-term: Persistent across sessions
Vector DB: Semantic search over past interactions
```

---

## 🔧 LangGraph Quick Start

### Basic Structure
```python
from langgraph.graph import StateGraph, END

# 1. Define State
class State(TypedDict):
    data: dict

# 2. Create Graph
graph = StateGraph(State)

# 3. Add Nodes
graph.add_node("node1", function1)
graph.add_node("node2", function2)

# 4. Add Edges
graph.add_edge("node1", "node2")
graph.add_edge("node2", END)

# 5. Compile
app = graph.compile()

# 6. Run
result = app.invoke({"data": {}})
```

### Conditional Routing
```python
def route(state: State) -> str:
    if condition:
        return "path_a"
    return "path_b"

graph.add_conditional_edges(
    "decision_node",
    route,
    {"path_a": "node_a", "path_b": "node_b"}
)
```

### State Updates
```python
def node_function(state: State) -> State:
    return {
        "data": state["data"] | {"new_key": "value"}
    }
```

---

## 👥 CrewAI Quick Start

### Basic Structure
```python
from crewai import Agent, Task, Crew

# 1. Create Agents
agent = Agent(
    role='Role',
    goal='Goal',
    backstory='Backstory'
)

# 2. Create Tasks
task = Task(
    description='Task description',
    agent=agent
)

# 3. Create Crew
crew = Crew(
    agents=[agent],
    tasks=[task]
)

# 4. Run
result = crew.kickoff()
```

---

## 🎨 Flowise Quick Start

1. Install: `npm install -g flowise`
2. Start: `npx flowise start`
3. Open: `http://localhost:3000`
4. Drag & drop nodes
5. Connect nodes
6. Deploy flow

---

## 🔄 Common Patterns

### Sequential Workflow
```
Node A → Node B → Node C → END
```

### Parallel Processing
```
        → Node B →
Node A → → Node C → Node D → END
        → Node E →
```

### Conditional Branching
```
Node A → [Condition] → Node B (if true)
                  → Node C (if false) → END
```

### Loop Pattern
```
Node A → Node B → [Check] → Node A (if continue)
                    → END (if done)
```

### Human-in-the-Loop
```
Node A → Human Review → [Approved?] → Node B
                              → [Rejected] → Node A
```

---

## 🛠️ Tool Integration Pattern

### LangGraph
```python
from langchain.tools import tool

@tool
def search_tool(query: str) -> str:
    """Search the web"""
    return search_api(query)

# Use in node
def node_with_tool(state: State) -> State:
    result = search_tool.invoke(state["query"])
    return {"result": result}
```

### CrewAI
```python
from crewai_tools import tool

@tool
def search_tool(query: str) -> str:
    """Search the web"""
    return search_api(query)

agent = Agent(
    role='Researcher',
    tools=[search_tool]
)
```

---

## 💾 Memory Patterns

### Conversation Memory
```python
# LangGraph
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# Store conversation
app.invoke({"messages": [HumanMessage("Hello")]})
```

### Vector Store Memory
```python
# Store embeddings
vectorstore.add_documents(docs)

# Retrieve similar
results = vectorstore.similarity_search(query)
```

---

## 🚨 Error Handling Patterns

### Retry Logic
```python
from tenacity import retry, stop_after_attempt

@retry(stop=stop_after_attempt(3))
def unreliable_function():
    # May fail, will retry up to 3 times
    pass
```

### Try-Catch in Nodes
```python
def safe_node(state: State) -> State:
    try:
        result = risky_operation()
        return {"result": result}
    except Exception as e:
        return {"error": str(e), "result": None}
```

---

## 📊 State Management Best Practices

1. **Immutable Updates**: Always return new state, don't mutate
2. **Partial Updates**: Only return changed fields
3. **Type Safety**: Use TypedDict for state structure
4. **Validation**: Validate state at entry/exit points
5. **Checkpointing**: Save state for recovery

---

## 🔍 Debugging Tips

### LangGraph
```python
# Enable verbose mode
app = graph.compile(debug=True)

# Stream to see each step
for step in app.stream(initial_state):
    print(step)

# Inspect state
print(state.get("current_step"))
```

### CrewAI
```python
# Verbose output
crew = Crew(agents=[...], tasks=[...], verbose=True)

# Step-by-step execution
result = crew.kickoff()
```

---

## 📈 Performance Optimization

1. **Parallel Execution**: Run independent nodes in parallel
2. **Caching**: Cache LLM responses when possible
3. **Batching**: Process multiple items together
4. **Streaming**: Use streaming for real-time updates
5. **Checkpointing**: Resume from checkpoints, don't restart

---

## 🔐 Security Considerations

1. **Input Validation**: Validate all inputs
2. **Output Sanitization**: Sanitize outputs before display
3. **API Keys**: Never hardcode, use environment variables
4. **Rate Limiting**: Implement rate limits for APIs
5. **Error Messages**: Don't expose sensitive info in errors

---

## 📚 Next Steps Checklist

- [ ] Set up development environment
- [ ] Install LangGraph: `pip install langgraph`
- [ ] Run the example code
- [ ] Modify example for your use case
- [ ] Integrate with Azure services
- [ ] Add error handling
- [ ] Test with real data
- [ ] Deploy to production

---

*Quick reference for Day 1 - Agent Frameworks Overview*

