"""
Day 2 - Letta Hands-On: Memory, Schemas, HITL, Tool Execution

This example demonstrates:
- Memory blocks and schemas
- Long-term storage
- Human-in-the-loop
- Tool execution with validation
- Reasoning steps
"""

from typing import TypedDict, List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import json


# ============================================================================
# SCHEMAS: Define Memory Structures
# ============================================================================

class HumanMemorySchema(TypedDict):
    """Schema for 'human' memory block"""
    name: str
    role: str
    preferences: str
    last_interaction: str
    interaction_count: int


class PersonaMemorySchema(TypedDict):
    """Schema for 'persona' memory block"""
    name: str
    tone: str
    expertise: str
    behavior: str


class ReportCacheSchema(TypedDict):
    """Schema for report cache memory block"""
    reports: List[Dict[str, Any]]
    total_analyzed: int
    last_report_date: Optional[str]


# ============================================================================
# MEMORY BLOCKS: Core Memory Structure
# ============================================================================

class MemoryBlock:
    """Represents a memory block in Letta"""
    
    def __init__(self, name: str, content: Any, schema: Optional[type] = None):
        self.name = name
        self.content = content
        self.schema = schema
        self.last_updated = datetime.now()
        self.access_count = 0
    
    def validate(self, new_content: Any) -> bool:
        """Validate content against schema"""
        if self.schema is None:
            return True
        
        # Simple validation - in real Letta, this is more sophisticated
        if isinstance(new_content, dict) and hasattr(self.schema, '__annotations__'):
            required_fields = set(self.schema.__annotations__.keys())
            provided_fields = set(new_content.keys())
            
            # Check if all required fields are present
            missing = required_fields - provided_fields
            if missing:
                print(f"❌ Validation failed: Missing fields {missing}")
                return False
        
        return True
    
    def append(self, content: str):
        """Append to memory block"""
        if isinstance(self.content, str):
            self.content += "\n" + content
        elif isinstance(self.content, list):
            self.content.append(content)
        self.last_updated = datetime.now()
        self.access_count += 1
    
    def replace(self, old_content: Any, new_content: Any):
        """Replace content in memory block"""
        if not self.validate(new_content):
            raise ValueError("Content validation failed")
        
        if self.content == old_content:
            self.content = new_content
            self.last_updated = datetime.now()
            self.access_count += 1
        else:
            raise ValueError("Old content doesn't match")
    
    def get(self):
        """Get memory block content"""
        self.access_count += 1
        return self.content


# ============================================================================
# LETTA AGENT: Simplified Implementation
# ============================================================================

