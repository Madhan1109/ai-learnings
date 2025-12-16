"""
Web Search Tool for finding candidate profiles across the web
"""

# Windows compatibility fix - MUST be first
from src.utils.windows_fix import *

from typing import Dict, List, Any, Optional
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import requests
import json
from src.config import settings


class WebSearchInput(BaseModel):
    """Input schema for web search"""
    query: str = Field(..., description="Search query string")
    skills: List[str] = Field(default=[], description="List of required skills")
    location: Optional[str] = Field(None, description="Preferred location")
    max_results: int = Field(default=10, description="Maximum number of results")


class WebSearchTool(BaseTool):
    """
    Tool for searching the web for candidate profiles
    Uses SerpAPI or Google Custom Search API
    """
    name: str = "Web Profile Search"
    description: str = (
        "Searches the web for professional candidate profiles matching job requirements. "
        "Returns profiles from various professional platforms."
    )
    args_schema: type[BaseModel] = WebSearchInput

    def _run(
        self,
        query: str,
        skills: List[str] = None,
        location: str = None,
        max_results: int = 10
    ) -> str:
        """Search web for candidate profiles"""
        try:
            if skills is None:
                skills = []
            
            # Build enhanced query
            enhanced_query = self._build_query(query, skills, location)
            
            # Try SerpAPI first, fallback to Google Custom Search
            results = None
            
            if settings.serpapi_key:
                results = self._search_serpapi(enhanced_query, max_results)
            elif settings.google_api_key and settings.google_cse_id:
                results = self._search_google_cse(enhanced_query, max_results)
            else:
                # Fallback to basic web search simulation
                results = self._simulate_web_search(enhanced_query, max_results)
            
            return json.dumps({
                "query": enhanced_query,
                "total_results": len(results) if results else 0,
                "profiles": results or []
            }, indent=2)
            
        except Exception as e:
            return json.dumps({
                "error": f"Web search failed: {str(e)}",
                "profiles": []
            })

    def _build_query(self, base_query: str, skills: List[str], location: str = None) -> str:
        """Build enhanced search query"""
        query_parts = [base_query]
        
        if skills:
            query_parts.append(" ".join(skills[:3]))  # Add top 3 skills
        
        if location:
            query_parts.append(location)
        
        query_parts.append("profile OR portfolio OR resume")
        
        return " ".join(query_parts)

    def _search_serpapi(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Search using SerpAPI"""
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": query,
                "api_key": settings.serpapi_key,
                "engine": "google",
                "num": max_results
            }
            
            response = requests.get(url, params=params, timeout=settings.search_timeout)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            for item in data.get("organic_results", [])[:max_results]:
                results.append({
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "source": "web_search"
                })
            
            return results
            
        except Exception as e:
            return []

    def _search_google_cse(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Search using Google Custom Search API"""
        try:
            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "key": settings.google_api_key,
                "cx": settings.google_cse_id,
                "q": query,
                "num": min(max_results, 10)
            }
            
            response = requests.get(url, params=params, timeout=settings.search_timeout)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            for item in data.get("items", [])[:max_results]:
                results.append({
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "source": "google_cse"
                })
            
            return results
            
        except Exception as e:
            return []

    def _simulate_web_search(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Simulate web search when APIs are not available"""
        # This is a placeholder for demonstration
        # In production, you would use actual search APIs
        return [
            {
                "title": f"Professional Profile - {query}",
                "link": f"https://example.com/profile/{i}",
                "snippet": f"Professional with expertise in {query}",
                "source": "simulated"
            }
            for i in range(min(max_results, 5))
        ]

