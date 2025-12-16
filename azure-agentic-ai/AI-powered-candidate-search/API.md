# API Documentation

## Base URL

```
http://localhost:8000
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "candidate-search-api"
}
```

### 2. Upload Job Description

**POST** `/api/v1/search/upload`

Upload a job description document and start candidate search.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (job description .docx file)

**Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/search/upload" \
  -F "file=@job_description.docx"
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "message": "Job description uploaded and search started"
}
```

### 3. Start Search

**POST** `/api/v1/search/start`

Start candidate search with job description path or text.

**Request Body:**
```json
{
  "job_description_path": "path/to/job_description.docx",
  "job_description_text": "Optional: job description as text"
}
```

**Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/search/start" \
  -H "Content-Type: application/json" \
  -d '{
    "job_description_path": "uploads/job_description.docx"
  }'
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "message": "Candidate search started"
}
```

### 4. Get Search Results

**GET** `/api/v1/search/{job_id}`

Get candidate search results by job ID.

**Example:**
```bash
curl "http://localhost:8000/api/v1/search/550e8400-e29b-41d4-a716-446655440000"
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "results": {
    "job_requirements": {
      "skills": ["Python", "AWS", "Docker"],
      "technologies": ["AWS", "Azure", "Kubernetes"],
      "experience_keywords": ["architecture", "microservices"],
      "years_of_experience": "7",
      "location": "Chennai, Tamil Nadu"
    },
    "total_candidates_found": 15,
    "github_candidates": 8,
    "web_linkedin_candidates": 7,
    "summaries": [
      {
        "profile": {
          "username": "developer123",
          "name": "John Doe",
          "top_languages": ["Python", "JavaScript", "Go"],
          "public_repos": 25,
          "total_stars": 150
        },
        "match_score": 85,
        "matched_skills": ["Python", "AWS"],
        "matched_technologies": ["AWS", "Kubernetes"],
        "highlights": [
          "High GitHub activity with 150 stars",
          "Active contributor with 25 public repositories"
        ],
        "summary": "John Doe is a professional developer with expertise in Python, AWS, Kubernetes. Key highlights: High GitHub activity with 150 stars; Active contributor with 25 public repositories.",
        "recommendation": "Strong Match"
      }
    ],
    "status": "success"
  }
}
```

### 5. Get Search Status

**GET** `/api/v1/search/{job_id}/status`

Get the status of a search job.

**Example:**
```bash
curl "http://localhost:8000/api/v1/search/550e8400-e29b-41d4-a716-446655440000/status"
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

**Status Values:**
- `processing` - Search is in progress
- `completed` - Search completed successfully
- `failed` - Search failed with error

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Only .docx and .doc files are supported"
}
```

### 404 Not Found
```json
{
  "detail": "Job not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Search failed: Error message"
}
```

## Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

Visit `http://localhost:8000/redoc` for ReDoc documentation.

## Python Client Example

```python
import requests

# Upload job description
with open("job_description.docx", "rb") as f:
    response = requests.post(
        "http://localhost:8000/api/v1/search/upload",
        files={"file": f}
    )
    job_id = response.json()["job_id"]

# Check status
status_response = requests.get(
    f"http://localhost:8000/api/v1/search/{job_id}/status"
)
print(status_response.json())

# Get results
results_response = requests.get(
    f"http://localhost:8000/api/v1/search/{job_id}"
)
results = results_response.json()
print(f"Found {results['results']['total_candidates_found']} candidates")
```

## Rate Limiting

Currently, no rate limiting is implemented. For production:
- Implement rate limiting per IP
- Use API keys for authentication
- Set request quotas

## Authentication

Currently, no authentication is required. For production:
- Add JWT authentication
- Implement API key authentication
- Add OAuth2 support

