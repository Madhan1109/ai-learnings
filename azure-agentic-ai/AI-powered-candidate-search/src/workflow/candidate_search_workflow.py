"""
Main workflow orchestrator for AI-powered candidate search
"""

# Windows compatibility fix for CrewAI signal issues
import sys
import signal
if sys.platform == 'win32':
    # Windows doesn't have these signals, add them as aliases
    if not hasattr(signal, 'SIGHUP'):
        signal.SIGHUP = signal.SIGTERM
    if not hasattr(signal, 'SIGCONT'):
        signal.SIGCONT = signal.SIGTERM
    if not hasattr(signal, 'SIGTSTP'):
        signal.SIGTSTP = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR1'):
        signal.SIGUSR1 = signal.SIGTERM
    if not hasattr(signal, 'SIGUSR2'):
        signal.SIGUSR2 = signal.SIGTERM

from typing import Dict, List, Any, Optional
from crewai import Crew, Process, Task
from pathlib import Path
import json
from loguru import logger

from src.agents.document_parser_agent import create_document_parser_agent
from src.agents.github_searcher_agent import create_github_searcher_agent
from src.agents.web_linkedin_searcher_agent import create_web_linkedin_searcher_agent
from src.agents.profile_summarizer_agent import create_profile_summarizer_agent
from src.config import settings, yaml_config
from src.utils.guardrails import apply_guardrails


