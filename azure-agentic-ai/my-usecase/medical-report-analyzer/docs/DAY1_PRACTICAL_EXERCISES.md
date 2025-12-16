# Day 1 - Practical Exercises

## 🎯 Exercise Goals
- Hands-on experience with LangGraph
- Understanding workflow design
- Building your first agent system
- Applying concepts to your medical report analyzer

---

## 📋 Exercise 1: Hello LangGraph

### Objective
Create your first LangGraph workflow with 3 simple nodes.

### Steps
1. Install LangGraph: `pip install langgraph langchain`
2. Create a simple graph:
   - Node 1: Takes input, adds "Hello"
   - Node 2: Takes previous output, adds "World"
   - Node 3: Takes previous output, adds "!"
3. Connect nodes sequentially
4. Run and verify output

### Expected Output
```
Input: ""
Output: "Hello World !"
```

### Solution Template
```python
from typing import TypedDict
from langgraph.graph import StateGraph, END

class State(TypedDict):
    message: str

def node1(state: State) -> State:
    return {"message": state["message"] + "Hello "}

def node2(state: State) -> State:
    return {"message": state["message"] + "World "}

def node3(state: State) -> State:
    return {"message": state["message"] + "!"}

graph = StateGraph(State)
graph.add_node("node1", node1)
graph.add_node("node2", node2)
graph.add_node("node3", node3)
graph.set_entry_point("node1")
graph.add_edge("node1", "node2")
graph.add_edge("node2", "node3")
graph.add_edge("node3", END)

app = graph.compile()
result = app.invoke({"message": ""})
print(result["message"])
```

---

## 📋 Exercise 2: Conditional Routing

### Objective
Build a graph that routes based on input value.

### Steps
1. Create a graph with:
   - Entry node: Receives a number
   - Conditional routing:
     - If number > 10 → "high" node
     - If number <= 10 → "low" node
   - Both paths converge to "end" node
2. Test with different inputs

### Expected Behavior
- Input: 15 → Route to "high"
- Input: 5 → Route to "low"

### Solution Template
```python
from typing import Literal

class NumberState(TypedDict):
    number: int
    category: str

def entry_node(state: NumberState) -> NumberState:
    return state

def high_node(state: NumberState) -> NumberState:
    return {"category": "high"}

def low_node(state: NumberState) -> NumberState:
    return {"category": "low"}

def route(state: NumberState) -> Literal["high", "low"]:
    if state["number"] > 10:
        return "high"
    return "low"

graph = StateGraph(NumberState)
graph.add_node("entry", entry_node)
graph.add_node("high", high_node)
graph.add_node("low", low_node)
graph.set_entry_point("entry")
graph.add_conditional_edges("entry", route, {"high": "high", "low": "low"})
graph.add_edge("high", END)
graph.add_edge("low", END)

app = graph.compile()
```

---

## 📋 Exercise 3: Simple Medical Report Processor

### Objective
Build a simplified version of your medical report analyzer.

### Steps
1. Create nodes for:
   - Extract text (simulate)
   - Identify keywords
   - Classify report type
   - Generate summary
2. Connect in sequence
3. Test with sample report text

### Sample Input
```
"Patient presents with knee pain. Swelling observed. 
Limited range of motion. Recommend physical therapy."
```

### Expected Output
```json
{
  "keywords": ["knee", "pain", "swelling", "mobility"],
  "report_type": "orthopedic",
  "summary": "Knee injury requiring physical therapy"
}
```

### Solution Template
```python
class ReportState(TypedDict):
    report_text: str
    keywords: list
    report_type: str
    summary: str

def extract_keywords(state: ReportState) -> ReportState:
    text = state["report_text"].lower()
    medical_keywords = ["knee", "pain", "swelling", "cardiac", "heart"]
    found = [kw for kw in medical_keywords if kw in text]
    return {"keywords": found}

def classify(state: ReportState) -> ReportState:
    keywords = state["keywords"]
    if "knee" in keywords or "orthopedic" in keywords:
        return {"report_type": "orthopedic"}
    elif "cardiac" in keywords or "heart" in keywords:
        return {"report_type": "cardiology"}
    return {"report_type": "general"}

def summarize(state: ReportState) -> ReportState:
    report_type = state["report_type"]
    keywords = ", ".join(state["keywords"])
    summary = f"{report_type.title()} report. Keywords: {keywords}"
    return {"summary": summary}

# Build graph...
```

---

## 📋 Exercise 4: Multi-Agent Simulation

### Objective
Simulate multiple agents working together (using nodes as agents).

### Steps
1. Create 3 "agent" nodes:
   - Researcher: Finds information
   - Analyst: Processes data
   - Writer: Formats output
2. Connect sequentially
3. Each agent adds to shared state

