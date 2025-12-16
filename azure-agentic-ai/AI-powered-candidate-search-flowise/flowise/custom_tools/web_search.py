"""
Web Search Tool for Flowise
Searches web for candidate profiles
"""

from typing import Dict, Any, List, Optional
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()


class WebSearchTool:
    """Tool for searching the web for candidate profiles"""
    
    def __init__(self):
        self.name = "Web Profile Search"
        self.description = "Searches the web for professional candidate profiles"
        self.serpapi_key = os.getenv("SERPAPI_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.google_cse_id = os.getenv("GOOGLE_CSE_ID")
    
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Search web for candidate profiles
        
        Args:
            inputs: Dictionary with 'query', 'skills', 'location', 'max_results'
            
        Returns:
            Dictionary with search results
        """
        try:
            query = inputs.get("query", "")
            skills = inputs.get("skills", [])
            location = inputs.get("location")
            max_results = inputs.get("max_results", 10)
            
            # Build enhanced query
            enhanced_query = self._build_query(query, skills, location)
            
            # Try different search APIs
            results = None
            
            if self.serpapi_key:
                results = self._search_serpapi(enhanced_query, max_results)
            elif self.google_api_key and self.google_cse_id:
                results = self._search_google_cse(enhanced_query, max_results)
            else:
                results = self._simulate_web_search(enhanced_query, max_results)
            
            return {
                "success": True,
                "data": {
                    "query": enhanced_query,
                    "total_results": len(results) if results else 0,
                    "profiles": results or []
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _build_query(self, base_query: str, skills: List[str], location: str = None) -> str:
        """Build enhanced search query"""
        query_parts = [base_query]
        
        if skills:
            query_parts.append(" ".join(skills[:3]))
        
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
                "api_key": self.serpapi_key,
                "engine": "google",
                "num": max_results
            }
            
            response = requests.get(url, params=params, timeout=30)
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
                "key": self.google_api_key,
                "cx": self.google_cse_id,
                "q": query,
                "num": min(max_results, 10)
            }
            
            response = requests.get(url, params=params, timeout=30)
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
            
        except Exception:
            return []
    
    def _simulate_web_search(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Simulate web search when APIs are not available"""
        return [
            {
                "title": f"Professional Profile - {query}",
                "link": f"https://example.com/profile/{i}",
                "snippet": f"Professional with expertise in {query}",
                "source": "simulated"
            }
            for i in range(min(max_results, 5))
        ]


def get_tool():
    """Get tool instance for Flowise"""
    return WebSearchTool()

