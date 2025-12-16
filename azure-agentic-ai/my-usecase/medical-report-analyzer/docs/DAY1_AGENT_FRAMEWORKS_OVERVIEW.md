# Day 1 — Agent Frameworks Overview: LangGraph, Letta, Flowise, CrewAI

## 🎯 Learning Objective
Get a clear mental map of the major agent frameworks — what they solve, their UX (visual vs programmatic), and typical use-cases, with a focus on LangGraph basics.

---

## 📚 Table of Contents
1. [Core Concepts](#core-concepts)
2. [Framework Comparison](#framework-comparison)
3. [LangGraph Deep Dive](#langgraph-deep-dive)
4. [CrewAI Overview](#crewai-overview)
5. [Flowise Overview](#flowise-overview)
6. [Letta Overview](#letta-overview)
7. [Why Frameworks Over Raw LLM Prompting](#why-frameworks-over-raw-llm-prompting)
8. [Key Benefits](#key-benefits)
9. [Use Cases & Examples](#use-cases--examples)

---

## 🔑 Core Concepts

### 1. **Orchestration**
**Definition**: The coordination and management of multiple steps, agents, or tools in a workflow.

**Why it matters**: 
- Raw LLMs are stateless and single-shot
- Real applications need multi-step reasoning
- Complex tasks require breaking down into sub-tasks
- Need to manage state, retries, and error handling

**Example**: Analyzing a medical report might require:
1. Extract text from PDF
2. Identify key sections
3. Query knowledge base
4. Generate analysis
5. Format response

### 2. **Planning**
**Definition**: The ability of an agent to break down a high-level goal into a sequence of actionable steps.

**Types**:
- **Reactive Planning**: Responds to current state (most common)
- **Proactive Planning**: Pre-plans entire workflow
- **Dynamic Planning**: Adjusts plan based on intermediate results

**Example**: 
- Goal: "Analyze this medical report and suggest treatment"
- Plan: [Extract → Classify → Research → Generate → Validate]

### 3. **Tool Use**
**Definition**: Agents calling external functions/APIs to perform actions beyond text generation.

**Common Tools**:
- Web search APIs
- Database queries
- File operations
- Calculator functions
- API integrations (weather, maps, etc.)

**Why important**: LLMs can't directly access real-time data or perform actions. Tools bridge this gap.

### 4. **Multi-Agent Collaboration**
**Definition**: Multiple specialized agents working together to solve complex problems.

**Patterns**:
- **Sequential**: Agent A → Agent B → Agent C
- **Parallel**: Multiple agents work simultaneously
- **Hierarchical**: Manager agent delegates to worker agents
- **Collaborative**: Agents share information and coordinate

**Example**: 
- **Researcher Agent**: Finds relevant information
- **Analyst Agent**: Processes and analyzes data
- **Writer Agent**: Formats output
- **Reviewer Agent**: Validates quality

### 5. **Memory**
**Definition**: How agents retain and use information across interactions.

**Types**:
- **Short-term Memory**: Current conversation context
- **Long-term Memory**: Persistent knowledge across sessions
- **Episodic Memory**: Remembering specific past events
- **Semantic Memory**: General knowledge and facts

**Implementation**:
- In-context (prompt history)
- Vector databases (semantic search)
- Traditional databases (structured data)
- External knowledge bases

### 6. **Controllers**
**Definition**: Components that manage agent execution, routing, and decision-making.

**Responsibilities**:
- Decide which agent/tool to call next
- Handle conditional logic
- Manage loops and iterations
- Error handling and retries
- State management

---

## 🆚 Framework Comparison

| Feature | LangGraph | CrewAI | Flowise | Letta |
|---------|-----------|--------|---------|-------|
| **Primary Focus** | Workflow orchestration | Multi-agent collaboration | Visual workflow builder | Agent orchestration |
| **UX Style** | Programmatic (Python/JS) | Programmatic (Python) | Visual (Drag-and-drop) | Programmatic (Python) |
| **Language** | Python, TypeScript | Python | Node.js (backend) | Python |
| **Graph/Workflow** | ✅ StateGraph | ✅ Crew workflows | ✅ Visual nodes | ✅ Agent graphs |
| **Multi-Agent** | ✅ (via nodes) | ✅✅ (Core feature) | ✅ (via agents) | ✅ (via agents) |
| **Memory** | ✅ (State management) | ✅ (Built-in) | ✅ (Conversation memory) | ✅ (Stateful) |
| **Tool Integration** | ✅✅ (Excellent) | ✅✅ (Excellent) | ✅ (UI-based) | ✅ (Python functions) |
| **Learning Curve** | Medium | Medium | Low (visual) | Medium |
| **Best For** | Complex workflows, state machines | Team-based agent systems | Non-coders, rapid prototyping | Production agent systems |
| **Deployment** | Self-hosted | Self-hosted | Self-hosted/Cloud | Self-hosted |

---

## 🕸️ LangGraph Deep Dive

### What is LangGraph?
**LangGraph** is a library for building stateful, multi-actor applications with LLMs. It extends LangChain by adding cycles and state management.

### Key Concepts

#### 1. **StateGraph**
The core abstraction - a graph where:
- **Nodes** = Functions (agents, tools, processing steps)
- **Edges** = Transitions between nodes
- **State** = Shared data structure passed between nodes

```python
from langgraph.graph import StateGraph, END

# Define state
from typing import TypedDict

class State(TypedDict):
    messages: list
    current_step: str
    data: dict

# Create graph
graph = StateGraph(State)

# Add nodes
graph.add_node("extract", extract_text)
graph.add_node("analyze", analyze_content)
graph.add_node("generate", generate_response)

# Add edges
graph.add_edge("extract", "analyze")
graph.add_edge("analyze", "generate")
graph.add_edge("generate", END)

# Compile
app = graph.compile()
```

#### 2. **Nodes**
Functions that process state and return updates:

```python
def extract_text(state: State) -> State:
    # Process input
    text = extract_from_pdf(state["input_file"])
    return {"messages": state["messages"] + [text]}
```

#### 3. **Edges**
Define flow between nodes:
- **Fixed edges**: Always follow this path
- **Conditional edges**: Route based on state

```python
def should_continue(state: State) -> str:
    if state["needs_research"]:
        return "research_node"
    return "generate_node"

graph.add_conditional_edges(
    "analyze",
    should_continue,
    {
        "research_node": "research",
        "generate_node": "generate"
    }
)
```

#### 4. **State Management**
- **Reducer functions**: Merge state updates
- **Checkpoints**: Save/restore state
- **Streaming**: Real-time updates

#### 5. **Human-in-the-Loop**
Interrupt workflow for human input:

```python
graph.add_node("human_review", human_review_node)
graph.add_edge("generate", "human_review")
graph.add_edge("human_review", END)
```

### LangGraph Architecture

```
┌─────────────────────────────────────────┐
│           LangGraph Application         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐      ┌──────────┐        │
│  │  Node 1  │─────▶│  Node 2  │        │
│  │ (Extract)│      │ (Analyze)│        │
│  └──────────┘      └──────────┘        │
│       │                  │              │
│       │                  ▼              │
│       │            ┌──────────┐        │
│       └───────────▶│  Node 3  │        │
│                    │(Generate)│        │
│                    └──────────┘        │
│                         │              │
│                         ▼              │
│                      [ END ]           │
│                                         │
│  State: {messages, data, step}         │
└─────────────────────────────────────────┘
```

### Typical LangGraph Use Cases
1. **Multi-step document processing**
2. **Conversational agents with memory**
3. **Workflow automation**
4. **Decision trees with LLM reasoning**
5. **RAG pipelines with multiple retrieval steps**

---

## 👥 CrewAI Overview

### What is CrewAI?
**CrewAI** is a framework for orchestrating role-playing, autonomous AI agents that collaborate to solve complex tasks.

### Key Concepts

#### 1. **Agents**
Specialized AI workers with roles, goals, and backstories:

```python
from crewai import Agent

researcher = Agent(
    role='Medical Research Specialist',
    goal='Find accurate medical information',
    backstory='Expert in medical literature and research',
    tools=[web_search_tool, database_tool],
    verbose=True
)
```

#### 2. **Tasks**
Specific assignments for agents:

```python
from crewai import Task

research_task = Task(
    description='Research treatment options for knee injuries',
    agent=researcher,
    expected_output='List of evidence-based treatment options'
)
```

#### 3. **Crews**
Teams of agents working together:

```python
from crewai import Crew

crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    verbose=True
)

result = crew.kickoff()
```

#### 4. **Processes**
How agents collaborate:
- **Sequential**: One after another
- **Hierarchical**: Manager delegates to workers

### CrewAI Architecture

```
┌─────────────────────────────────────────┐
│              CrewAI Crew                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         Manager Agent            │  │
│  │    (Orchestrates workflow)       │  │
│  └──────────────────────────────────┘  │
│              │                          │
│    ┌─────────┼─────────┐               │
│    │         │         │               │
│    ▼         ▼         ▼               │
│  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │Agent│  │Agent│  │Agent│            │
│  │  1  │  │  2  │  │  3  │            │
│  └─────┘  └─────┘  └─────┘            │
│    │         │         │               │
│    └─────────┼─────────┘               │
│              ▼                          │
│         Final Output                    │
└─────────────────────────────────────────┘
```

### Typical CrewAI Use Cases
1. **Content creation teams** (researcher + writer + editor)
2. **Data analysis teams** (collector + analyst + reporter)
3. **Customer support** (triage + specialist + follow-up)
4. **Research projects** (multiple domain experts)

---

## 🎨 Flowise Overview

### What is Flowise?
**Flowise** is a low-code tool for building customized LLM applications and agents with a visual drag-and-drop interface.

### Key Features

#### 1. **Visual Workflow Builder**
- Drag-and-drop nodes
- Connect nodes visually
- No coding required for basic flows

#### 2. **Node Types**
- **LLM Nodes**: OpenAI, Anthropic, local models
- **Memory Nodes**: Conversation memory
- **Tool Nodes**: Custom functions, APIs
- **Agent Nodes**: Autonomous agents
- **Vector Store Nodes**: RAG capabilities
- **Output Nodes**: Format responses

#### 3. **Templates**
Pre-built templates for common use cases:
- Chatbots
- RAG applications
- Document Q&A
- Code generation

### Flowise Architecture

```
┌─────────────────────────────────────────┐
│        Flowise Visual Editor            │
├─────────────────────────────────────────┤
│                                         │
│  [LLM] ──▶ [Memory] ──▶ [Tool]         │
│    │          │            │            │
│    └──────────┴────────────┘            │
│              │                          │
│              ▼                          │
│          [Output]                       │
│                                         │
│  Drag & Drop Interface                  │
└─────────────────────────────────────────┘
```

### Typical Flowise Use Cases
1. **Rapid prototyping** of LLM applications
2. **Non-technical users** building chatbots
3. **Visual workflow design**
4. **Quick integrations** with existing systems

---

## 🚀 Letta Overview

### What is Letta?
**Letta** is a Python framework for building production-ready agentic applications with a focus on reliability and observability.

### Key Features

#### 1. **Agent Graphs**
Similar to LangGraph but with Letta's own abstractions:

```python
from letta import Agent, Graph

agent1 = Agent(name="researcher", ...)
agent2 = Agent(name="analyzer", ...)

graph = Graph()
graph.add_node(agent1)
graph.add_node(agent2)
graph.add_edge(agent1, agent2)
```

#### 2. **Built-in Observability**
- Logging
- Tracing
- Metrics
- Debugging tools

#### 3. **Production Features**
- Error handling
- Retries
- Rate limiting
- Caching

### Typical Letta Use Cases
1. **Production agent systems**
2. **Enterprise applications**
3. **High-reliability requirements**
4. **Observable agent workflows**

---

## 💡 Why Frameworks Over Raw LLM Prompting?

### Problems with Raw LLM Prompting

#### 1. **No State Management**
```python
# Raw LLM - stateless
response1 = llm("What is 2+2?")
response2 = llm("What did I just ask?")  # Doesn't remember!
```

**Framework Solution**: Maintain conversation state automatically

#### 2. **No Tool Integration**
```python
# Raw LLM - can't access real data
response = llm("What's the weather today?")
# LLM can only guess or hallucinate
```

**Framework Solution**: Built-in tool calling mechanisms

#### 3. **No Multi-Step Reasoning**
```python
# Raw LLM - single shot
response = llm("Analyze this 100-page document and summarize")
# May fail or produce incomplete results
```

**Framework Solution**: Break into steps, manage workflow

#### 4. **No Error Handling**
```python
# Raw LLM - no retry logic
response = llm(prompt)  # What if it fails?
```

**Framework Solution**: Built-in retries, error recovery

#### 5. **No Reusability**
```python
# Raw LLM - copy-paste prompts everywhere
prompt = "You are a helpful assistant..."
# Hard to maintain, version, test
```

**Framework Solution**: Reusable components, versioning

### Framework Advantages

| Aspect | Raw LLM | Framework |
|--------|---------|-----------|
| **State** | Manual management | Built-in |
| **Tools** | Manual integration | Native support |
| **Multi-step** | Complex prompting | Workflow graphs |
| **Error handling** | Manual try-catch | Built-in retries |
| **Testing** | Difficult | Testable components |
| **Debugging** | Hard to trace | Observability tools |
| **Reusability** | Copy-paste | Modular components |

---

## ✅ Key Benefits

### 1. **Reliability**
- **Retry mechanisms**: Automatic retries on failures
- **Error handling**: Graceful degradation
- **Validation**: Input/output validation
- **Checkpointing**: Resume from failures

**Example**:
```python
# LangGraph checkpoint
app = graph.compile(checkpointer=MemorySaver())
# Can resume from any point
```

### 2. **Determinism**
- **Structured workflows**: Predictable execution paths
- **State management**: Consistent state transitions
- **Conditional logic**: Clear decision points
- **Testing**: Testable components

**Example**:
```python
# Always follows same path for same input
if condition:
    route_to_node_A()
else:
    route_to_node_B()
```

### 3. **Reusability**
- **Modular components**: Reuse nodes/agents
- **Templates**: Pre-built patterns
- **Libraries**: Share across projects
- **Versioning**: Track changes

**Example**:
```python
# Reusable agent
medical_agent = create_medical_agent()
# Use in multiple workflows
```

### 4. **Structured Control**
- **Explicit flow**: Visual or code-based graphs
- **Conditional routing**: Smart decision making
- **Parallel execution**: Speed up workflows
- **Human-in-the-loop**: Controlled interventions

**Example**:
```python
# Clear control flow
graph.add_conditional_edges(
    "decision_node",
    route_function,
    {"path_a": "node_a", "path_b": "node_b"}
)
```

---

## 🎯 Use Cases & Examples

### Medical Report Analyzer (Your Project!)

#### Using LangGraph:
```python
# Workflow:
# 1. Upload document
# 2. Extract text (Document Intelligence)
# 3. Classify report type
# 4. Query knowledge base (Cognitive Search)
# 5. Generate analysis (OpenAI)
# 6. Format response

graph = StateGraph(MedicalReportState)
graph.add_node("extract", extract_from_pdf)
graph.add_node("classify", classify_report_type)
graph.add_node("retrieve", retrieve_knowledge)
graph.add_node("analyze", generate_analysis)
graph.add_node("format", format_response)
```

#### Using CrewAI:
```python
# Team:
# - Document Processor Agent
# - Medical Analyst Agent
# - Solution Generator Agent
# - Formatter Agent

crew = Crew(
    agents=[processor, analyst, generator, formatter],
    tasks=[process_task, analyze_task, generate_task, format_task]
)
```

### Other Common Use Cases

1. **Customer Support Bot**
   - Triage agent → Specialist agent → Follow-up agent

2. **Research Assistant**
   - Search agent → Summarizer agent → Writer agent

3. **Code Review System**
   - Code analyzer → Security checker → Style reviewer

4. **Content Creation**
   - Researcher → Writer → Editor → Publisher

---

## 📖 Learning Path Recommendations

### For LangGraph (Recommended Starting Point):
1. ✅ Understand StateGraph basics
2. ✅ Learn node and edge concepts
3. ✅ Practice conditional routing
4. ✅ Implement state management
5. ✅ Add human-in-the-loop
6. ✅ Build a complete workflow

### For CrewAI:
1. ✅ Create your first agent
2. ✅ Define tasks
3. ✅ Build a crew
4. ✅ Understand agent collaboration
5. ✅ Add tools to agents

### For Flowise:
1. ✅ Explore the visual interface
2. ✅ Build a simple chatbot
3. ✅ Add memory
4. ✅ Integrate tools
5. ✅ Deploy a flow

### For Letta:
1. ✅ Set up Letta environment
2. ✅ Create agent graphs
3. ✅ Add observability
4. ✅ Deploy to production

---

## 🔗 Key Resources

### LangGraph
- Official Docs: https://langchain-ai.github.io/langgraph/
- GitHub: https://github.com/langchain-ai/langgraph
- Tutorials: LangChain documentation

### CrewAI
- Official Docs: https://docs.crewai.com/
- GitHub: https://github.com/joaomdmoura/crewAI

### Flowise
- Official Docs: https://docs.flowiseai.com/
- GitHub: https://github.com/FlowiseAI/Flowise

### Letta
- GitHub: https://github.com/letta-ai/letta
- Documentation: Check GitHub README

---

## 🎓 Day 1 Checklist

- [ ] Understand orchestration, planning, tool use, multi-agent concepts
- [ ] Know the differences between LangGraph, CrewAI, Flowise, Letta
- [ ] Understand agents, tools, workflows/graphs, memory, controllers
- [ ] Know how frameworks improve over raw LLM prompting
- [ ] Understand reliability, determinism, reusability, structured control
- [ ] Set up LangGraph environment
- [ ] Build a simple LangGraph workflow
- [ ] Explore one other framework (CrewAI/Flowise/Letta)

---

## 🚀 Next Steps (Day 2 Preview)

- Hands-on LangGraph tutorial
- Building your first agent workflow
- Integrating with your medical report analyzer
- Advanced state management
- Error handling and retries

---

*Last Updated: Day 1 - Agent Frameworks Overview*

