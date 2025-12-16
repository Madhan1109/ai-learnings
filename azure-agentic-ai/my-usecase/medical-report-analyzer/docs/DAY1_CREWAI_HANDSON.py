"""
Day 1 - CrewAI Hands-On: 3-Agent Workflow
Mini Activity: Research → Summarize → Format

This example demonstrates:
- Creating specialized agents
- Defining tasks for each agent
- Building a crew workflow
- Running the complete pipeline
"""

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool
import os


# ============================================================================
# SETUP: Configure API Keys (Required for real execution)
# ============================================================================

# Option 1: Set environment variables
# os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
# os.environ["SERPER_API_KEY"] = "your-serper-api-key"  # For web search

# Option 2: Use Azure OpenAI (if you have it configured)
# os.environ["AZURE_OPENAI_API_KEY"] = "your-azure-key"
# os.environ["AZURE_OPENAI_ENDPOINT"] = "your-endpoint"

# For this demo, we'll use a mock mode that doesn't require API keys
# Set MOCK_MODE=True to run without API calls
MOCK_MODE = True  # Set to False when you have API keys


# ============================================================================
# AGENT 1: RESEARCHER
# ============================================================================

researcher = Agent(
    role='Research Specialist',
    goal='Conduct thorough research on the given topic and gather comprehensive information from multiple sources',
    backstory="""You are an expert researcher with years of experience in 
    information gathering and fact-checking. You excel at finding reliable 
    sources, extracting key information, and organizing findings in a clear, 
    structured manner. You have a keen eye for detail and always verify 
    information from multiple sources before presenting your findings.""",
    
    # Tools for research (web search, website scraping, etc.)
    tools=[
        # SerperDevTool() if you have SERPER_API_KEY
        # WebsiteSearchTool() for searching specific websites
    ] if not MOCK_MODE else [],
    
    verbose=True,  # Show agent's thinking process
    allow_delegation=False,  # This agent works independently
)


# ============================================================================
# AGENT 2: SUMMARIZER
# ============================================================================

summarizer = Agent(
    role='Content Summarizer',
    goal='Analyze research findings and create concise, well-structured summaries',
    backstory="""You are a skilled content analyst with expertise in 
    distilling complex information into clear, digestible summaries. You 
    understand how to identify key points, eliminate redundancy, and 
    maintain accuracy while making content more accessible. Your summaries 
    are always balanced, objective, and focused on the most important 
    information.""",
    
    verbose=True,
    allow_delegation=False,
)


# ============================================================================
# AGENT 3: FORMATTER
# ============================================================================

formatter = Agent(
    role='Report Formatter',
    goal='Transform summarized content into a professionally formatted, structured report',
    backstory="""You are a professional technical writer and document 
    formatter with expertise in creating clear, well-organized reports. 
    You excel at structuring information logically, using appropriate 
    formatting, headings, and visual hierarchy. Your reports are always 
    professional, easy to read, and ready for presentation to stakeholders.""",
    
    verbose=True,
    allow_delegation=False,
)


# ============================================================================
# TASK 1: RESEARCH TASK
# ============================================================================

research_task = Task(
    description="""Research the following topic thoroughly:
    {topic}
    
    Your research should include:
    1. Key concepts and definitions
    2. Current trends and developments
    3. Important statistics or data points
    4. Expert opinions or notable perspectives
    5. Relevant examples or case studies
    
    Provide comprehensive findings with sources and citations where possible.
    Organize your research in a clear, structured format.""",
    
    agent=researcher,  # Assigned to researcher agent
    
    expected_output="""A comprehensive research document containing:
    - Overview of the topic
    - Key findings (at least 5-7 main points)
    - Supporting data and statistics
    - Sources and references
    - Organized in clear sections"""
)


# ============================================================================
# TASK 2: SUMMARIZE TASK
# ============================================================================

summarize_task = Task(
    description="""Review the research findings provided by the researcher 
    and create a concise summary that:
    
    1. Captures the most important points
    2. Eliminates redundancy
    3. Maintains accuracy and objectivity
    4. Highlights key insights
    5. Preserves critical data and statistics
    
    Focus on clarity and brevity while ensuring all essential information 
    is retained.""",
    
    agent=summarizer,  # Assigned to summarizer agent
    
    expected_output="""A well-structured summary containing:
    - Executive summary (2-3 sentences)
    - Key points (5-7 bullet points)
    - Important statistics or data
    - Main conclusions
    - Clear and concise language"""
)


