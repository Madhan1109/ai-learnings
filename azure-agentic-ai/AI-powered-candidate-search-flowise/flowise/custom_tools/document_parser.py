"""
Document Parser Tool for Flowise
Extracts information from job description documents
"""

from typing import Dict, Any
from docx import Document
import re
import json
import os


class DocumentParserTool:
    """Tool for parsing job description documents"""
    
    def __init__(self):
        self.name = "Document Parser"
        self.description = "Extracts skills, experience requirements, and keywords from job description documents"
    
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse document and extract information
        
        Args:
            inputs: Dictionary with 'file_path' key
            
        Returns:
            Dictionary with extracted information
        """
        file_path = inputs.get("file_path")
        
        if not file_path:
            return {"error": "file_path is required"}
        
        if not os.path.exists(file_path):
            return {"error": f"File not found: {file_path}"}
        
        try:
            # Read the document
            doc = Document(file_path)
            
            # Extract text from all paragraphs
            full_text = "\n".join([para.text for para in doc.paragraphs])
            
            # Extract structured information
            extracted_info = self._extract_information(full_text)
            
            return {
                "success": True,
                "data": extracted_info
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _extract_information(self, text: str) -> Dict[str, Any]:
        """Extract structured information from text"""
        info = {
            "skills": [],
            "experience_keywords": [],
            "technologies": [],
            "requirements": [],
            "preferred_qualifications": [],
            "location": "",
            "job_type": "",
            "years_of_experience": "",
            "full_text": text
        }
        
        # Extract skills and technologies
        common_skills = [
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD",
            "Java", "Python", "C#", "JavaScript", "TypeScript",
            "Microservices", "REST", "GraphQL", "API Design",
            "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL"
        ]
        
        for skill in common_skills:
            if skill.lower() in text.lower():
                info["technologies"].append(skill)
        
        # Extract years of experience
        experience_pattern = r'(\d+)\+?\s*years?\s*(?:of\s*)?experience'
        matches = re.findall(experience_pattern, text, re.IGNORECASE)
        if matches:
            info["years_of_experience"] = max(matches)
        
        # Extract location
        location_pattern = r'Location:\s*([^\n]+)'
        location_match = re.search(location_pattern, text, re.IGNORECASE)
        if location_match:
            info["location"] = location_match.group(1).strip()
        
        # Extract job type
        job_type_pattern = r'Job\s*Type:\s*([^\n]+)'
        job_type_match = re.search(job_type_pattern, text, re.IGNORECASE)
        if job_type_match:
            info["job_type"] = job_type_match.group(1).strip()
        
        # Extract keywords
        keywords = self._extract_keywords(text)
        info["experience_keywords"] = keywords
        
        return info
    
    def _extract_keywords(self, text: str) -> list:
        """Extract relevant keywords from text"""
        keywords = []
        
        technical_terms = [
            "architecture", "design", "implementation", "scalable",
            "microservices", "cloud", "devops", "agile", "scrum",
            "leadership", "collaboration", "stakeholder", "requirements"
        ]
        
        text_lower = text.lower()
        for term in technical_terms:
            if term in text_lower:
                keywords.append(term)
        
        return list(set(keywords))


# Flowise tool interface
def get_tool():
    """Get tool instance for Flowise"""
    return DocumentParserTool()