### Expected Flow
```
Input → Researcher → Analyst → Writer → Output
```

### Solution Template
```python
class AgentState(TypedDict):
    query: str
    research: str
    analysis: str
    output: str

def researcher(state: AgentState) -> AgentState:
    # Simulate research
    return {"research": f"Found info about: {state['query']}"}

def analyst(state: AgentState) -> AgentState:
    # Simulate analysis
    return {"analysis": f"Analysis of: {state['research']}"}

def writer(state: AgentState) -> AgentState:
    # Simulate writing
    return {"output": f"Final report: {state['analysis']}"}

# Build graph with sequential flow...
```

---

## 📋 Exercise 5: Error Handling

### Objective
Add error handling to a workflow.

### Steps
1. Create a node that may fail
2. Add error handling node
3. Route to error handler on failure
4. Continue or exit based on error type

### Solution Template
```python
class StateWithError(TypedDict):
    data: str
    error: str
    success: bool

def risky_node(state: StateWithError) -> StateWithError:
    try:
        # Simulate operation that might fail
        if "error" in state["data"]:
            raise ValueError("Simulated error")
        return {"success": True, "error": ""}
    except Exception as e:
        return {"success": False, "error": str(e)}

def error_handler(state: StateWithError) -> StateWithError:
    print(f"Error occurred: {state['error']}")
    return state

def route_on_error(state: StateWithError) -> Literal["success", "error"]:
    if state.get("success", False):
        return "success"
    return "error"

# Add conditional routing based on success/error
```

---

## 📋 Exercise 6: State Persistence

### Objective
Use checkpoints to save and restore state.

### Steps
1. Create a graph with checkpoints
2. Run workflow
3. Save checkpoint
4. Resume from checkpoint

### Solution Template
```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()

# Create graph with checkpointer
app = graph.compile(checkpointer=checkpointer)

# Run with thread_id for state persistence
config = {"configurable": {"thread_id": "1"}}
result1 = app.invoke(initial_state, config)

# Resume from checkpoint
result2 = app.invoke(additional_state, config)
```

---

## 📋 Exercise 7: Streaming Updates

### Objective
Use streaming to see real-time progress.

### Steps
1. Create a multi-step workflow
2. Use streaming to see each step
3. Display progress updates

### Solution Template
```python
# Stream execution
for step in app.stream(initial_state):
    node_name = list(step.keys())[0]
    state_update = step[node_name]
    print(f"Completed: {node_name}")
    print(f"State: {state_update.get('current_step', 'processing')}")
```

---

## 📋 Exercise 8: Integrate with Your Project

### Objective
Connect LangGraph to your medical report analyzer.

### Steps
1. Review your existing backend code
2. Identify workflow steps:
   - Document upload
   - Text extraction (Azure Document Intelligence)
   - Knowledge retrieval (Azure Cognitive Search)
   - Analysis (Azure OpenAI)
   - Response formatting
3. Create LangGraph workflow
4. Replace or enhance existing service

### Integration Points
```python
# In your RAGPipelineService or new LangGraphService
from langgraph.graph import StateGraph

class MedicalReportGraph:
    def __init__(self, azure_services):
        self.doc_intelligence = azure_services.doc_intelligence
        self.cognitive_search = azure_services.cognitive_search
        self.openai = azure_services.openai
        self.graph = self._build_graph()
    
    def _build_graph(self):
        graph = StateGraph(MedicalReportState)
        # Add nodes that call your Azure services
        # ...
        return graph.compile()
    
    def analyze(self, document):
        return self.graph.invoke({"document": document})
```

---

## 🎓 Challenge Exercises

### Challenge 1: Parallel Processing
Create a graph where multiple nodes run in parallel, then merge results.

### Challenge 2: Human-in-the-Loop
Add a node that pauses for human input before continuing.

### Challenge 3: Retry Logic
Implement automatic retries for failed nodes.

### Challenge 4: Dynamic Workflow
Create a workflow that adds nodes dynamically based on input.

---

## ✅ Completion Checklist

- [ ] Exercise 1: Hello LangGraph
- [ ] Exercise 2: Conditional Routing
- [ ] Exercise 3: Medical Report Processor
- [ ] Exercise 4: Multi-Agent Simulation
- [ ] Exercise 5: Error Handling
- [ ] Exercise 6: State Persistence
- [ ] Exercise 7: Streaming Updates
- [ ] Exercise 8: Project Integration
- [ ] At least one Challenge Exercise

---

## 📚 Resources

- LangGraph Docs: https://langchain-ai.github.io/langgraph/
- Example Code: `DAY1_LANGGRAPH_EXAMPLE.py`
- Quick Reference: `DAY1_QUICK_REFERENCE.md`

---

*Practice exercises for Day 1 - Build your understanding through hands-on coding!*

