"""
Profile Analyzer Tool for Flowise
Analyzes and summarizes candidate profiles
"""

from typing import Dict, Any, List
import json


class ProfileAnalyzerTool:
    """Tool for analyzing candidate profiles"""
    
    def __init__(self):
        self.name = "Profile Analyzer"
        self.description = "Analyzes candidate profiles and extracts key highlights"
    
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze profiles and generate summaries
        
        Args:
            inputs: Dictionary with 'profiles' and 'job_requirements'
            
        Returns:
            Dictionary with analyzed profiles
        """
        try:
            profiles = inputs.get("profiles", [])
            job_requirements = inputs.get("job_requirements", {})
            
            if not profiles:
                return {
                    "success": False,
                    "error": "No profiles provided"
                }
            
            analyzed_profiles = []
            
            for profile in profiles:
                analysis = self._analyze_profile(profile, job_requirements)
                analyzed_profiles.append(analysis)
            
            # Sort by match score
            analyzed_profiles.sort(
                key=lambda x: x.get("match_score", 0),
                reverse=True
            )
            
            return {
                "success": True,
                "data": {
                    "total_profiles": len(analyzed_profiles),
                    "analyzed_profiles": analyzed_profiles
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _analyze_profile(
        self,
        profile: Dict[str, Any],
        job_requirements: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze a single profile against job requirements"""
        required_skills = job_requirements.get("skills", [])
        required_technologies = job_requirements.get("technologies", [])
        
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
        
        # Extract highlights
        highlights = self._extract_highlights(profile)
        
        # Generate summary
        summary = self._generate_summary(
            profile,
            matched_skills,
            matched_technologies,
            highlights
        )
        
        return {
            "profile": profile,
            "match_score": min(match_score, 100),
            "matched_skills": matched_skills,
            "matched_technologies": matched_technologies,
            "highlights": highlights,
            "summary": summary,
            "recommendation": (
                "Strong Match" if match_score >= 50
                else "Moderate Match" if match_score >= 30
                else "Weak Match"
            )
        }
    
    def _extract_highlights(self, profile: Dict[str, Any]) -> List[str]:
        """Extract key highlights from profile"""
        highlights = []
        
        if "total_stars" in profile and profile["total_stars"] > 100:
            highlights.append(f"High GitHub activity with {profile['total_stars']} stars")
        
        if "public_repos" in profile and profile["public_repos"] > 20:
            highlights.append(f"Active contributor with {profile['public_repos']} public repositories")
        
        if "experience" in profile:
            exp_count = len(profile["experience"])
            if exp_count > 0:
                highlights.append(f"{exp_count} professional experience entries")
        
        if "skills" in profile and len(profile["skills"]) > 5:
            highlights.append(f"Extensive skill set with {len(profile['skills'])} skills")
        
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
        
        if "headline" in profile:
            summary_parts.append(profile["headline"].lower())
        elif "bio" in profile and profile["bio"]:
            summary_parts.append("professional developer")
        else:
            summary_parts.append("skilled professional")
        
        if matched_technologies:
            summary_parts.append(f"with expertise in {', '.join(matched_technologies[:3])}")
        
        if highlights:
            summary_parts.append(f". Key highlights: {'; '.join(highlights[:3])}")
        
        return " ".join(summary_parts) + "."


def get_tool():
    """Get tool instance for Flowise"""
    return ProfileAnalyzerTool()