class CandidateSearchWorkflow:
    """
    Orchestrates the complete candidate search workflow using multiple AI agents
    """
    
    def __init__(self):
        """Initialize the workflow with all agents"""
        logger.info("Initializing Candidate Search Workflow")
        
        # Create agents
        self.document_parser = create_document_parser_agent()
        self.github_searcher = create_github_searcher_agent()
        self.web_linkedin_searcher = create_web_linkedin_searcher_agent()
        self.profile_summarizer = create_profile_summarizer_agent()
        
        # Workflow configuration
        self.workflow_config = yaml_config.get("workflow", {})
        self.max_candidates = self.workflow_config.get("max_candidates", settings.max_candidates)
        
        logger.info("Workflow initialized successfully")
    
    def execute(self, job_description_path: str) -> Dict[str, Any]:
        """
        Execute the complete candidate search workflow
        
        Args:
            job_description_path: Path to the job description document
            
        Returns:
            Dictionary containing search results and summaries
        """
        logger.info(f"Starting candidate search workflow for: {job_description_path}")
        
        try:
            # Step 1: Parse job description
            logger.info("Step 1: Parsing job description")
            job_info = self._parse_job_description(job_description_path)
            
            if not job_info:
                raise ValueError("Failed to extract job information")
            
            # Apply guardrails to extracted information
            job_info_str = json.dumps(job_info)
            filtered_info, is_blocked = apply_guardrails(job_info_str, is_input=True)
            if is_blocked:
                raise ValueError("Job description contains sensitive information and was blocked")
            
            job_info = json.loads(filtered_info)
            logger.info(f"Extracted job requirements: {len(job_info.get('skills', []))} skills")
            
            # Step 2: Search GitHub
            logger.info("Step 2: Searching GitHub profiles")
            github_profiles = self._search_github(job_info)
            
            # Step 3: Search Web/LinkedIn
            logger.info("Step 3: Searching Web/LinkedIn profiles")
            web_profiles = self._search_web_linkedin(job_info)
            
            # Step 4: Combine and summarize profiles
            logger.info("Step 4: Summarizing candidate profiles")
            all_profiles = github_profiles + web_profiles
            summaries = self._summarize_profiles(all_profiles, job_info)
            
            # Apply guardrails to output
            summaries_str = json.dumps(summaries)
            filtered_summaries, is_blocked = apply_guardrails(summaries_str, is_input=False)
            summaries = json.loads(filtered_summaries)
            
            result = {
                "job_requirements": job_info,
                "total_candidates_found": len(all_profiles),
                "github_candidates": len(github_profiles),
                "web_linkedin_candidates": len(web_profiles),
                "summaries": summaries,
                "status": "success"
            }
            
            logger.info(f"Workflow completed successfully. Found {len(all_profiles)} candidates")
            return result
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "summaries": []
            }
    
    def _parse_job_description(self, file_path: str) -> Dict[str, Any]:
        """Parse job description using document parser agent"""
        try:
            # Convert to absolute path
            from pathlib import Path
            abs_path = Path(file_path).absolute()
            if not abs_path.exists():
                abs_path = Path(".") / file_path
                if not abs_path.exists():
                    raise FileNotFoundError(f"Job description file not found: {file_path}")
            
            # Create task for document parsing
            task = Task(
                description=f"Parse the job description document at {str(abs_path)} and extract all relevant information including skills, experience requirements, technologies, and keywords. Return ONLY valid JSON, no explanations.",
                agent=self.document_parser,
                expected_output="Valid JSON object containing extracted job requirements with keys: skills (array), technologies (array), experience_keywords (array), years_of_experience (string), location (string), job_type (string)"
            )
            
            # Create crew and execute
            # Set verbose=False to avoid emoji encoding issues on Windows
            crew = Crew(
                agents=[self.document_parser],
                tasks=[task],
                process=Process.sequential,
                verbose=False
            )
            
            result = crew.kickoff()
            result_str = str(result)
            
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', result_str, re.DOTALL)
            if json_match:
                try:
                    job_info = json.loads(json_match.group(1))
                    logger.info(f"Extracted job info from markdown: {len(job_info.get('technologies', []))} technologies")
                    return job_info
                except json.JSONDecodeError:
                    pass
            
            # Try direct JSON parsing
            try:
                job_info = json.loads(result_str)
                logger.info(f"Parsed job info directly: {len(job_info.get('technologies', []))} technologies")
                return job_info
            except json.JSONDecodeError:
                pass
            
            # Fallback: Use the tool directly
            logger.warning("Agent response parsing failed, using tool directly")
            from src.tools import DocumentParserTool
            tool = DocumentParserTool()
            tool_result = tool._run(str(abs_path))
            try:
                job_info = json.loads(tool_result)
                logger.info(f"Extracted from tool: {len(job_info.get('technologies', []))} technologies")
                return job_info
            except:
                return self._extract_info_from_text(result_str)
            
        except Exception as e:
            logger.error(f"Failed to parse job description: {str(e)}")
            return {}
    
    def _search_github(self, job_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search GitHub for matching profiles"""
        try:
            keywords = job_info.get("experience_keywords", [])
            skills = job_info.get("technologies", [])
            
            # Use tool directly for faster execution (skip agent wrapper)
            logger.info(f"Searching GitHub with {len(keywords)} keywords and {len(skills)} skills")
            from src.tools import GitHubSearchTool
            tool = GitHubSearchTool()
            
            # Call tool directly
            tool_result = tool._run(
                keywords=keywords[:5] if keywords else [],
                skills=skills[:5] if skills else [],
                min_repos=3,  # Lower threshold for faster results
                language=None
            )
            
            # Parse tool result
            result_data = json.loads(tool_result)
            if isinstance(result_data, dict) and "profiles" in result_data:
                profiles = result_data["profiles"]
                logger.info(f"Found {len(profiles)} GitHub profiles via direct tool call")
                return profiles
            elif isinstance(result_data, list):
                logger.info(f"Found {len(result_data)} GitHub profiles via direct tool call")
                return result_data
            
            return []
            
            # OLD METHOD: Using agent (slower, kept as fallback)
            # task = Task(
            #     description=(
            #         f"Search GitHub for developer profiles matching these requirements: "
            #         f"Keywords: {', '.join(keywords[:5])}, "
            #         f"Skills: {', '.join(skills[:5])}. "
            #         f"Find up to {self.max_candidates // 2} matching profiles."
            #     ),
            #     agent=self.github_searcher,
            #     expected_output="JSON array of GitHub profiles with username, skills, repositories, and match scores"
            # )
            # 
            # crew = Crew(
            #     agents=[self.github_searcher],
            #     tasks=[task],
            #     process=Process.sequential,
            #     verbose=False
            # )
            # 
            # result = crew.kickoff()
            
            # Parse results
            try:
                result_data = json.loads(str(result))
                if isinstance(result_data, dict) and "profiles" in result_data:
                    return result_data["profiles"]
                elif isinstance(result_data, list):
                    return result_data
            except json.JSONDecodeError:
                pass
            
            return []
            
        except Exception as e:
            logger.error(f"GitHub search failed: {str(e)}")
            return []
    
    def _search_web_linkedin(self, job_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search web and LinkedIn for matching profiles"""
        try:
            keywords = job_info.get("experience_keywords", [])
            skills = job_info.get("technologies", [])
            location = job_info.get("location", "")
            
            task = Task(
                description=(
                    f"Search web and LinkedIn for professional profiles matching these requirements: "
                    f"Keywords: {', '.join(keywords[:5])}, "
                    f"Skills: {', '.join(skills[:5])}, "
                    f"Location: {location}. "
                    f"Find up to {self.max_candidates // 2} matching profiles."
                ),
                agent=self.web_linkedin_searcher,
                expected_output="JSON array of professional profiles with name, experience, skills, and match information"
            )
            
            crew = Crew(
                agents=[self.web_linkedin_searcher],
                tasks=[task],
                process=Process.sequential,
                verbose=False
            )
            
            result = crew.kickoff()
            result_str = str(result)
            
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```(?:json)?\s*(\[.*?\]|\{.*?\})\s*```', result_str, re.DOTALL)
            if json_match:
                try:
                    result_data = json.loads(json_match.group(1))
                    if isinstance(result_data, dict) and "profiles" in result_data:
                        logger.info(f"Found {len(result_data['profiles'])} web/LinkedIn profiles from markdown")
                        return result_data["profiles"]
                    elif isinstance(result_data, list):
                        logger.info(f"Found {len(result_data)} web/LinkedIn profiles from markdown")
                        return result_data
                except json.JSONDecodeError:
                    pass
            
            # Try direct JSON parsing
            try:
                result_data = json.loads(result_str)
                if isinstance(result_data, dict) and "profiles" in result_data:
                    logger.info(f"Found {len(result_data['profiles'])} web/LinkedIn profiles")
                    return result_data["profiles"]
                elif isinstance(result_data, list):
                    logger.info(f"Found {len(result_data)} web/LinkedIn profiles")
                    return result_data
            except json.JSONDecodeError:
                pass
            
            logger.warning("Could not parse web/LinkedIn search results")
            return []
            
        except Exception as e:
            logger.error(f"Web/LinkedIn search failed: {str(e)}")
            return []
    
    def _summarize_profiles(
        self,
        profiles: List[Dict[str, Any]],
        job_info: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Summarize candidate profiles"""
        try:
            if not profiles:
                return []
            
            # Limit to max candidates
            profiles = profiles[:self.max_candidates]
            
            task = Task(
                description=(
                    f"Analyze and summarize {len(profiles)} candidate profiles based on these job requirements: "
                    f"{json.dumps(job_info, indent=2)}. "
                    f"For each profile, provide a match score, key highlights, and a concise summary."
                ),
                agent=self.profile_summarizer,
                expected_output="JSON array of analyzed profiles with match_score, highlights, summary, and recommendation"
            )
            
            crew = Crew(
                agents=[self.profile_summarizer],
                tasks=[task],
                process=Process.sequential,
                verbose=False
            )
            
            result = crew.kickoff()
            result_str = str(result)
            
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```(?:json)?\s*(\[.*?\]|\{.*?\})\s*```', result_str, re.DOTALL)
            if json_match:
                try:
                    result_data = json.loads(json_match.group(1))
                    if isinstance(result_data, dict) and "analyzed_profiles" in result_data:
                        logger.info(f"Found {len(result_data['analyzed_profiles'])} analyzed profiles from markdown")
                        return result_data["analyzed_profiles"]
                    elif isinstance(result_data, list):
                        logger.info(f"Found {len(result_data)} analyzed profiles from markdown")
                        return result_data
                except json.JSONDecodeError:
                    pass
            
            # Try direct JSON parsing
            try:
                result_data = json.loads(result_str)
                if isinstance(result_data, dict) and "analyzed_profiles" in result_data:
                    logger.info(f"Found {len(result_data['analyzed_profiles'])} analyzed profiles")
                    return result_data["analyzed_profiles"]
                elif isinstance(result_data, list):
                    logger.info(f"Found {len(result_data)} analyzed profiles")
                    return result_data
            except json.JSONDecodeError:
                pass
            
            logger.warning("Could not parse profile analysis results")
            return []
            
        except Exception as e:
            logger.error(f"Profile summarization failed: {str(e)}")
            return []
    
    def _extract_info_from_text(self, text: str) -> Dict[str, Any]:
        """Extract information from text if JSON parsing fails"""
        # Fallback extraction logic
        return {
            "skills": [],
            "technologies": [],
            "experience_keywords": [],
            "full_text": text
        }

