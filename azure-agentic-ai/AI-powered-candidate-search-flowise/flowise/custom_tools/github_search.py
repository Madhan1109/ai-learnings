"""
GitHub Search Tool for Flowise
Searches GitHub for matching developer profiles
"""

from typing import Dict, Any, List, Optional
from github import Github
import json
import os
from dotenv import load_dotenv

load_dotenv()


class GitHubSearchTool:
    """Tool for searching GitHub profiles"""
    
    def __init__(self):
        self.name = "GitHub Profile Search"
        self.description = "Searches GitHub for developer profiles matching job requirements"
        self.github = None
        
        # Initialize GitHub client
        github_token = os.getenv("GITHUB_TOKEN")
        if github_token:
            self.github = Github(github_token)
    
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Search GitHub for matching profiles
        
        Args:
            inputs: Dictionary with 'keywords', 'skills', 'min_repos', 'language'
            
        Returns:
            Dictionary with search results
        """
        if not self.github:
            return {"error": "GitHub token not configured"}
        
        try:
            keywords = inputs.get("keywords", [])
            skills = inputs.get("skills", [])
            min_repos = inputs.get("min_repos", 5)
            language = inputs.get("language")
            
            # Build search query
            query_parts = []
            if language:
                query_parts.append(f"language:{language}")
            if keywords:
                keyword_query = " OR ".join(keywords)
                query_parts.append(f"({keyword_query})")
            
            query = " ".join(query_parts) if query_parts else "*"
            
            # Search for users
            users = self.github.search_users(query)
            
            results = []
            max_results = int(os.getenv("MAX_CANDIDATES", 10))
            count = 0
            
            for user in users:
                if count >= max_results:
                    break
                
                try:
                    profile_data = self._get_user_profile(user, skills, min_repos)
                    if profile_data:
                        results.append(profile_data)
                        count += 1
                except Exception:
                    continue
            
            return {
                "success": True,
                "data": {
                    "total_results": len(results),
                    "profiles": results
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _get_user_profile(self, user, required_skills: List[str], min_repos: int) -> Optional[Dict[str, Any]]:
        """Get detailed profile information for a user"""
        try:
            repos = list(user.get_repos())
            
            if len(repos) < min_repos:
                return None
            
            # Analyze repositories
            languages = {}
            total_stars = 0
            total_forks = 0
            
            for repo in repos[:20]:
                repo_languages = repo.get_languages()
                for lang, bytes_count in repo_languages.items():
                    languages[lang] = languages.get(lang, 0) + bytes_count
                
                total_stars += repo.stargazers_count
                total_forks += repo.forks_count
            
            # Get top languages
            top_languages = sorted(
                languages.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Check skill matches
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
                "public_repos": user.public_repos,
                "followers": user.followers,
                "top_languages": [lang[0] for lang in top_languages],
                "total_stars": total_stars,
                "total_forks": total_forks,
                "matched_skills": matched_skills,
                "profile_url": user.html_url,
                "avatar_url": user.avatar_url
            }
            
            return profile
            
        except Exception:
            return None


def get_tool():
    """Get tool instance for Flowise"""
    return GitHubSearchTool()

