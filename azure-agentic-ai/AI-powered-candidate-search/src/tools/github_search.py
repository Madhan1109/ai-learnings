"""
GitHub Search Tool using GitHub MCP for finding matching developer profiles
"""

# Windows compatibility fix - MUST be first
from src.utils.windows_fix import *

from typing import Dict, List, Any, Optional
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import requests
from github import Github
import json
import os
from src.config import settings


class GitHubSearchInput(BaseModel):
    """Input schema for GitHub search"""
    keywords: List[str] = Field(..., description="List of keywords to search for")
    skills: List[str] = Field(default=[], description="List of required skills")
    min_repos: int = Field(default=5, description="Minimum number of repositories")
    language: Optional[str] = Field(None, description="Preferred programming language")


class GitHubSearchTool(BaseTool):
    """
    Tool for searching GitHub profiles based on job requirements
    Uses GitHub API to find developers matching the criteria
    """
    name: str = "GitHub Profile Search"
    description: str = (
        "Searches GitHub for developer profiles matching job requirements. "
        "Returns profiles with repositories, contributions, and skills."
    )
    args_schema: type[BaseModel] = GitHubSearchInput

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize GitHub client - use object.__setattr__ for Pydantic models
        object.__setattr__(self, '_github', Github(settings.github_token))
    
    @property
    def github(self):
        """Get GitHub client"""
        return self._github

    def _run(
        self,
        keywords: List[str],
        skills: List[str] = None,
        min_repos: int = 5,
        language: str = None
    ) -> str:
        """Search GitHub for matching profiles"""
        try:
            if skills is None:
                skills = []
            
            # Build search query
            query_parts = []
            
            # Add language filter if specified
            if language:
                query_parts.append(f"language:{language}")
            
            # Add keyword search
            if keywords:
                keyword_query = " OR ".join(keywords)
                query_parts.append(f"({keyword_query})")
            
            # Combine query parts
            query = " ".join(query_parts) if query_parts else "*"
            
            # Search for users
            users = self.github.search_users(query)
            
            results = []
            count = 0
            max_results = min(settings.max_candidates, 5)  # Limit to 5 for faster execution
            
            # Limit total users to check
            user_list = list(users[:max_results * 2])  # Check 2x to account for filtering
            
            for i, user in enumerate(user_list, 1):
                if count >= max_results:
                    break
                
                try:
                    # Quick check: skip if user has too few repos
                    if user.public_repos < min_repos:
                        continue
                    
                    profile_data = self._get_user_profile(user, skills, min_repos)
                    if profile_data:
                        results.append(profile_data)
                        count += 1
                        print(f"  Found profile {count}/{max_results}: {user.login}", flush=True)
                except Exception as e:
                    continue
            
            return json.dumps({
                "total_results": len(results),
                "profiles": results
            }, indent=2)
            
        except Exception as e:
            return json.dumps({
                "error": f"GitHub search failed: {str(e)}",
                "profiles": []
            })

    def _get_user_profile(
        self,
        user,
        required_skills: List[str],
        min_repos: int
    ) -> Optional[Dict[str, Any]]:
        """Get detailed profile information for a user"""
        try:
            # Get user repositories
            repos = list(user.get_repos())
            
            if len(repos) < min_repos:
                return None
            
            # Analyze repositories
            languages = {}
            total_stars = 0
            total_forks = 0
            
            # Limit to top 10 repos for faster processing
            for repo in repos[:10]:
                try:
                    repo_languages = repo.get_languages()
                    for lang, bytes_count in repo_languages.items():
                        languages[lang] = languages.get(lang, 0) + bytes_count
                    
                    total_stars += repo.stargazers_count
                    total_forks += repo.forks_count
                except Exception:
                    # Skip repos that fail to fetch (rate limits, etc.)
                    continue
            
            # Get top languages
            top_languages = sorted(
                languages.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Check if user has required skills
            user_skills = [lang.lower() for lang in languages.keys()]
            matched_skills = [
                skill for skill in required_skills
                if skill.lower() in user_skills or
                any(skill.lower() in lang.lower() for lang in user_skills)
            ]
            
            profile = {
                "username": user.login,
                "name": user.name or user.login,
                "bio": user.bio or "",
                "location": user.location or "",
                "company": user.company or "",
                "blog": user.blog or "",
                "public_repos": user.public_repos,
                "followers": user.followers,
                "following": user.following,
                "top_languages": [lang[0] for lang in top_languages],
                "total_stars": total_stars,
                "total_forks": total_forks,
                "matched_skills": matched_skills,
                "profile_url": user.html_url,
                "avatar_url": user.avatar_url,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            
            return profile
            
        except Exception as e:
            return None

