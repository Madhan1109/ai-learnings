"""
Demo script for AI-Powered Candidate Search
Shows the system working with sample data
"""

import json
from pathlib import Path
from loguru import logger
from datetime import datetime

# Configure logging
logger.add("logs/demo.log", rotation="10 MB", level="INFO")


def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80 + "\n")


def demo_document_parsing():
    """Demo: Document parsing"""
    print_header("DEMO: Document Parser")
    
    # Sample job description data
    sample_job = {
        "title": "Technical Architect",
        "location": "Chennai, Tamil Nadu",
        "job_type": "Full-Time",
        "skills": ["AWS", "Azure", "Python", "Docker", "Kubernetes"],
        "technologies": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Microservices"],
        "experience_keywords": ["architecture", "design", "microservices", "cloud"],
        "years_of_experience": "7",
        "requirements": [
            "Design system architecture blueprints",
            "Evaluate and select cloud technologies",
            "Lead technical teams",
            "7+ years in tech, 3+ in architecture role"
        ]
    }
    
    print("📄 Job Description Parsed:")
    print(f"   Title: {sample_job['title']}")
    print(f"   Location: {sample_job['location']}")
    print(f"   Skills Required: {', '.join(sample_job['skills'])}")
    print(f"   Technologies: {', '.join(sample_job['technologies'])}")
    print(f"   Experience: {sample_job['years_of_experience']}+ years")
    print(f"   Keywords: {', '.join(sample_job['experience_keywords'])}")
    
    return sample_job


def demo_github_search():
    """Demo: GitHub search results"""
    print_header("DEMO: GitHub Search Results")
    
    # Sample GitHub profiles
    github_profiles = [
        {
            "username": "dev_architect_001",
            "name": "Rajesh Kumar",
            "top_languages": ["Python", "JavaScript", "Go", "TypeScript"],
            "public_repos": 45,
            "total_stars": 320,
            "matched_skills": ["Python", "AWS"],
            "profile_url": "https://github.com/dev_architect_001",
            "bio": "Cloud Architect | AWS Certified | Microservices Expert"
        },
        {
            "username": "cloud_engineer_2024",
            "name": "Priya Sharma",
            "top_languages": ["Python", "Java", "Docker", "Kubernetes"],
            "public_repos": 38,
            "total_stars": 280,
            "matched_skills": ["Python", "Docker", "Kubernetes"],
            "profile_url": "https://github.com/cloud_engineer_2024",
            "bio": "DevOps Engineer | Kubernetes Specialist | CI/CD Expert"
        },
        {
            "username": "tech_lead_ai",
            "name": "Amit Patel",
            "top_languages": ["Python", "C#", "Azure", "Docker"],
            "public_repos": 52,
            "total_stars": 450,
            "matched_skills": ["Python", "Azure", "Docker"],
            "profile_url": "https://github.com/tech_lead_ai",
            "bio": "Technical Lead | Azure Expert | Architecture Design"
        }
    ]
    
    print(f"🔍 Found {len(github_profiles)} GitHub profiles:\n")
    
    for i, profile in enumerate(github_profiles, 1):
        print(f"   {i}. {profile['name']} (@{profile['username']})")
        print(f"      Languages: {', '.join(profile['top_languages'][:3])}")
        print(f"      Repositories: {profile['public_repos']} | Stars: {profile['total_stars']}")
        print(f"      Matched Skills: {', '.join(profile['matched_skills'])}")
        print(f"      Profile: {profile['profile_url']}")
        print()
    
    return github_profiles


def demo_web_linkedin_search():
    """Demo: Web/LinkedIn search results"""
    print_header("DEMO: Web/LinkedIn Search Results")
    
    # Sample web/LinkedIn profiles
    web_profiles = [
        {
            "name": "Dr. Suresh Menon",
            "headline": "Senior Technical Architect | AWS & Azure Certified",
            "location": "Chennai, Tamil Nadu",
            "experience": [
                {
                    "title": "Technical Architect",
                    "company": "Tech Solutions Inc.",
                    "duration": "5 years",
                    "description": "Designed scalable cloud architectures using AWS and Azure"
                }
            ],
            "skills": ["AWS", "Azure", "Python", "Architecture", "Microservices"],
            "education": [
                {
                    "degree": "M.Tech in Computer Science",
                    "school": "IIT Madras"
                }
            ],
            "profile_url": "https://linkedin.com/in/suresh-menon-architect",
            "matched_skills": ["AWS", "Azure", "Python"]
        },
        {
            "name": "Kavitha Reddy",
            "headline": "Cloud Solutions Architect | 10+ Years Experience",
            "location": "Bangalore, Karnataka",
            "experience": [
                {
                    "title": "Solutions Architect",
                    "company": "CloudTech Services",
                    "duration": "8 years",
                    "description": "Leading cloud migration projects and architecture design"
                }
            ],
            "skills": ["AWS", "Docker", "Kubernetes", "Python", "Architecture"],
            "education": [
                {
                    "degree": "B.E. in Computer Science",
                    "school": "Anna University"
                }
            ],
            "profile_url": "https://linkedin.com/in/kavitha-reddy-architect",
            "matched_skills": ["AWS", "Docker", "Kubernetes", "Python"]
        }
    ]
    
    print(f"🌐 Found {len(web_profiles)} professional profiles:\n")
    
    for i, profile in enumerate(web_profiles, 1):
        print(f"   {i}. {profile['name']}")
        print(f"      Headline: {profile['headline']}")
        print(f"      Location: {profile['location']}")
        print(f"      Experience: {len(profile['experience'])} positions")
        print(f"      Skills: {', '.join(profile['skills'][:5])}")
        print(f"      Matched: {', '.join(profile['matched_skills'])}")
        print(f"      Profile: {profile['profile_url']}")
        print()
    
    return web_profiles


