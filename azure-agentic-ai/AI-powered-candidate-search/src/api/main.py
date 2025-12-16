"""
FastAPI main application
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uuid
from pathlib import Path
from loguru import logger

from src.workflow import CandidateSearchWorkflow
from src.config import settings
from src.utils.guardrails import apply_guardrails


# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered Candidate Search API",
    description="Production-ready agentic AI workflow for candidate search",
    version="1.0.0"
)

# Configure CORS
origins = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory job store (in production, use Redis or database)
job_store: Dict[str, Dict[str, Any]] = {}


class SearchRequest(BaseModel):
    """Request model for candidate search"""
    job_description_path: Optional[str] = None
    job_description_text: Optional[str] = None


class SearchResponse(BaseModel):
    """Response model for candidate search"""
    job_id: str
    status: str
    message: str


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting AI-Powered Candidate Search API")
    logger.info(f"Upload directory: {UPLOAD_DIR.absolute()}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Candidate Search API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "candidate-search-api"
    }


@app.post("/api/v1/search/upload", response_model=SearchResponse)
async def upload_job_description(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Upload job description document and start candidate search
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.docx', '.doc')):
            raise HTTPException(
                status_code=400,
                detail="Only .docx and .doc files are supported"
            )
        
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = UPLOAD_DIR / f"{job_id}_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Apply guardrails to file content (basic check)
        content_str = content.decode('utf-8', errors='ignore')
        filtered_content, is_blocked = apply_guardrails(content_str, is_input=True)
        if is_blocked:
            os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail="File contains sensitive information and was blocked"
            )
        
        # Initialize workflow
        workflow = CandidateSearchWorkflow()
        
        # Store job info
        job_store[job_id] = {
            "status": "processing",
            "file_path": str(file_path),
            "results": None
        }
        
        # Execute workflow in background
        if background_tasks:
            background_tasks.add_task(execute_search, job_id, str(file_path), workflow)
        else:
            # Synchronous execution for testing
            execute_search(job_id, str(file_path), workflow)
        
        return SearchResponse(
            job_id=job_id,
            status="processing",
            message="Job description uploaded and search started"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/api/v1/search/start", response_model=SearchResponse)
async def start_search(request: SearchRequest):
    """
    Start candidate search with job description path or text
    """
    try:
        job_id = str(uuid.uuid4())
        
        if request.job_description_path:
            file_path = request.job_description_path
        elif request.job_description_text:
            # Save text to temporary file
            file_path = UPLOAD_DIR / f"{job_id}_job_description.docx"
            # In production, convert text to .docx format
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(request.job_description_text)
        else:
            raise HTTPException(
                status_code=400,
                detail="Either job_description_path or job_description_text must be provided"
            )
        
        # Initialize workflow
        workflow = CandidateSearchWorkflow()
        
        # Store job info
        job_store[job_id] = {
            "status": "processing",
            "file_path": str(file_path),
            "results": None
        }
        
        # Execute workflow
        execute_search(job_id, str(file_path), workflow)
        
        return SearchResponse(
            job_id=job_id,
            status="processing",
            message="Candidate search started"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search start failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/api/v1/search/{job_id}")
async def get_search_results(job_id: str):
    """
    Get candidate search results by job ID
    """
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_info = job_store[job_id]
    
    # Apply guardrails to output
    if job_info.get("results"):
        results_str = str(job_info["results"])
        filtered_results, is_blocked = apply_guardrails(results_str, is_input=False)
        if is_blocked:
            return JSONResponse(
                status_code=403,
                content={"error": "Results contain sensitive information and were blocked"}
            )
    
    return {
        "job_id": job_id,
        "status": job_info["status"],
        "results": job_info.get("results")
    }


@app.get("/api/v1/search/{job_id}/status")
async def get_search_status(job_id: str):
    """
    Get search status by job ID
    """
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": job_id,
        "status": job_store[job_id]["status"]
    }


def execute_search(job_id: str, file_path: str, workflow: CandidateSearchWorkflow):
    """Execute candidate search workflow"""
    try:
        logger.info(f"Executing search for job {job_id}")
        job_store[job_id]["status"] = "processing"
        
        # Execute workflow
        results = workflow.execute(file_path)
        
        # Store results
        job_store[job_id]["results"] = results
        job_store[job_id]["status"] = "completed"
        
        logger.info(f"Search completed for job {job_id}")
        
    except Exception as e:
        logger.error(f"Search execution failed for job {job_id}: {str(e)}")
        job_store[job_id]["status"] = "failed"
        job_store[job_id]["error"] = str(e)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

