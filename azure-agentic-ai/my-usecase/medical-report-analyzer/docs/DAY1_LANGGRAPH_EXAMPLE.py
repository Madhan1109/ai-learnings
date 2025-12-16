"""
Day 1 - LangGraph Hands-On Example
A simple medical report analysis workflow using LangGraph concepts

This example demonstrates:
- StateGraph creation
- Node definitions
- Edge connections
- Conditional routing
- State management
"""

from typing import TypedDict, List, Literal
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage


# ============================================================================
# 1. Define State
# ============================================================================

class MedicalReportState(TypedDict):
    """State that flows through the graph"""
    # Input
    report_text: str
    report_type: str
    
    # Processing steps
    extracted_keywords: List[str]
    knowledge_base_results: dict
    analysis: str
    
    # Output
    recommendations: List[str]
    formatted_response: str
    
    # Control
    current_step: str
    needs_human_review: bool
    error: str


# ============================================================================
# 2. Define Node Functions
# ============================================================================

def extract_keywords_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 1: Extract keywords from medical report
    """
    print(f"[Node: extract_keywords] Processing report...")
    
    # Simulate keyword extraction
    # In real implementation, use NLP or LLM
    keywords = ["knee", "injury", "pain", "swelling", "mobility"]
    
    return {
        "extracted_keywords": keywords,
        "current_step": "keywords_extracted"
    }


def classify_report_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 2: Classify the type of medical report
    """
    print(f"[Node: classify_report] Classifying report type...")
    
    keywords = state.get("extracted_keywords", [])
    
    # Simple classification logic
    if "knee" in keywords:
        report_type = "orthopedic"
    elif "cardiac" in keywords or "heart" in keywords:
        report_type = "cardiology"
    else:
        report_type = "general"
    
    return {
        "report_type": report_type,
        "current_step": "classified"
    }


def retrieve_knowledge_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 3: Query knowledge base (simulated)
    """
    print(f"[Node: retrieve_knowledge] Querying knowledge base...")
    
    report_type = state.get("report_type", "general")
    keywords = state.get("extracted_keywords", [])
    
    # Simulate knowledge base query
    # In real implementation, use Azure Cognitive Search
    knowledge_results = {
        "relevant_articles": [
            f"Treatment protocol for {report_type} conditions",
            f"Best practices for {keywords[0]} injuries"
        ],
        "similar_cases": 5,
        "treatment_options": [
            "Physical therapy",
            "Medication",
            "Rest and recovery"
        ]
    }
    
    return {
        "knowledge_base_results": knowledge_results,
        "current_step": "knowledge_retrieved"
    }


def generate_analysis_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 4: Generate analysis using LLM
    """
    print(f"[Node: generate_analysis] Generating analysis...")
    
    report_text = state.get("report_text", "")
    knowledge = state.get("knowledge_base_results", {})
    keywords = state.get("extracted_keywords", [])
    
    # Simulate LLM analysis
    # In real implementation, use Azure OpenAI
    analysis = f"""
    Analysis Summary:
    - Keywords identified: {', '.join(keywords)}
    - Report type: {state.get('report_type', 'unknown')}
    - Found {knowledge.get('similar_cases', 0)} similar cases
    - Treatment options available: {len(knowledge.get('treatment_options', []))}
    
    Based on the medical report analysis, the patient presents with 
    symptoms consistent with the identified condition. Recommended 
    treatment approaches include the options found in our knowledge base.
    """
    
    return {
        "analysis": analysis,
        "current_step": "analysis_generated"
    }


