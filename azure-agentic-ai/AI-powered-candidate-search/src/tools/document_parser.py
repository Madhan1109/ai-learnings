"""
Document Parser Tool for extracting information from job descriptions
"""

# Windows compatibility fix - MUST be first
from src.utils.windows_fix import *

from typing import Dict, List, Any
from docx import Document
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import re
import json


class DocumentParserInput(BaseModel):
    """Input schema for document parser"""
    file_path: str = Field(..., description="Path to the job description document")


class DocumentParserTool(BaseTool):
    """
    Tool for parsing job description documents and extracting key information
    """
    name: str = "Document Parser"
    description: str = (
        "Extracts skills, experience requirements, keywords, and other relevant "
        "information from job description documents (.docx format)"
    )
    args_schema: type[BaseModel] = DocumentParserInput

    def _run(self, file_path: str) -> str:
        """Parse document and extract information"""
        try:
            # Read the document
            doc = Document(file_path)
            
            # Extract text from all paragraphs
            full_text = "\n".join([para.text for para in doc.paragraphs])
            
            # Extract structured information
            extracted_info = self._extract_information(full_text)
            
            return json.dumps(extracted_info, indent=2)
            
        except Exception as e:
            return f"Error parsing document: {str(e)}"

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
        
        # Extract keywords from responsibilities and requirements sections
        keywords = self._extract_keywords(text)
        info["experience_keywords"] = keywords
        
        return info

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        keywords = []
        
        # Common technical keywords
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

