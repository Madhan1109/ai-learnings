"""
Agent definitions for the candidate search workflow
"""

from .document_parser_agent import DocumentParserAgent
from .github_searcher_agent import GitHubSearcherAgent
from .web_linkedin_searcher_agent import WebLinkedInSearcherAgent
from .profile_summarizer_agent import ProfileSummarizerAgent

__all__ = [
    "DocumentParserAgent",
    "GitHubSearcherAgent",
    "WebLinkedInSearcherAgent",
    "ProfileSummarizerAgent",
]

