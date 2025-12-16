# System Architecture

## Overview

The AI-Powered Candidate Search System is built using a multi-agent architecture with CrewAI, providing a production-ready solution for automated candidate search.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Upload Endpoint│  │ Search Endpoint│  │ Status Endpoint│ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │     CandidateSearchWorkflow          │
          │     (Orchestrator)                   │
          └──────────────────┬──────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Document      │   │ GitHub        │   │ Web/LinkedIn  │
│ Parser Agent  │   │ Search Agent  │   │ Search Agent  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Document      │   │ GitHub        │   │ Web Search    │
│ Parser Tool   │   │ Search Tool   │   │ Tool          │
└───────────────┘   └───────┬───────┘   └───────┬───────┘
                            │                   │
                            ▼                   ▼
                    ┌───────────────┐   ┌───────────────┐
                    │ GitHub API    │   │ SerpAPI /     │
                    │               │   │ Google CSE    │
                    └───────────────┘   └───────────────┘
                             │
                             │
                             ▼
                    ┌───────────────────┐
                    │ Profile Summarizer│
                    │ Agent             │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Profile Analyzer  │
                    │ Tool              │
                    └───────────────────┘
```

## Components

### 1. API Layer (`src/api/`)

**FastAPI Application**
- RESTful API endpoints
- File upload handling
- Background job processing
- CORS configuration
- Request/response validation

**Endpoints:**
- `POST /api/v1/search/upload` - Upload job description
- `POST /api/v1/search/start` - Start search with path/text
- `GET /api/v1/search/{job_id}` - Get results
- `GET /api/v1/search/{job_id}/status` - Get status

### 2. Workflow Layer (`src/workflow/`)

**CandidateSearchWorkflow**
- Orchestrates the complete workflow
- Manages agent execution
- Coordinates data flow
- Handles errors and retries
- Applies guardrails

**Workflow Steps:**
1. Parse job description
2. Search GitHub
3. Search Web/LinkedIn
4. Summarize profiles
5. Return results

### 3. Agent Layer (`src/agents/`)

**Four Specialized Agents:**

1. **Document Parser Agent**
   - Input: Job description document
   - Output: Structured requirements
   - Tools: DocumentParserTool

2. **GitHub Search Agent**
   - Input: Job requirements
   - Output: GitHub profiles
   - Tools: GitHubSearchTool

3. **Web/LinkedIn Search Agent**
   - Input: Job requirements
   - Output: Professional profiles
   - Tools: WebSearchTool, LinkedInSearchTool

4. **Profile Summarizer Agent**
   - Input: Candidate profiles + requirements
   - Output: Summarized profiles with scores
   - Tools: ProfileAnalyzerTool

### 4. Tool Layer (`src/tools/`)

**Custom Tools for Agents:**

- **DocumentParserTool** - Parses .docx files
- **GitHubSearchTool** - Searches GitHub API
- **WebSearchTool** - Searches web (SerpAPI/Google)
- **LinkedInSearchTool** - Searches LinkedIn
- **ProfileAnalyzerTool** - Analyzes and scores profiles

### 5. Integration Layer (`src/utils/`)

**LitELLM Client**
- Unified LLM access
- Model routing
- Fallback handling
- Configuration management

**Guardrails Manager**
- Input filtering
- Output sanitization
- Sensitive information detection
- NeMo Guardrails integration

### 6. Configuration (`config.yaml`, `.env`)

**YAML Configuration:**
- Agent parameters
- Workflow settings
- LLM configuration
- Guardrails settings

**Environment Variables:**
- API keys
- Service endpoints
- Security settings

## Data Flow

```
1. User uploads job description
   ↓
2. API validates and stores file
   ↓
3. Workflow initialized
   ↓
4. Document Parser Agent extracts requirements
   ├─→ Apply input guardrails
   └─→ Return structured data
   ↓
5. Parallel searches:
   ├─→ GitHub Search Agent
   │   └─→ GitHub API
   └─→ Web/LinkedIn Search Agent
       ├─→ SerpAPI / Google CSE
       └─→ LinkedIn API
   ↓
6. Profile Summarizer Agent
   ├─→ Analyze profiles
   ├─→ Calculate match scores
   └─→ Generate summaries
   ↓
7. Apply output guardrails
   ↓
8. Return results to user
```

## Security Architecture

### Guardrails Integration

```
Input → Guardrails Check → Process → Guardrails Check → Output
         (Block if unsafe)              (Sanitize if needed)
```

**Guardrails Features:**
- SSN detection
- Credit card detection
- PII filtering
- Profanity filtering
- Response validation

### API Security

- CORS configuration
- File type validation
- Size limits
- Rate limiting (recommended for production)
- Authentication (to be added)

## Scalability Considerations

### Current Design
- In-memory job store (for development)
- Synchronous processing
- Single instance

### Production Recommendations

1. **Job Queue**
   - Use Celery or RQ
   - Redis/RabbitMQ backend
   - Async processing

2. **Database**
   - PostgreSQL for job storage
   - Redis for caching
   - MongoDB for profiles (optional)

3. **Load Balancing**
   - Multiple API instances
   - Nginx/Traefik load balancer
   - Horizontal scaling

4. **Caching**
   - Cache parsed job descriptions
   - Cache search results
   - TTL-based invalidation

5. **Monitoring**
   - Prometheus metrics
   - Structured logging
   - Error tracking (Sentry)
   - Performance monitoring

## Technology Stack

- **Framework**: CrewAI (multi-agent)
- **API**: FastAPI
- **LLM Gateway**: LitELLM
- **Guardrails**: NVIDIA NeMo Guardrails
- **Document Processing**: python-docx
- **APIs**: GitHub API, SerpAPI, Google CSE
- **Language**: Python 3.9+

## Design Patterns

1. **Agent Pattern** - Specialized agents for specific tasks
2. **Tool Pattern** - Reusable tools for agents
3. **Orchestrator Pattern** - Workflow coordinates agents
4. **Gateway Pattern** - LitELLM as LLM gateway
5. **Guard Pattern** - Guardrails for security

## Error Handling

- Try-catch blocks at each layer
- Graceful degradation
- Fallback mechanisms
- Comprehensive logging
- User-friendly error messages

## Future Enhancements

1. **Database Integration**
   - Persistent job storage
   - Candidate database
   - Search history

2. **Advanced Features**
   - Multi-language support
   - Custom scoring algorithms
   - A/B testing framework
   - Analytics dashboard

3. **Performance**
   - Async processing
   - Caching layer
   - CDN for static assets
   - Database optimization

4. **Security**
   - Authentication/Authorization
   - Rate limiting
   - API key management
   - Audit logging