class LettaAgent:
    """Simplified Letta agent with memory and tools"""
    
    def __init__(self, name: str):
        self.name = name
        self.core_memory: Dict[str, MemoryBlock] = {}
        self.external_memory: List[Dict[str, Any]] = []  # Conversation history
        self.tools: Dict[str, callable] = {}
        self.tools_requiring_approval: set = set()
        self.pending_approvals: List[Dict[str, Any]] = []
        self.reasoning_steps: List[Dict[str, Any]] = []
    
    def create_memory_block(self, name: str, content: Any, schema: Optional[type] = None):
        """Create a new memory block"""
        block = MemoryBlock(name, content, schema)
        self.core_memory[name] = block
        print(f"✅ Created memory block: '{name}'")
        return block
    
    def core_memory_append(self, block_name: str, content: str):
        """Append to a memory block"""
        if block_name not in self.core_memory:
            raise ValueError(f"Memory block '{block_name}' not found")
        
        self.core_memory[block_name].append(content)
        print(f"✅ Appended to memory block '{block_name}'")
    
    def core_memory_replace(self, block_name: str, old_content: Any, new_content: Any):
        """Replace content in a memory block"""
        if block_name not in self.core_memory:
            raise ValueError(f"Memory block '{block_name}' not found")
        
        self.core_memory[block_name].replace(old_content, new_content)
        print(f"✅ Replaced content in memory block '{block_name}'")
    
    def get_memory(self, block_name: str) -> Any:
        """Get memory block content"""
        if block_name not in self.core_memory:
            raise ValueError(f"Memory block '{block_name}' not found")
        
        return self.core_memory[block_name].get()
    
    def conversation_search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search conversation history (external memory)"""
        # Simple keyword search simulation
        results = [
            entry for entry in self.external_memory
            if query.lower() in str(entry).lower()
        ][:limit]
        
        print(f"🔍 Found {len(results)} results for query: '{query}'")
        return results
    
    def store_memory(self, content: Any, metadata: Dict[str, Any] = None):
        """Store in external memory (long-term)"""
        entry = {
            "content": content,
            "metadata": metadata or {},
            "timestamp": datetime.now().isoformat()
        }
        self.external_memory.append(entry)
        print(f"💾 Stored in external memory: {len(self.external_memory)} entries")
    
    def register_tool(self, name: str, func: callable, requires_approval: bool = False):
        """Register a tool"""
        self.tools[name] = func
        if requires_approval:
            self.tools_requiring_approval.add(name)
        print(f"🛠️  Registered tool: '{name}' (approval: {requires_approval})")
    
    def execute_tool(self, tool_name: str, arguments: Dict[str, Any], 
                     auto_approve: bool = False) -> Any:
        """Execute a tool with validation and HITL"""
        
        # Step 1: Check if tool exists
        if tool_name not in self.tools:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        # Step 2: Validate arguments (simplified)
        tool = self.tools[tool_name]
        if hasattr(tool, '__annotations__'):
            # Basic type checking would go here
            pass
        
        # Step 3: Check if approval needed
        if tool_name in self.tools_requiring_approval and not auto_approve:
            approval_request = {
                "request_id": f"req_{len(self.pending_approvals) + 1}",
                "tool_name": tool_name,
                "arguments": arguments,
                "timestamp": datetime.now().isoformat()
            }
            self.pending_approvals.append(approval_request)
            
            print(f"\n⏸️  PAUSED: Tool '{tool_name}' requires human approval")
            print(f"   Request ID: {approval_request['request_id']}")
            print(f"   Arguments: {json.dumps(arguments, indent=2)}")
            
            # In real implementation, this would wait for human response
            # For demo, we'll simulate approval
            approval = self._request_approval(approval_request)
            
            if not approval.get("approved", False):
                raise PermissionError(f"Tool '{tool_name}' execution denied")
            
            # Use modified arguments if provided
            if "modified_args" in approval:
                arguments = approval["modified_args"]
        
        # Step 4: Execute tool
        print(f"⚙️  Executing tool: '{tool_name}'")
        result = tool(**arguments)
        
        # Step 5: Record reasoning step
        self.reasoning_steps.append({
            "step_id": f"step_{len(self.reasoning_steps) + 1}",
            "type": "tool_call",
            "tool": tool_name,
            "arguments": arguments,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
        
        return result
    
    def _request_approval(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate human approval request"""
        # In real implementation, this would:
        # 1. Send request to human interface
        # 2. Wait for response
        # 3. Return approval decision
        
        # For demo, auto-approve with simulation
        print(f"   [SIMULATED] Human approves request {request['request_id']}")
        return {"approved": True}
    
    def reason_step(self, action: str, tool: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Perform a reasoning step"""
        result = self.execute_tool(tool, arguments, auto_approve=True)
        
        step = {
            "step_id": f"step_{len(self.reasoning_steps)}",
            "action": action,
            "tool": tool,
            "arguments": arguments,
            "result": result
        }
        
        return step


# ============================================================================
# TOOLS: Define Agent Tools
# ============================================================================

def search_knowledge_base(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search knowledge base for information"""
    # Simulated knowledge base
    knowledge_base = [
        {"id": 1, "content": "Knee injury treatment: RICE method", "score": 0.95},
        {"id": 2, "content": "Physical therapy exercises for knee", "score": 0.88},
        {"id": 3, "content": "Medication for knee pain", "score": 0.82},
    ]
    
    # Simple search simulation
    results = [kb for kb in knowledge_base if query.lower() in kb["content"].lower()][:limit]
    return results


def generate_analysis(report_text: str, knowledge: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate analysis from report and knowledge (requires approval)"""
    analysis = {
        "summary": f"Analysis of report containing: {report_text[:50]}...",
        "findings": ["Finding 1", "Finding 2", "Finding 3"],
        "recommendations": ["Recommendation 1", "Recommendation 2"],
        "confidence": 0.85
    }
    return analysis


def send_email(to: str, subject: str, body: str) -> Dict[str, Any]:
    """Send email (requires approval)"""
    # In real implementation, this would send an email
    return {
        "status": "sent",
        "to": to,
        "subject": subject,
        "sent_at": datetime.now().isoformat()
    }


# ============================================================================
# EXAMPLE: Medical Report Analyzer with Letta
# ============================================================================

def create_medical_analyzer_agent():
    """Create a medical report analyzer agent with Letta"""
    
    # Create agent
    agent = LettaAgent(name="Medical Analyzer")
    
    # Initialize memory blocks with schemas
    agent.create_memory_block(
        "persona",
        {
            "name": "Medical Report Analyzer",
            "tone": "Professional and empathetic",
            "expertise": "Medical report analysis",
            "behavior": "Thorough and accurate"
        },
        schema=PersonaMemorySchema
    )
    
    agent.create_memory_block(
        "human",
        {
            "name": "Dr. Smith",
            "role": "Medical Professional",
            "preferences": "Detailed analysis",
            "last_interaction": datetime.now().isoformat(),
            "interaction_count": 0
        },
        schema=HumanMemorySchema
    )
    
    agent.create_memory_block(
        "report_cache",
        {
            "reports": [],
            "total_analyzed": 0,
            "last_report_date": None
        },
        schema=ReportCacheSchema
    )
    
    # Register tools
    agent.register_tool("search_knowledge_base", search_knowledge_base, requires_approval=False)
    agent.register_tool("generate_analysis", generate_analysis, requires_approval=True)
    agent.register_tool("send_email", send_email, requires_approval=True)
    
    return agent


def analyze_medical_report(agent: LettaAgent, report_text: str):
    """Complete workflow for analyzing a medical report"""
    
    print("\n" + "="*70)
    print("MEDICAL REPORT ANALYSIS WORKFLOW")
    print("="*70)
    
    # Step 1: Update interaction count
    human_memory = agent.get_memory("human")
    human_memory["interaction_count"] += 1
    human_memory["last_interaction"] = datetime.now().isoformat()
    agent.core_memory_replace("human", agent.get_memory("human"), human_memory)
    
    # Step 2: Search knowledge base
    print("\n📚 Step 1: Searching knowledge base...")
    knowledge = agent.execute_tool(
        "search_knowledge_base",
        {"query": "knee injury treatment", "limit": 5}
    )
    print(f"   Found {len(knowledge)} relevant documents")
    
    # Step 3: Generate analysis (requires approval)
    print("\n🔍 Step 2: Generating analysis...")
    analysis = agent.execute_tool(
        "generate_analysis",
        {"report_text": report_text, "knowledge": knowledge},
        auto_approve=False  # This will trigger HITL
    )
    print(f"   Analysis complete: {analysis['summary']}")
    
    # Step 4: Store in memory
    print("\n💾 Step 3: Storing in memory...")
    report_cache = agent.get_memory("report_cache")
    report_cache["reports"].append({
        "report_id": f"RPT_{len(report_cache['reports']) + 1}",
        "analysis": analysis,
        "timestamp": datetime.now().isoformat()
    })
    report_cache["total_analyzed"] += 1
    report_cache["last_report_date"] = datetime.now().isoformat()
    agent.core_memory_replace("report_cache", agent.get_memory("report_cache"), report_cache)
    
    # Step 5: Store in external memory
    agent.store_memory(
        content=analysis,
        metadata={"type": "analysis", "report_id": report_cache["reports"][-1]["report_id"]}
    )
    
    # Step 6: Search past conversations (memory replay)
    print("\n🔍 Step 4: Searching past conversations...")
    past_analyses = agent.conversation_search("knee injury", limit=3)
    if past_analyses:
        print(f"   Found {len(past_analyses)} past analyses")
        agent.core_memory_append(
            "report_cache",
            f"Context: {len(past_analyses)} similar past analyses found"
        )
    
    return analysis


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    print("\n" + "🎯 " * 20)
    print("LETTA HANDS-ON: Memory, Schemas, HITL, Tools")
    print("🎯 " * 20 + "\n")
    
    # Create agent
    agent = create_medical_analyzer_agent()
    
    # Display initial memory
    print("\n" + "="*70)
    print("INITIAL MEMORY STATE")
    print("="*70)
    print(f"Persona: {agent.get_memory('persona')}")
    print(f"Human: {agent.get_memory('human')}")
    print(f"Report Cache: {agent.get_memory('report_cache')}")
    
    # Analyze a report
    report_text = "Patient presents with knee pain and swelling. Limited mobility observed."
    result = analyze_medical_report(agent, report_text)
    
    # Display final state
    print("\n" + "="*70)
    print("FINAL MEMORY STATE")
    print("="*70)
    print(f"Human interactions: {agent.get_memory('human')['interaction_count']}")
    print(f"Total reports analyzed: {agent.get_memory('report_cache')['total_analyzed']}")
    print(f"External memory entries: {len(agent.external_memory)}")
    print(f"Reasoning steps: {len(agent.reasoning_steps)}")
    
    # Display reasoning steps
    print("\n" + "="*70)
    print("REASONING STEPS")
    print("="*70)
    for i, step in enumerate(agent.reasoning_steps, 1):
        print(f"\nStep {i}:")
        print(f"  Tool: {step['tool']}")
        print(f"  Action: {step.get('action', 'N/A')}")
        print(f"  Result: {str(step['result'])[:100]}...")
    
    print("\n" + "="*70)
    print("✅ WORKFLOW COMPLETE")
    print("="*70)
    print("\n📚 Key Concepts Demonstrated:")
    print("  ✅ Memory blocks with schemas")
    print("  ✅ Core memory operations (append, replace)")
    print("  ✅ External memory storage")
    print("  ✅ Memory replay (conversation search)")
    print("  ✅ Human-in-the-loop (tool approval)")
    print("  ✅ Tool execution with validation")
    print("  ✅ Reasoning steps tracking")
    print("="*70 + "\n")


# ============================================================================
# INSTALLATION NOTES
# ============================================================================
"""
This is a simplified implementation for learning purposes.

For real Letta usage:
1. Install Letta: pip install letta
2. Check documentation: https://github.com/letta-ai/letta
3. Use actual Letta SDK for production

This example demonstrates concepts:
- Memory block structure
- Schema validation
- HITL workflow
- Tool execution patterns
"""