def generate_recommendations_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 5: Generate specific recommendations
    """
    print(f"[Node: generate_recommendations] Creating recommendations...")
    
    knowledge = state.get("knowledge_base_results", {})
    treatment_options = knowledge.get("treatment_options", [])
    
    recommendations = [
        f"1. {treatment_options[0] if len(treatment_options) > 0 else 'Consult specialist'}",
        f"2. {treatment_options[1] if len(treatment_options) > 1 else 'Follow-up appointment'}",
        f"3. {treatment_options[2] if len(treatment_options) > 2 else 'Monitor symptoms'}"
    ]
    
    return {
        "recommendations": recommendations,
        "current_step": "recommendations_ready"
    }


def format_response_node(state: MedicalReportState) -> MedicalReportState:
    """
    Node 6: Format final response
    """
    print(f"[Node: format_response] Formatting final response...")
    
    analysis = state.get("analysis", "")
    recommendations = state.get("recommendations", [])
    
    formatted = f"""
    ╔═══════════════════════════════════════════════════════╗
    ║        MEDICAL REPORT ANALYSIS RESULTS                ║
    ╚═══════════════════════════════════════════════════════╝
    
    ANALYSIS:
    {analysis}
    
    RECOMMENDATIONS:
    {chr(10).join(recommendations)}
    
    ════════════════════════════════════════════════════════
    """
    
    return {
        "formatted_response": formatted,
        "current_step": "complete"
    }


def human_review_node(state: MedicalReportState) -> MedicalReportState:
    """
    Optional Node: Human review checkpoint
    """
    print(f"[Node: human_review] Waiting for human review...")
    print(f"Analysis preview: {state.get('analysis', '')[:100]}...")
    
    # In real implementation, pause and wait for human input
    # For now, simulate approval
    return {
        "needs_human_review": False,
        "current_step": "reviewed"
    }


# ============================================================================
# 3. Define Conditional Routing Function
# ============================================================================

def should_review(state: MedicalReportState) -> Literal["review", "format"]:
    """
    Conditional routing: Decide if human review is needed
    """
    # Simple logic: review if report type is critical
    report_type = state.get("report_type", "")
    
    if report_type in ["cardiology", "neurology"]:
        return "review"
    return "format"


# ============================================================================
# 4. Build the Graph
# ============================================================================

def create_medical_report_graph():
    """
    Create and configure the LangGraph workflow
    """
    # Initialize graph with state
    graph = StateGraph(MedicalReportState)
    
    # Add nodes (processing steps)
    graph.add_node("extract_keywords", extract_keywords_node)
    graph.add_node("classify", classify_report_node)
    graph.add_node("retrieve_knowledge", retrieve_knowledge_node)
    graph.add_node("generate_analysis", generate_analysis_node)
    graph.add_node("generate_recommendations", generate_recommendations_node)
    graph.add_node("format_response", format_response_node)
    graph.add_node("human_review", human_review_node)
    
    # Set entry point
    graph.set_entry_point("extract_keywords")
    
    # Add edges (workflow connections)
    graph.add_edge("extract_keywords", "classify")
    graph.add_edge("classify", "retrieve_knowledge")
    graph.add_edge("retrieve_knowledge", "generate_analysis")
    graph.add_edge("generate_analysis", "generate_recommendations")
    
    # Conditional edge: review or skip to formatting
    graph.add_conditional_edges(
        "generate_recommendations",
        should_review,
        {
            "review": "human_review",
            "format": "format_response"
        }
    )
    
    # After review, go to formatting
    graph.add_edge("human_review", "format_response")
    
    # End after formatting
    graph.add_edge("format_response", END)
    
    # Compile the graph
    return graph.compile()


# ============================================================================
# 5. Run the Workflow
# ============================================================================

def run_example():
    """
    Example usage of the medical report analyzer graph
    """
    print("=" * 60)
    print("Medical Report Analyzer - LangGraph Example")
    print("=" * 60)
    print()
    
    # Create the graph
    app = create_medical_report_graph()
    
    # Initial state
    initial_state = {
        "report_text": "Patient presents with knee pain and swelling. Limited mobility observed.",
        "report_type": "",
        "extracted_keywords": [],
        "knowledge_base_results": {},
        "analysis": "",
        "recommendations": [],
        "formatted_response": "",
        "current_step": "start",
        "needs_human_review": False,
        "error": ""
    }
    
    print("Starting workflow...")
    print("-" * 60)
    
    # Run the graph
    final_state = app.invoke(initial_state)
    
    print("-" * 60)
    print("\n✅ Workflow Complete!\n")
    
    # Display results
    print(final_state.get("formatted_response", "No output generated"))
    
    return final_state


# ============================================================================
# 6. Advanced: Streaming Example
# ============================================================================

def run_streaming_example():
    """
    Example with streaming (real-time updates)
    """
    print("\n" + "=" * 60)
    print("Streaming Example - Real-time Updates")
    print("=" * 60)
    print()
    
    app = create_medical_report_graph()
    
    initial_state = {
        "report_text": "Cardiac symptoms observed. Recommend ECG.",
        "report_type": "",
        "extracted_keywords": [],
        "knowledge_base_results": {},
        "analysis": "",
        "recommendations": [],
        "formatted_response": "",
        "current_step": "start",
        "needs_human_review": False,
        "error": ""
    }
    
    # Stream updates as they happen
    for step in app.stream(initial_state):
        node_name = list(step.keys())[0]
        state_update = step[node_name]
        print(f"📊 Step: {node_name} → {state_update.get('current_step', 'processing')}")


# ============================================================================
# 7. Main Execution
# ============================================================================

if __name__ == "__main__":
    # Run basic example
    result = run_example()
    
    # Run streaming example
    run_streaming_example()
    
    print("\n" + "=" * 60)
    print("Example Complete!")
    print("=" * 60)
    print("\nNext Steps:")
    print("1. Install LangGraph: pip install langgraph")
    print("2. Connect to Azure OpenAI")
    print("3. Integrate with Azure Document Intelligence")
    print("4. Add Azure Cognitive Search")
    print("5. Deploy as part of your medical report analyzer!")


# ============================================================================
# Installation Requirements
# ============================================================================
"""
To run this example, install:

pip install langgraph langchain langchain-openai

For Azure integration:
pip install azure-ai-documentintelligence azure-search-documents azure-openai

Note: This is a simplified example. In production:
- Add error handling
- Implement actual LLM calls
- Add retry logic
- Include checkpoints for state persistence
- Add logging and monitoring
"""

