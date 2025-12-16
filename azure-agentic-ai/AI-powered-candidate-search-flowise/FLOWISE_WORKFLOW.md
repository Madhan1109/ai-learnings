# Flowise Workflow Configuration Guide

## Overview

This document explains how to build the candidate search workflow in Flowise UI.

## Workflow Structure

The candidate search workflow consists of the following nodes:

```
1. Input Node
   ↓
2. Document Parser Tool Node
   ↓
3. Conditional Node (Split for parallel processing)
   ├─→ GitHub Search Tool Node
   └─→ Web/LinkedIn Search Tool Node
   ↓
4. Merge Node
   ↓
5. Profile Summarizer Tool Node
   ↓
6. Output Node
```

## Step-by-Step Setup in Flowise UI

### Step 1: Create New Chatflow

1. Open Flowise UI: `http://localhost:3000`
2. Click **"New Chatflow"**
3. Name it: `Candidate Search`

### Step 2: Add Input Node

1. Drag **Chat Input** node to canvas
2. Configure:
   - **Name**: `Job Description Input`
   - **Input Type**: `File` or `Text`
   - **Placeholder**: `Upload job description or paste text`

### Step 3: Add Document Parser Tool

1. Drag **Custom Tool** node to canvas
2. Connect from Input node
3. Configure:
   - **Tool Name**: `Document Parser`
   - **Tool Path**: `flowise/custom_tools/document_parser.py`
   - **Input Variable**: `file_path` or `text`
   - **Output Variable**: `extracted_info`

### Step 4: Add Conditional/Split Node

1. Drag **Conditional** or **Split** node
2. Connect from Document Parser
3. Configure to split into two parallel paths

### Step 5: Add GitHub Search Tool

1. Drag **Custom Tool** node
2. Connect from Split node (first path)
3. Configure:
   - **Tool Name**: `GitHub Search`
   - **Tool Path**: `flowise/custom_tools/github_search.py`
   - **Input Variables**:
     - `keywords`: From extracted_info.experience_keywords
     - `skills`: From extracted_info.technologies
     - `min_repos`: `5`
   - **Output Variable**: `github_profiles`

### Step 6: Add Web/LinkedIn Search Tool

1. Drag **Custom Tool** node
2. Connect from Split node (second path)
3. Configure:
   - **Tool Name**: `Web Search`
   - **Tool Path**: `flowise/custom_tools/web_search.py`
   - **Input Variables**:
     - `query`: From extracted_info.experience_keywords
     - `skills`: From extracted_info.technologies
     - `location`: From extracted_info.location
   - **Output Variable**: `web_profiles`

### Step 7: Add Merge Node

1. Drag **Merge** or **Combine** node
2. Connect from both GitHub and Web Search nodes
3. Configure to combine `github_profiles` and `web_profiles` into `all_profiles`

### Step 8: Add Profile Summarizer Tool

1. Drag **Custom Tool** node
2. Connect from Merge node
3. Configure:
   - **Tool Name**: `Profile Analyzer`
   - **Tool Path**: `flowise/custom_tools/profile_analyzer.py`
   - **Input Variables**:
     - `profiles`: From all_profiles
     - `job_requirements`: From extracted_info
   - **Output Variable**: `analyzed_profiles`

### Step 9: Add Output Node

1. Drag **Chat Output** node
2. Connect from Profile Summarizer
3. Configure:
   - **Output Format**: `JSON` or `Text`
   - **Template**: Customize output format

### Step 10: Add LLM Nodes (Optional)

For better summarization, add LLM nodes:

1. **LLM Chain** node after Profile Analyzer
2. Configure:
   - **Model**: OpenAI GPT-4 (via LitELLM)
   - **Prompt**: "Summarize these candidate profiles: {analyzed_profiles}"
   - **Temperature**: 0.3

## Node Configuration Details

### Document Parser Tool Node

```json
{
  "name": "Document Parser",
  "type": "customTool",
  "inputs": {
    "file_path": "{{input.file_path}}"
  },
  "outputs": {
    "extracted_info": "{{tool_result.data}}"
  }
}
```

### GitHub Search Tool Node

```json
{
  "name": "GitHub Search",
  "type": "customTool",
  "inputs": {
    "keywords": "{{extracted_info.experience_keywords}}",
    "skills": "{{extracted_info.technologies}}",
    "min_repos": 5
  },
  "outputs": {
    "github_profiles": "{{tool_result.data.profiles}}"
  }
}
```

### Profile Analyzer Tool Node

```json
{
  "name": "Profile Analyzer",
  "type": "customTool",
  "inputs": {
    "profiles": "{{all_profiles}}",
    "job_requirements": "{{extracted_info}}"
  },
  "outputs": {
    "analyzed_profiles": "{{tool_result.data.analyzed_profiles}}"
  }
}
```

## Workflow JSON Export

After building the workflow in Flowise UI, export it:

1. Click **Export** button
2. Save as `flowise/chatflows/candidate_search_flow.json`

## Testing the Workflow

### In Flowise UI

1. Click **Test** button
2. Upload a job description file
3. Click **Run**
4. View results in output node

### Via API

```python
from src.flowise_client import FlowiseClient

client = FlowiseClient()
results = client.search_candidates("job_description.docx")
print(results)
```

## Advanced Configuration

### Adding Memory

1. Add **Memory** node
2. Configure session management
3. Enable conversation history

### Adding Guardrails

1. Add **Custom Tool** node for guardrails
2. Connect before and after processing
3. Configure input/output filtering

### Adding Error Handling

1. Add **Try-Catch** nodes
2. Configure error handling paths
3. Add fallback responses

## Troubleshooting

### Tools Not Loading

- Check tool paths in Flowise settings
- Verify Python dependencies installed
- Check tool file permissions

### Workflow Not Running

- Verify all nodes connected
- Check input/output variable names
- Review Flowise logs

### API Errors

- Verify API keys configured
- Check network connectivity
- Review error messages in Flowise UI

## Best Practices

1. **Naming**: Use descriptive names for all nodes
2. **Variables**: Use consistent variable naming
3. **Error Handling**: Add error handling nodes
4. **Testing**: Test each node individually
5. **Documentation**: Document custom configurations

---

**For more details, see Flowise documentation: https://docs.flowiseai.com**

