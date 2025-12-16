"""
GitHub Searcher Agent - Searches GitHub for matching developer profiles
"""

from crewai import Agent
from src.tools import GitHubSearchTool
from src.config import settings, yaml_config
from src.utils.litellm_client import get_litellm_llm


def create_github_searcher_agent() -> Agent:
    """Create the GitHub searcher agent"""
    
    agent_config = yaml_config.get("agents", {}).get("github_searcher", {})
    
    # Get LLM with LitELLM
    llm = get_litellm_llm()
    
    agent = Agent(
        role=agent_config.get("role", "GitHub Search Specialist"),
        goal=agent_config.get("goal", "Find GitHub profiles matching job requirements"),
        backstory=agent_config.get(
            "backstory",
            "You are a GitHub expert who can find developers based on their code repositories, "
            "contributions, and technical skills. You understand how to match job requirements "
            "with developer profiles on GitHub."
        ),
        tools=[GitHubSearchTool()],
        llm=llm,
        verbose=agent_config.get("verbose", True),
        max_iter=agent_config.get("max_iter", 5),
        allow_delegation=False
    )
    
    return agent


# Alias for backward compatibility
GitHubSearcherAgent = create_github_searcher_agent