# ============================================================================
# TASK 3: FORMAT TASK
# ============================================================================

format_task = Task(
    description="""Take the summarized content and format it into a 
    professional, structured report with:
    
    1. Clear title and header
    2. Executive summary section
    3. Main content sections with proper headings
    4. Bullet points and lists where appropriate
    5. Professional formatting and structure
    6. Conclusion section
    
    Ensure the report is ready for presentation and easy to read.""",
    
    agent=formatter,  # Assigned to formatter agent
    
    expected_output="""A professionally formatted report with:
    - Title page/header
    - Executive summary
    - Main sections with clear headings
    - Well-formatted bullet points
    - Conclusion
    - Professional appearance ready for sharing"""
)


# ============================================================================
# CREW: Assemble the Team
# ============================================================================

crew = Crew(
    agents=[researcher, summarizer, formatter],
    tasks=[research_task, summarize_task, format_task],
    process=Process.sequential,  # Tasks run one after another
    verbose=True,  # Show detailed execution logs
    # process=Process.hierarchical,  # Alternative: Manager delegates to workers
    # manager_llm=...,  # Required for hierarchical process
)


# ============================================================================
# MOCK MODE: Simulate without API calls
# ============================================================================

def mock_research(topic: str) -> str:
    """Simulate research findings"""
    return f"""
    RESEARCH FINDINGS ON: {topic}
    
    Overview:
    {topic} is a significant area of study with multiple dimensions and applications.
    
    Key Findings:
    1. Foundational Concept: The topic has deep roots in established theory
    2. Current Trends: Recent developments show increasing adoption
    3. Statistics: Studies indicate 75% effectiveness in relevant applications
    4. Expert Opinion: Leading experts emphasize the importance of practical implementation
    5. Case Study: Real-world example demonstrates successful application
    6. Future Outlook: Continued growth expected in the next 5 years
    7. Challenges: Some limitations exist but are being addressed
    
    Sources:
    - Academic Research Papers (2023-2024)
    - Industry Reports
    - Expert Interviews
    """


def mock_summarize(research: str) -> str:
    """Simulate summarization"""
    return f"""
    SUMMARY OF RESEARCH:
    
    Executive Summary:
    The research reveals {topic} as a critical area with strong potential and growing adoption.
    
    Key Points:
    • Foundational concepts are well-established
    • Current trends show 75% effectiveness
    • Expert consensus supports practical implementation
    • Real-world case studies demonstrate success
    • Future growth expected over next 5 years
    
    Main Conclusions:
    The topic represents a significant opportunity with proven effectiveness and strong future prospects.
    """


