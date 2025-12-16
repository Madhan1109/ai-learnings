"""
Profile Analyzer Tool for analyzing and summarizing candidate profiles
"""

# Windows compatibility fix - MUST be first
from src.utils.windows_fix import *

from typing import Dict, List, Any
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import json


class ProfileAnalyzerInput(BaseModel):
    """Input schema for profile analyzer"""
    profiles: List[Dict[str, Any]] = Field(..., description="List of candidate profiles to analyze")
    job_requirements: Dict[str, Any] = Field(..., description="Job requirements and criteria")


class ProfileAnalyzerTool(BaseTool):
    """
    Tool for analyzing candidate profiles and extracting key highlights
    """
    name: str = "Profile Analyzer"
    description: str = (
        "Analyzes candidate profiles and extracts key highlights, strengths, "
        "and match scores based on job requirements."
    )
    args_schema: type[BaseModel] = ProfileAnalyzerInput

    def _run(
        self,
        profiles: List[Dict[str, Any]],
        job_requirements: Dict[str, Any]
    ) -> str:
        """Analyze profiles and generate summaries"""
        try:
            analyzed_profiles = []
            
            for profile in profiles:
                analysis = self._analyze_profile(profile, job_requirements)
                analyzed_profiles.append(analysis)
            
            # Sort by match score
            analyzed_profiles.sort(key=lambda x: x.get("match_score", 0), reverse=True)
            
            return json.dumps({
                "total_profiles": len(analyzed_profiles),
                "analyzed_profiles": analyzed_profiles
            }, indent=2)
            
        except Exception as e:
            return json.dumps({
                "error": f"Profile analysis failed: {str(e)}",
                "analyzed_profiles": []
            })

    def _analyze_profile(
        self,
        profile: Dict[str, Any],
        job_requirements: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze a single profile against job requirements"""
        required_skills = job_requirements.get("skills", [])
        required_technologies = job_requirements.get("technologies", [])
        required_experience = job_requirements.get("years_of_experience", "")
        
        # Calculate match score
        match_score = 0
        matched_skills = []
        matched_technologies = []
        
        # Check skill matches
        profile_skills = profile.get("skills", []) + profile.get("top_languages", [])
        profile_skills_lower = [s.lower() for s in profile_skills]
        
        for skill in required_skills:
            if any(skill.lower() in ps for ps in profile_skills_lower):
                matched_skills.append(skill)
                match_score += 10
        
        for tech in required_technologies:
            if any(tech.lower() in ps for ps in profile_skills_lower):
                matched_technologies.append(tech)
                match_score += 15
        
        # Extract key highlights
        highlights = self._extract_highlights(profile)
        
        # Generate summary
        summary = self._generate_summary(profile, matched_skills, matched_technologies, highlights)
        
        return {
            "profile": profile,
            "match_score": min(match_score, 100),  # Cap at 100
            "matched_skills": matched_skills,
            "matched_technologies": matched_technologies,
            "highlights": highlights,
            "summary": summary,
            "recommendation": "Strong Match" if match_score >= 50 else "Moderate Match" if match_score >= 30 else "Weak Match"
        }

    def _extract_highlights(self, profile: Dict[str, Any]) -> List[str]:
        """Extract key highlights from profile"""
        highlights = []
        
        # GitHub highlights
        if "total_stars" in profile and profile["total_stars"] > 100:
            highlights.append(f"High GitHub activity with {profile['total_stars']} stars")
        
        if "public_repos" in profile and profile["public_repos"] > 20:
            highlights.append(f"Active contributor with {profile['public_repos']} public repositories")
        
        # Experience highlights
        if "experience" in profile:
            exp_count = len(profile["experience"])
            if exp_count > 0:
                highlights.append(f"{exp_count} professional experience entries")
        
        # Skills highlights
        if "skills" in profile and len(profile["skills"]) > 5:
            highlights.append(f"Extensive skill set with {len(profile['skills'])} skills")
        
        # Location match
        if "location" in profile and profile["location"]:
            highlights.append(f"Located in {profile['location']}")
        
        return highlights

    def _generate_summary(
        self,
        profile: Dict[str, Any],
        matched_skills: List[str],
        matched_technologies: List[str],
        highlights: List[str]
    ) -> str:
        """Generate a concise summary of the profile"""
        name = profile.get("name") or profile.get("username", "Candidate")
        
        summary_parts = [f"{name} is a"]
        
        # Add role/headline
        if "headline" in profile:
            summary_parts.append(profile["headline"].lower())
        elif "bio" in profile and profile["bio"]:
            summary_parts.append("professional developer")
        else:
            summary_parts.append("skilled professional")
        
        # Add matched technologies
        if matched_technologies:
            summary_parts.append(f"with expertise in {', '.join(matched_technologies[:3])}")
        
        # Add highlights
        if highlights:
            summary_parts.append(f". Key highlights: {'; '.join(highlights[:3])}")
        
        return " ".join(summary_parts) + "."

