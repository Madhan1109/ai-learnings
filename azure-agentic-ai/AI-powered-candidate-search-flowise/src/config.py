"""
Configuration management for the candidate search system (Flowise version)
"""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field
import yaml


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # LLM Configuration
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    azure_openai_api_key: Optional[str] = Field(None, env="AZURE_OPENAI_API_KEY")
    azure_openai_endpoint: Optional[str] = Field(None, env="AZURE_OPENAI_ENDPOINT")
    azure_openai_deployment_name: Optional[str] = Field(None, env="AZURE_OPENAI_DEPLOYMENT_NAME")
    
    # LitELLM Configuration
    litellm_api_key: Optional[str] = Field(None, env="LITELLM_API_KEY")
    litellm_host: str = Field("http://localhost:4000", env="LITELLM_HOST")
    litellm_model: str = Field("gpt-4-turbo-preview", env="LITELLM_MODEL")
    
    # Flowise Configuration
    flowise_host: str = Field("http://localhost:3000", env="FLOWISE_HOST")
    flowise_api_key: Optional[str] = Field(None, env="FLOWISE_API_KEY")
    
    # GitHub Configuration
    github_token: str = Field(..., env="GITHUB_TOKEN")
    github_username: Optional[str] = Field(None, env="GITHUB_USERNAME")
    
    # LinkedIn Configuration
    linkedin_email: Optional[str] = Field(None, env="LINKEDIN_EMAIL")
    linkedin_password: Optional[str] = Field(None, env="LINKEDIN_PASSWORD")
    linkedin_api_key: Optional[str] = Field(None, env="LINKEDIN_API_KEY")
    
    # Web Search Configuration
    serpapi_key: Optional[str] = Field(None, env="SERPAPI_KEY")
    google_api_key: Optional[str] = Field(None, env="GOOGLE_API_KEY")
    google_cse_id: Optional[str] = Field(None, env="GOOGLE_CSE_ID")
    
    # Guardrails Configuration
    nemo_guardrails_config_path: str = Field("./guardrails/config.yml", env="NEMO_GUARDRAILS_CONFIG_PATH")
    
    # Application Configuration
    log_level: str = Field("INFO", env="LOG_LEVEL")
    max_candidates: int = Field(10, env="MAX_CANDIDATES")
    search_timeout: int = Field(30, env="SEARCH_TIMEOUT")
    
    # Security
    secret_key: str = Field(..., env="SECRET_KEY")
    allowed_origins: str = Field("http://localhost:8000", env="ALLOWED_ORIGINS")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


def load_yaml_config(config_path: str = "config.yaml") -> dict:
    """Load configuration from YAML file"""
    config_file = Path(config_path)
    if not config_file.exists():
        return {}
    
    with open(config_file, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


# Global settings instance
settings = Settings()

# Load YAML config
try:
    yaml_config = load_yaml_config()
except Exception:
    yaml_config = {}

