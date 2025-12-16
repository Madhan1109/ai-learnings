"""
LinkedIn Search Tool for finding candidate profiles
"""

# Windows compatibility fix - MUST be first
from src.utils.windows_fix import *

from typing import Dict, List, Any, Optional
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import json
from src.config import settings


class LinkedInSearchInput(BaseModel):
    """Input schema for LinkedIn search"""
    keywords: List[str] = Field(..., description="List of keywords to search for")
    skills: List[str] = Field(default=[], description="List of required skills")
    location: Optional[str] = Field(None, description="Preferred location")
    experience_years: Optional[int] = Field(None, description="Minimum years of experience")
    max_results: int = Field(default=10, description="Maximum number of results")


class LinkedInSearchTool(BaseTool):
    """
    Tool for searching LinkedIn profiles
    Note: LinkedIn API access is restricted. This tool provides a framework
    that can be integrated with LinkedIn's official API or third-party services.
    """
    name: str = "LinkedIn Profile Search"
    description: str = (
        "Searches LinkedIn for professional candidate profiles matching job requirements. "
        "Returns profiles with experience, skills, and qualifications."
    )
    args_schema: type[BaseModel] = LinkedInSearchInput

    def _run(
        self,
        keywords: List[str],
        skills: List[str] = None,
        location: str = None,
        experience_years: int = None,
        max_results: int = 10
    ) -> str:
        """Search LinkedIn for candidate profiles"""
        try:
            if skills is None:
                skills = []
            
            # Build search query
            query = self._build_query(keywords, skills, location, experience_years)
            
            # Search LinkedIn (using API or simulation)
            if settings.linkedin_api_key:
                results = self._search_linkedin_api(query, max_results)
            else:
                # Simulated search for demonstration
                results = self._simulate_linkedin_search(keywords, skills, location, max_results)
            
            return json.dumps({
                "query": query,
                "total_results": len(results),
                "profiles": results
            }, indent=2)
            
        except Exception as e:
            return json.dumps({
                "error": f"LinkedIn search failed: {str(e)}",
                "profiles": []
            })

    def _build_query(
        self,
        keywords: List[str],
        skills: List[str],
        location: str = None,
        experience_years: int = None
    ) -> str:
        """Build LinkedIn search query"""
        query_parts = []
        
        if keywords:
            query_parts.extend(keywords)
        
        if skills:
            query_parts.extend(skills[:3])  # Top 3 skills
        
        if location:
            query_parts.append(f"location:{location}")
        
        if experience_years:
            query_parts.append(f"experience:{experience_years}+ years")
        
        return " ".join(query_parts)

    def _search_linkedin_api(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Search using LinkedIn API"""
        # This is a placeholder for LinkedIn API integration
        # LinkedIn requires official API access which has strict requirements
        # For production, integrate with LinkedIn's official API or approved partners
        
        try:
            # Example structure for LinkedIn API integration
            # headers = {
            #     "Authorization": f"Bearer {settings.linkedin_api_key}",
            #     "Content-Type": "application/json"
            # }
            # response = requests.get(
            #     "https://api.linkedin.com/v2/people-search",
            #     headers=headers,
            #     params={"q": query, "count": max_results}
            # )
            
            return []
            
        except Exception as e:
            return []

    def _simulate_linkedin_search(
        self,
        keywords: List[str],
        skills: List[str],
        location: str = None,
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        """Simulate LinkedIn search for demonstration"""
        # This is a placeholder that simulates LinkedIn profile results
        # In production, replace with actual LinkedIn API calls
        
        profiles = []
        for i in range(min(max_results, 5)):
            profile = {
                "name": f"Professional Candidate {i+1}",
                "headline": f"Expert in {', '.join(skills[:2]) if skills else 'Technology'}",
                "location": location or "Global",
                "experience": [
                    {
                        "title": "Senior Developer",
                        "company": "Tech Company",
                        "duration": "3+ years",
                        "description": f"Working with {', '.join(skills[:2]) if skills else 'various technologies'}"
                    }
                ],
                "skills": skills[:5] if skills else ["Python", "Cloud", "Architecture"],
                "education": [
                    {
                        "degree": "Bachelor's in Computer Science",
                        "school": "University"
                    }
                ],
                "profile_url": f"https://linkedin.com/in/candidate-{i+1}",
                "matched_keywords": keywords[:3],
                "matched_skills": skills[:3] if skills else [],
                "source": "linkedin"
            }
            profiles.append(profile)
        
        return profiles