def mock_format(summary: str) -> str:
    """Simulate formatting"""
    return f"""
    ╔══════════════════════════════════════════════════════════╗
    ║              RESEARCH REPORT                              ║
    ║              Topic: {topic}                               ║
    ╚══════════════════════════════════════════════════════════╝
    
    EXECUTIVE SUMMARY
    ═══════════════════════════════════════════════════════════
    The research reveals {topic} as a critical area with strong 
    potential and growing adoption. Key findings indicate 75% 
    effectiveness with strong expert support.
    
    KEY FINDINGS
    ═══════════════════════════════════════════════════════════
    1. Foundational concepts are well-established
    2. Current trends show 75% effectiveness
    3. Expert consensus supports practical implementation
    4. Real-world case studies demonstrate success
    5. Future growth expected over next 5 years
    
    CONCLUSION
    ═══════════════════════════════════════════════════════════
    The topic represents a significant opportunity with proven 
    effectiveness and strong future prospects. Recommended for 
    further exploration and implementation.
    
    Report Generated: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    """


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def run_crew_workflow(topic: str, mock_mode: bool = MOCK_MODE):
    """
    Run the complete 3-agent workflow
    
    Args:
        topic: The research topic
        mock_mode: If True, simulate without API calls
    """
    print("=" * 70)
    print("CREWAI 3-AGENT WORKFLOW: Research → Summarize → Format")
    print("=" * 70)
    print(f"\n📋 Topic: {topic}\n")
    print("-" * 70)
    
    if mock_mode:
        print("🔧 Running in MOCK MODE (no API calls required)\n")
        print("=" * 70)
        print("AGENT 1: RESEARCHER")
        print("=" * 70)
        research_result = mock_research(topic)
        print(research_result)
        
        print("\n" + "=" * 70)
        print("AGENT 2: SUMMARIZER")
        print("=" * 70)
        summary_result = mock_summarize(research_result)
        print(summary_result)
        
        print("\n" + "=" * 70)
        print("AGENT 3: FORMATTER")
        print("=" * 70)
        final_result = mock_format(summary_result)
        print(final_result)
        
        print("\n" + "=" * 70)
        print("✅ WORKFLOW COMPLETE (Mock Mode)")
        print("=" * 70)
        
        return final_result
    else:
        print("🚀 Running with REAL API calls\n")
        print("-" * 70)
        
        # Execute the crew workflow
        result = crew.kickoff(inputs={"topic": topic})
        
        print("\n" + "=" * 70)
        print("✅ WORKFLOW COMPLETE")
        print("=" * 70)
        print("\n📄 FINAL REPORT:")
        print("-" * 70)
        print(result)
        
        return result


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Example topics to research
    topics = [
        "Artificial Intelligence in Healthcare",
        "LangGraph Framework for Agent Workflows",
        "Azure OpenAI Service Capabilities",
        "Medical Report Analysis Automation"
    ]
    
    # Run with first topic
    topic = topics[0]  # Change this to try different topics
    
    print("\n" + "🎯 " * 20)
    print("CREWAI HANDS-ON EXERCISE")
    print("3-Agent Workflow: Research → Summarize → Format")
    print("🎯 " * 20 + "\n")
    
    result = run_crew_workflow(topic, mock_mode=MOCK_MODE)
    
    print("\n" + "=" * 70)
    print("📚 NEXT STEPS:")
    print("=" * 70)
    print("1. Install CrewAI: pip install crewai crewai-tools")
    print("2. Get API keys:")
    print("   - OpenAI: https://platform.openai.com/api-keys")
    print("   - Serper (optional): https://serper.dev/api-key")
    print("3. Set MOCK_MODE = False")
    print("4. Set your API keys in environment variables")
    print("5. Run again to see real agent collaboration!")
    print("=" * 70)


# ============================================================================
# ALTERNATIVE: Using with Medical Report Analyzer Context
# ============================================================================

def create_medical_research_crew():
    """
    Example: Custom crew for medical report analysis context
    """
    medical_researcher = Agent(
        role='Medical Research Specialist',
        goal='Research medical conditions, treatments, and best practices',
        backstory='Expert in medical literature and evidence-based medicine',
        verbose=True
    )
    
    medical_summarizer = Agent(
        role='Medical Content Analyst',
        goal='Summarize medical information for healthcare providers',
        backstory='Skilled at translating complex medical data into actionable insights',
        verbose=True
    )
    
    medical_formatter = Agent(
        role='Medical Report Writer',
        goal='Format medical information into professional reports',
        backstory='Expert in medical documentation and report formatting',
        verbose=True
    )
    
    research_task = Task(
        description="Research treatment options for: {condition}",
        agent=medical_researcher,
        expected_output="Comprehensive research on treatment options"
    )
    
    summarize_task = Task(
        description="Summarize the research findings",
        agent=medical_summarizer,
        expected_output="Concise summary of treatment options"
    )
    
    format_task = Task(
        description="Format into a medical report",
        agent=medical_formatter,
        expected_output="Professional medical report"
    )
    
    return Crew(
        agents=[medical_researcher, medical_summarizer, medical_formatter],
        tasks=[research_task, summarize_task, format_task],
        verbose=True
    )


# ============================================================================
# INSTALLATION INSTRUCTIONS
# ============================================================================
"""
INSTALLATION:
-------------
pip install crewai crewai-tools

OPTIONAL (for web search):
pip install serper  # For SerperDevTool

ENVIRONMENT VARIABLES:
---------------------
export OPENAI_API_KEY="your-key-here"
export SERPER_API_KEY="your-key-here"  # Optional

Or create a .env file:
OPENAI_API_KEY=your-key-here
SERPER_API_KEY=your-key-here

USAGE:
------
1. Set MOCK_MODE = False
2. Configure API keys
3. Run: python DAY1_CREWAI_HANDSON.py
4. Or use in your code:
   result = run_crew_workflow("Your topic here", mock_mode=False)
"""

