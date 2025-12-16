"""
Profile Summarizer Agent - Summarizes candidate profiles with key highlights
"""

from crewai import Agent
from src.tools import ProfileAnalyzerTool
from src.config import settings, yaml_config
from src.utils.litellm_client import get_litellm_llm


def create_profile_summarizer_agent() -> Agent:
    """Create the profile summarizer agent"""
    
    agent_config = yaml_config.get("agents", {}).get("profile_summarizer", {})
    
    # Get LLM with LitELLM
    llm = get_litellm_llm()
    
    agent = Agent(
        role=agent_config.get("role", "Profile Summarizer"),
        goal=agent_config.get("goal", "Create concise summaries highlighting candidate strengths"),
        backstory=agent_config.get(
            "backstory",
            "You are an expert at analyzing candidate profiles and creating compelling summaries. "
            "You can identify key strengths, match scores, and highlight why a candidate "
            "would be a good fit for a position."
        ),
        tools=[ProfileAnalyzerTool()],
        llm=llm,
        verbose=agent_config.get("verbose", True),
        max_iter=agent_config.get("max_iter", 3),
        allow_delegation=False
    )
    
    return agent


# Alias for backward compatibility
ProfileSummarizerAgent = create_profile_summarizer_agent
