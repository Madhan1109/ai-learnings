"""
Flowise API Client for candidate search workflow
"""

import requests
import json
from typing import Dict, Any, Optional
from pathlib import Path
from loguru import logger
from src.config import settings


class FlowiseClient:
    """Client for interacting with Flowise API"""
    
    def __init__(self, flowise_host: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize Flowise client
        
        Args:
            flowise_host: Flowise server URL (defaults to settings)
            api_key: Flowise API key (optional)
        """
        self.host = flowise_host or settings.flowise_host
        self.api_key = api_key or settings.flowise_api_key
        self.base_url = f"{self.host}/api/v1"
        
        # Headers
        self.headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    def run_chatflow(
        self,
        chatflow_id: str,
        inputs: Dict[str, Any],
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Run a Flowise chatflow
        
        Args:
            chatflow_id: ID of the chatflow to run
            inputs: Input data for the chatflow
            session_id: Optional session ID for conversation memory
            
        Returns:
            Response from Flowise
        """
        url = f"{self.base_url}/prediction/{chatflow_id}"
        
        payload = {
            "question": json.dumps(inputs),
            "inputs": inputs,
            "overrideConfig": {}
        }
        
        if session_id:
            payload["sessionId"] = session_id
        
        try:
            response = requests.post(
                url,
                json=payload,
                headers=self.headers,
                timeout=settings.search_timeout
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Flowise API error: {str(e)}")
            raise
    
    def search_candidates(self, job_description_path: str) -> Dict[str, Any]:
        """
        Execute candidate search workflow
        
        Args:
            job_description_path: Path to job description file
            
        Returns:
            Search results
        """
        # Read job description file
        file_path = Path(job_description_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Job description not found: {job_description_path}")
        
        # Prepare inputs for Flowise
        inputs = {
            "job_description_path": str(file_path.absolute()),
            "max_candidates": settings.max_candidates
        }
        
        # Get chatflow ID from config or use default
        chatflow_id = yaml_config.get("flowise", {}).get("chatflow_id", "candidate-search")
        
        # Run the chatflow
        logger.info(f"Running Flowise chatflow: {chatflow_id}")
        result = self.run_chatflow(chatflow_id, inputs)
        
        return result
    
    def get_chatflow_list(self) -> list:
        """Get list of available chatflows"""
        url = f"{self.base_url}/chatflows"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching chatflows: {str(e)}")
            return []
    
    def health_check(self) -> bool:
        """Check if Flowise server is running"""
        try:
            response = requests.get(f"{self.host}/api/v1/ping", timeout=5)
            return response.status_code == 200
        except Exception:
            return False


# Import yaml_config
from src.config import yaml_config