def demo_profile_analysis(job_requirements, all_profiles):
    """Demo: Profile analysis and summarization"""
    print_header("DEMO: Profile Analysis & Summarization")
    
    # Analyze profiles
    analyzed_profiles = []
    
    for profile in all_profiles:
        # Calculate match score
        matched_skills = profile.get("matched_skills", [])
        match_score = len(matched_skills) * 15
        
        # Generate summary
        name = profile.get("name") or profile.get("username", "Candidate")
        summary = f"{name} is a skilled professional with expertise in {', '.join(matched_skills[:3])}."
        
        # Extract highlights
        highlights = []
        if "total_stars" in profile and profile.get("total_stars", 0) > 100:
            highlights.append(f"High GitHub activity ({profile['total_stars']} stars)")
        if "public_repos" in profile and profile.get("public_repos", 0) > 20:
            highlights.append(f"Active contributor ({profile['public_repos']} repos)")
        if "experience" in profile:
            highlights.append(f"{len(profile['experience'])} years experience")
        
        analyzed_profiles.append({
            "profile": profile,
            "match_score": min(match_score, 100),
            "matched_skills": matched_skills,
            "highlights": highlights,
            "summary": summary,
            "recommendation": (
                "Strong Match" if match_score >= 50
                else "Moderate Match" if match_score >= 30
                else "Weak Match"
            )
        })
    
    # Sort by match score
    analyzed_profiles.sort(key=lambda x: x["match_score"], reverse=True)
    
    print(f"📊 Analyzed {len(analyzed_profiles)} profiles:\n")
    
    for i, analysis in enumerate(analyzed_profiles[:5], 1):
        profile = analysis["profile"]
        name = profile.get("name") or profile.get("username", "Candidate")
        
        print(f"   {i}. {name}")
        print(f"      Match Score: {analysis['match_score']}/100")
        print(f"      Recommendation: {analysis['recommendation']}")
        print(f"      Summary: {analysis['summary']}")
        if analysis['highlights']:
            print(f"      Highlights: {', '.join(analysis['highlights'][:2])}")
        print()
    
    return analyzed_profiles


def demo_final_results(job_requirements, analyzed_profiles):
    """Demo: Final results summary"""
    print_header("DEMO: Final Results Summary")
    
    results = {
        "job_requirements": job_requirements,
        "total_candidates_found": len(analyzed_profiles),
        "github_candidates": len([p for p in analyzed_profiles if "username" in p.get("profile", {})]),
        "web_linkedin_candidates": len([p for p in analyzed_profiles if "headline" in p.get("profile", {})]),
        "summaries": analyzed_profiles,
        "status": "success",
        "timestamp": datetime.now().isoformat()
    }
    
    print("✅ Candidate Search Completed Successfully!\n")
    print(f"   Job Title: {job_requirements['title']}")
    print(f"   Location: {job_requirements['location']}")
    print(f"   Total Candidates Found: {results['total_candidates_found']}")
    print(f"   GitHub Candidates: {results['github_candidates']}")
    print(f"   Web/LinkedIn Candidates: {results['web_linkedin_candidates']}")
    print(f"   Top Matches: {len([p for p in analyzed_profiles if p['match_score'] >= 50])}")
    
    # Save results
    results_dir = Path("results")
    results_dir.mkdir(exist_ok=True)
    
    output_file = results_dir / f"demo_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n   📁 Results saved to: {output_file}")
    
    return results


def main():
    """Run the complete demo"""
    print("\n" + "="*80)
    print("  AI-POWERED CANDIDATE SEARCH - DEMO")
    print("="*80)
    print("\nThis demo shows how the candidate search system works.")
    print("All data shown is simulated for demonstration purposes.\n")
    
    try:
        # Step 1: Document Parsing
        job_requirements = demo_document_parsing()
        
        # Step 2: GitHub Search
        github_profiles = demo_github_search()
        
        # Step 3: Web/LinkedIn Search
        web_profiles = demo_web_linkedin_search()
        
        # Step 4: Combine profiles
        all_profiles = github_profiles + web_profiles
        
        # Step 5: Profile Analysis
        analyzed_profiles = demo_profile_analysis(job_requirements, all_profiles)
        
        # Step 6: Final Results
        results = demo_final_results(job_requirements, analyzed_profiles)
        
        print_header("DEMO COMPLETE")
        print("✅ Demo completed successfully!")
        print("\nNext Steps:")
        print("   1. Set up your API keys in .env file")
        print("   2. Install Flowise: npm install -g flowise")
        print("   3. Start Flowise: flowise start")
        print("   4. Build workflow in Flowise UI")
        print("   5. Run with real data: python main.py job_description.docx")
        print()
        
    except Exception as e:
        logger.error(f"Demo error: {str(e)}")
        print(f"\n❌ Error during demo: {str(e)}")
        print("Check logs/demo.log for details.")


if __name__ == "__main__":
    main()

