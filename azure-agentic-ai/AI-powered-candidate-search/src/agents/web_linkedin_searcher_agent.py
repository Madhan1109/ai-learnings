"""
Web/LinkedIn Searcher Agent - Searches web and LinkedIn for candidate profiles
"""

from crewai import Agent
from src.tools import WebSearchTool, LinkedInSearchTool
from src.config import settings, yaml_config
from src.utils.litellm_client import get_litellm_llm


def create_web_linkedin_searcher_agent() -> Agent:
    """Create the web/LinkedIn searcher agent"""
    
    agent_config = yaml_config.get("agents", {}).get("web_linkedin_searcher", {})
    
    # Get LLM with LitELLM
    llm = get_litellm_llm()
    
    agent = Agent(
        role=agent_config.get("role", "Web/LinkedIn Search Specialist"),
        goal=agent_config.get("goal", "Find professional profiles matching job requirements"),
        backstory=agent_config.get(
            "backstory",
            "You are a recruitment expert who searches across web platforms and LinkedIn "
            "to find qualified candidates. You understand how to match job requirements "
            "with professional profiles and identify the best candidates."
        ),
        tools=[WebSearchTool(), LinkedInSearchTool()],
        llm=llm,
        verbose=agent_config.get("verbose", True),
        max_iter=agent_config.get("max_iter", 5),
        allow_delegation=False
    )
    
    return agent


# Alias for backward compatibility
WebLinkedInSearcherAgent = create_web_linkedin_searcher_agent
