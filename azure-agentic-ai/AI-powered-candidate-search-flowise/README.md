# AI-Powered Candidate Search System - Flowise Version

A production-ready, agentic AI workflow for candidate search built with **Flowise** - a low-code/no-code tool for building LLM applications.

## 🎯 Features

### Core Workflow
1. **Upload & Input** - Accepts job description documents (.docx format)
2. **Extract Information** - Extracts skills, experience keywords, and requirements
3. **Search GitHub MCP** - Finds matching developer profiles on GitHub
4. **Search Web/LinkedIn** - Searches professional profiles across web and LinkedIn
5. **Summarize Profiles** - Creates concise summaries with key highlights and match scores

### Must-Have Features
- ✅ **AI Gateway (LitELLM)** - Unified LLM access and routing
- ✅ **Guardrails (NVIDIA NeMo Guardrails)** - Sensitive information blocking (input & output)
- ✅ **Multiple Agents** - Specialized agents for each workflow step
- ✅ **External APIs** - Integration with GitHub, LinkedIn, and web search APIs

## 🏗️ Architecture

### Framework: Flowise

**Why Flowise?**
- ✅ Visual drag-and-drop interface
- ✅ Easy workflow creation
- ✅ Built-in LangChain integration
- ✅ Custom tool/node support
- ✅ API-first architecture
- ✅ Production-ready deployment

### Flowise Components

1. **Chatflows** - Visual workflow definitions
2. **Custom Tools** - Python-based tools for agents
3. **API Integration** - RESTful API endpoints
4. **Memory** - Conversation and context management

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Flowise installed (via npm or Docker)
- API Keys (same as CrewAI version)

## 🚀 Installation

### 1. Install Flowise

```bash
# Option 1: npm (recommended)
npm install -g flowise

# Option 2: Docker
docker run -d --name flowise -p 3000:3000 flowiseai/flowise

# Option 3: npx (no installation)
npx flowise start
```

### 2. Install Python Dependencies

```bash
cd C:\ai-learnings\ai-learnings\azure-agentic-ai\AI-powered-candidate-search-flowise
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Start Flowise Server

```bash
# Start Flowise
flowise start

# Or with custom port
flowise start --PORT=3000
```

### 5. Import Custom Tools

```bash
# Install custom tools in Flowise
python setup_flowise_tools.py
```

## 📖 Usage

### Option 1: Flowise UI

1. Open Flowise UI: `http://localhost:3000`
2. Create a new Chatflow
3. Import the workflow from `flowise/candidate_search_flow.json`
4. Configure your API keys in Flowise settings
5. Test the workflow

### Option 2: API

```bash
# Start the API server
python run_api.py

# Upload job description
curl -X POST "http://localhost:8000/api/v1/search/upload" \
  -F "file=@job_description.docx"
```

### Option 3: Python SDK

```python
from src.flowise_client import FlowiseClient

client = FlowiseClient()
results = client.search_candidates("path/to/job_description.docx")
```

## 🔧 Configuration

### Flowise Configuration

Edit `flowise/config.json` for Flowise-specific settings.

### Environment Variables

Same as CrewAI version - see `.env.example`

## 📁 Project Structure

```
AI-powered-candidate-search-flowise/
├── flowise/                  # Flowise-specific files
│   ├── chatflows/           # Flowise workflow definitions
│   ├── custom_tools/        # Custom Python tools
│   └── config.json          # Flowise configuration
├── src/                     # Source code
│   ├── flowise_client.py    # Flowise API client
│   ├── tools/               # Custom tools
│   ├── api/                 # FastAPI application
│   └── utils/               # Utilities
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔒 Security & Guardrails

Same guardrails implementation as CrewAI version:
- Input filtering
- Output sanitization
- Sensitive information detection

## 📊 Workflow in Flowise

The workflow is built as a Chatflow in Flowise with the following nodes:

1. **Input Node** - Receives job description
2. **Document Parser Tool** - Extracts information
3. **GitHub Search Tool** - Searches GitHub
4. **Web/LinkedIn Search Tool** - Searches web
5. **Profile Summarizer Tool** - Analyzes profiles
6. **Output Node** - Returns results

## 🛠️ Development

### Adding Custom Tools

1. Create tool in `flowise/custom_tools/`
2. Register in `flowise/config.json`
3. Import in Flowise UI

### Modifying Workflow

1. Open Flowise UI
2. Edit the Chatflow
3. Save and export to `flowise/chatflows/`

## 📝 Documentation

- `FLOWISE_SETUP.md` - Detailed setup guide
- `FLOWISE_WORKFLOW.md` - Workflow configuration
- `API.md` - API documentation

## 🆚 Differences from CrewAI Version

| Feature | CrewAI | Flowise |
|---------|--------|---------|
| Interface | Code-based | Visual UI |
| Workflow Definition | Python code | JSON/UI |
| Customization | Code editing | Drag-and-drop |
| Deployment | Python app | Flowise server |
| Learning Curve | Higher | Lower |

## 🚨 Troubleshooting

### Flowise Not Starting
- Check Node.js version: `node --version` (should be 18+)
- Check port availability: `netstat -an | findstr 3000`
- Check logs: `flowise logs`

### Custom Tools Not Loading
- Ensure Python dependencies installed
- Check tool registration in `flowise/config.json`
- Verify tool paths in Flowise settings

## 📞 Support

For Flowise-specific issues:
- Flowise Documentation: https://docs.flowiseai.com
- Flowise GitHub: https://github.com/FlowiseAI/Flowise

---

**Built with Flowise, LitELLM, and NVIDIA NeMo Guardrails**

