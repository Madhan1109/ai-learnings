"""
Main entry point for Flowise-based candidate search
"""

import sys
from pathlib import Path
from loguru import logger
from src.flowise_client import FlowiseClient
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
    
    logger.info("Starting AI-Powered Candidate Search (Flowise)")
    logger.info(f"Job description: {job_description_path}")
    
    try:
        # Check Flowise connection
        client = FlowiseClient()
        if not client.health_check():
            logger.error("Flowise server is not running. Please start Flowise first.")
            print("\nError: Flowise server is not running.")
            print("Start Flowise with: flowise start")
            sys.exit(1)
        
        # Execute search
        logger.info("Executing candidate search via Flowise...")
        results = client.search_candidates(job_description_path)
        
        # Print results
        print("\n" + "="*80)
        print("CANDIDATE SEARCH RESULTS")
        print("="*80)
        
        # Parse Flowise response
        if isinstance(results, dict):
            # Extract data from Flowise response format
            data = results.get("data", results)
            
            if isinstance(data, str):
                import json
                try:
                    data = json.loads(data)
                except:
                    print(f"Results: {data}")
                    return
            
            summaries = data.get("summaries", [])
            total = data.get("total_candidates_found", len(summaries))
            
            print(f"\nTotal candidates found: {total}")
            
            for i, summary in enumerate(summaries[:10], 1):
                print(f"\nCandidate {i}:")
                print(f"  Match Score: {summary.get('match_score', 0)}/100")
                print(f"  Recommendation: {summary.get('recommendation', 'N/A')}")
                print(f"  Summary: {summary.get('summary', 'N/A')}")
                if summary.get('highlights'):
                    print(f"  Highlights: {', '.join(summary['highlights'][:3])}")
        else:
            print(f"Results: {results}")
        
        print("\n" + "="*80)
        
        # Save results
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

