"""
LitELLM Client for unified LLM access
"""

from langchain_openai import ChatOpenAI
from langchain_community.llms import OpenAI
from src.config import settings
import os


def get_litellm_llm():
    """
    Get LLM instance configured to use LitELLM gateway
    """
    # Configure LitELLM endpoint
    base_url = settings.litellm_host
    
    # Use LitELLM as the base URL for OpenAI client
    llm = ChatOpenAI(
        model=settings.litellm_model,
        temperature=0.3,
        max_tokens=2000,
        openai_api_base=base_url,
        openai_api_key=settings.openai_api_key or "dummy-key",  # LitELLM may not require this
    )
    
    return llm


def get_direct_llm():
    """
    Get direct LLM instance (bypassing LitELLM) for fallback
    """
    if settings.azure_openai_endpoint and settings.azure_openai_api_key:
        # Use Azure OpenAI
        llm = ChatOpenAI(
            model=settings.azure_openai_deployment_name or "gpt-4-turbo",
            temperature=0.3,
            max_tokens=2000,
            openai_api_base=settings.azure_openai_endpoint,
            openai_api_key=settings.azure_openai_api_key,
            api_version="2024-02-15-preview"
        )
    else:
        # Use OpenAI directly
        llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.3,
            max_tokens=2000,
            openai_api_key=settings.openai_api_key
        )
    
    return llm

