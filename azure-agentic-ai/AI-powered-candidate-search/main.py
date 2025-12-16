"""
Main entry point for the AI-Powered Candidate Search application
"""

# Windows compatibility fix - MUST be before any crewai imports
import sys
import os
import signal

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    # Set UTF-8 encoding for Windows console
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except:
            pass
    if sys.stderr.encoding != 'utf-8':
        try:
            sys.stderr.reconfigure(encoding='utf-8')
        except:
            pass
    
    # Set environment variable for UTF-8
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
    # Signal compatibility
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

from pathlib import Path
from loguru import logger
from src.workflow import CandidateSearchWorkflow
from src.config import settings

# Configure logging
logger.add(
    "logs/candidate_search.log",
    rotation="10 MB",
    retention="5 days",
    level=settings.log_level
)


def main():
    """Main function to run the candidate search workflow"""
    
    if len(sys.argv) < 2:
        print("Usage: python main.py <path_to_job_description.docx>")
        sys.exit(1)
    
    job_description_path = sys.argv[1]
    
    if not Path(job_description_path).exists():
        logger.error(f"Job description file not found: {job_description_path}")
        sys.exit(1)
    
    logger.info("Starting AI-Powered Candidate Search")
    logger.info(f"Job description: {job_description_path}")
    
    try:
        # Initialize workflow
        workflow = CandidateSearchWorkflow()
        
        # Execute workflow
        results = workflow.execute(job_description_path)
        
        # Print results
        print("\n" + "="*80)
        print("CANDIDATE SEARCH RESULTS")
        print("="*80)
        print(f"\nTotal candidates found: {results.get('total_candidates_found', 0)}")
        print(f"GitHub candidates: {results.get('github_candidates', 0)}")
        print(f"Web/LinkedIn candidates: {results.get('web_linkedin_candidates', 0)}")
        print("\n" + "-"*80)
        
        summaries = results.get("summaries", [])
        for i, summary in enumerate(summaries[:10], 1):  # Show top 10
            print(f"\nCandidate {i}:")
            print(f"  Match Score: {summary.get('match_score', 0)}/100")
            print(f"  Recommendation: {summary.get('recommendation', 'N/A')}")
            print(f"  Summary: {summary.get('summary', 'N/A')}")
            if summary.get('highlights'):
                print(f"  Highlights: {', '.join(summary['highlights'][:3])}")
        
        print("\n" + "="*80)
        
        # Save results to file
        import json
        output_file = Path("results") / f"search_results_{Path(job_description_path).stem}.json"
        output_file.parent.mkdir(exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Results saved to: {output_file}")
        logger.info("Candidate search completed successfully")
        
    except Exception as e:
        logger.error(f"Candidate search failed: {str(e)}")
        print(f"\nError: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

