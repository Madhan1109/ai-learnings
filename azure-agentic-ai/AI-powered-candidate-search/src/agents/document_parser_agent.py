"""
Document Parser Agent - Extracts information from job descriptions
"""

from crewai import Agent
from langchain_openai import ChatOpenAI
from src.tools import DocumentParserTool
from src.config import settings, yaml_config
from src.utils.guardrails import apply_guardrails
from src.utils.litellm_client import get_litellm_llm


def create_document_parser_agent() -> Agent:
    """Create the document parser agent"""
    
    agent_config = yaml_config.get("agents", {}).get("document_parser", {})
    
    # Get LLM with LitELLM
    llm = get_litellm_llm()
    
    agent = Agent(
        role=agent_config.get("role", "Document Parser"),
        goal=agent_config.get("goal", "Extract key information from job descriptions"),
        backstory=agent_config.get(
            "backstory",
            "You are an expert at analyzing job descriptions and extracting critical information "
            "including skills, experience requirements, and keywords."
        ),
        tools=[DocumentParserTool()],
        llm=llm,
        verbose=agent_config.get("verbose", True),
        max_iter=agent_config.get("max_iter", 3),
        allow_delegation=False
    )
    
    return agent


# Alias for backward compatibility
DocumentParserAgent = create_document_parser_agent
