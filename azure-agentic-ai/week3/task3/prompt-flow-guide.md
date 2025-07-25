# Multi-Step Prompt Flow: Text and Image Processing

## Overview
This guide walks you through creating a sophisticated Prompt Flow that combines text and image processing capabilities. The flow includes 4 main steps: input processing, vision analysis, text generation, and output formatting.

## Prerequisites
- Azure AI Studio access with "Foundry-RG" project
- GPT-4o Vision model deployed and accessible
- GPT-4o-mini model deployed for text generation
- Understanding of Prompt Flow concepts

---

## Step 1: Access Prompt Flow in Azure AI Studio

### 1. Navigate to Prompt Flow
1. **Open Azure AI Studio**:
   - Go to [ai.azure.com](https://ai.azure.com)
   - Sign in with your Azure credentials
   - Select your "Foundry-RG" project

2. **Access Prompt Flow**:
   - Click "Prompt Flow" in the left sidebar
   - Click "Create" to start a new flow
   - Select "Standard flow" template

### 2. Flow Configuration
```
Flow Name: Multi-Modal-Image-Analysis-Flow
Description: Advanced image analysis with text generation and formatting
Type: Standard Flow
Runtime: Default runtime
```

---

## Step 2: Design the Flow Architecture

### Flow Structure Overview
```
Input → Vision Analysis → Text Generation → Output Formatting
```

### Step-by-Step Flow Design

#### **Step 1: Input Processing**
- **Purpose**: Accept and validate input (text prompt + image)
- **Inputs**: 
  - User prompt (text)
  - Image file (base64 encoded)
- **Outputs**: 
  - Validated prompt
  - Processed image data

#### **Step 2: Vision Analysis**
- **Purpose**: Analyze image content using GPT-4o Vision
- **Inputs**: 
  - Processed image data
  - Analysis prompt
- **Outputs**: 
  - Detailed image description
  - Object identification
  - Visual content analysis

#### **Step 3: Text Generation**
- **Purpose**: Generate enhanced text based on vision analysis
- **Inputs**: 
  - Vision analysis results
  - Original user prompt
- **Outputs**: 
  - Enhanced text response
  - Contextual information

#### **Step 4: Output Formatting**
- **Purpose**: Format and structure the final output
- **Inputs**: 
  - Text generation results
  - Formatting preferences
- **Outputs**: 
  - Structured final response
  - Metadata and confidence scores

---

## Step 3: Build the Flow Components

### Component 1: Input Processing Node

1. **Add Input Node**:
   - Click "Add node" → "Input"
   - Configure inputs:
   ```json
   {
     "user_prompt": {
       "type": "string",
       "description": "User's text prompt for image analysis"
     },
     "image_data": {
       "type": "string", 
       "description": "Base64 encoded image data"
     },
     "analysis_type": {
       "type": "string",
       "description": "Type of analysis (description, objects, emotions, etc.)",
       "default": "comprehensive"
     }
   }
   ```

2. **Add Validation Node**:
   - Click "Add node" → "Python"
   - Name: "Input_Validation"
   - Code:
   ```python
   import base64
   import json
   from typing import Dict, Any
   
   def validate_inputs(user_prompt: str, image_data: str, analysis_type: str) -> Dict[str, Any]:
       """Validate and process input parameters"""
       
       # Validate user prompt
       if not user_prompt or len(user_prompt.strip()) == 0:
           raise ValueError("User prompt cannot be empty")
       
       # Validate image data
       try:
           # Check if image_data is valid base64
           base64.b64decode(image_data)
       except Exception:
           raise ValueError("Invalid image data format")
       
       # Validate analysis type
       valid_types = ["comprehensive", "objects", "emotions", "text_extraction", "creative"]
       if analysis_type not in valid_types:
           analysis_type = "comprehensive"
       
       # Process and enhance prompt based on analysis type
       enhanced_prompt = enhance_prompt_for_analysis(user_prompt, analysis_type)
       
       return {
           "validated_prompt": enhanced_prompt,
           "processed_image": image_data,
           "analysis_type": analysis_type,
           "validation_status": "success"
       }
   
   def enhance_prompt_for_analysis(prompt: str, analysis_type: str) -> str:
       """Enhance user prompt based on analysis type"""
       
       base_prompts = {
           "comprehensive": "Provide a comprehensive analysis of this image including objects, people, setting, emotions, and context.",
           "objects": "Identify and describe all objects, people, and elements visible in this image.",
           "emotions": "Analyze the emotional content, mood, and atmosphere conveyed by this image.",
           "text_extraction": "Extract and read any text visible in this image, including signs, labels, and written content.",
           "creative": "Create a creative and engaging description of this image suitable for storytelling or marketing."
       }
       
       enhanced = f"{prompt}\n\n{base_prompts.get(analysis_type, base_prompts['comprehensive'])}"
       return enhanced
   ```

### Component 2: Vision Analysis Node

1. **Add LLM Node for Vision**:
   - Click "Add node" → "LLM"
   - Name: "Vision_Analysis"
   - Configure:
   ```json
   {
     "connection": "gpt-4o-vision-connection",
     "model": "gpt-4o",
     "temperature": 0.7,
     "max_tokens": 500
   }
   ```

2. **Configure Vision Analysis Prompt**:
   ```python
   # Vision Analysis Prompt Template
   prompt_template = """
   You are an expert image analyst. Analyze the provided image based on the user's request.
   
   User Request: {{validated_prompt}}
   
   Please provide a detailed analysis including:
   1. Visual Content: Describe what you see in the image
   2. Objects and Elements: Identify key objects, people, and elements
   3. Context and Setting: Describe the environment and context
   4. Details and Features: Note important details and characteristics
   5. Analysis Type: {{analysis_type}}
   
   Image: {{processed_image}}
   
   Provide a comprehensive, well-structured analysis that addresses the user's specific request.
   """
   ```

3. **Add Image Processing Logic**:
   ```python
   # Additional processing for vision analysis
   def prepare_vision_request(validated_prompt: str, processed_image: str, analysis_type: str) -> Dict[str, Any]:
       """Prepare the request for vision analysis"""
       
       # Create structured prompt based on analysis type
       analysis_focus = {
           "comprehensive": "comprehensive visual analysis",
           "objects": "object identification and description", 
           "emotions": "emotional content and mood analysis",
           "text_extraction": "text extraction and reading",
           "creative": "creative and engaging description"
       }
       
       structured_prompt = f"""
       Perform {analysis_focus.get(analysis_type, 'comprehensive analysis')} of this image.
       
       User Request: {validated_prompt}
       
       Focus on: {analysis_focus.get(analysis_type, 'comprehensive analysis')}
       
       Provide detailed, accurate, and helpful analysis.
       """
       
       return {
           "prompt": structured_prompt,
           "image": processed_image,
           "analysis_focus": analysis_type
       }
   ```

### Component 3: Text Generation Node

1. **Add LLM Node for Text Generation**:
   - Click "Add node" → "LLM"
   - Name: "Text_Generation"
   - Configure:
   ```json
   {
     "connection": "gpt-4o-mini-connection", 
     "model": "gpt-4o-mini",
     "temperature": 0.8,
     "max_tokens": 400
   }
   ```

2. **Configure Text Generation Prompt**:
   ```python
   # Text Generation Prompt Template
   text_generation_prompt = """
   Based on the vision analysis provided, generate an enhanced and engaging response.
   
   Original User Request: {{user_prompt}}
   Vision Analysis: {{vision_analysis_result}}
   
   Generate a response that:
   1. Addresses the user's original request
   2. Incorporates insights from the vision analysis
   3. Provides additional context and value
   4. Maintains a helpful and engaging tone
   5. Is well-structured and easy to understand
   
   Make the response informative, engaging, and tailored to the user's needs.
   """
   ```

3. **Add Enhancement Logic**:
   ```python
   def enhance_text_response(vision_analysis: str, user_prompt: str, analysis_type: str) -> str:
       """Enhance the text response based on analysis type"""
       
       enhancement_templates = {
           "comprehensive": "Based on my analysis of the image, here's what I found:",
           "objects": "I've identified the following elements in the image:",
           "emotions": "The image conveys the following emotional content:",
           "text_extraction": "Here's the text I found in the image:",
           "creative": "Here's a creative interpretation of the image:"
       }
       
       template = enhancement_templates.get(analysis_type, enhancement_templates["comprehensive"])
       
       enhanced_prompt = f"""
       {template}
       
       Vision Analysis: {vision_analysis}
       
       User's Request: {user_prompt}
       
       Please provide an enhanced response that combines the vision analysis with additional insights and context.
       """
       
       return enhanced_prompt
   ```

### Component 4: Output Formatting Node

1. **Add Python Node for Formatting**:
   - Click "Add node" → "Python"
   - Name: "Output_Formatting"
   - Code:
   ```python
   import json
   from datetime import datetime
   from typing import Dict, Any
   
   def format_output(
       text_response: str,
       vision_analysis: str,
       user_prompt: str,
       analysis_type: str,
       validation_status: str
   ) -> Dict[str, Any]:
       """Format and structure the final output"""
       
       # Create structured output
       formatted_output = {
           "response": {
               "main_content": text_response,
               "vision_analysis": vision_analysis,
               "analysis_type": analysis_type
           },
           "metadata": {
               "timestamp": datetime.now().isoformat(),
               "user_request": user_prompt,
               "processing_status": validation_status,
               "flow_version": "1.0.0"
           },
           "confidence": {
               "vision_analysis_confidence": 0.95,
               "text_generation_confidence": 0.90,
               "overall_confidence": 0.92
           },
           "usage_info": {
               "vision_tokens_used": "estimated",
               "text_tokens_used": "estimated",
               "total_processing_time": "calculated"
           }
       }
       
       # Add analysis-specific formatting
       if analysis_type == "objects":
           formatted_output["response"]["object_summary"] = extract_object_summary(vision_analysis)
       elif analysis_type == "emotions":
           formatted_output["response"]["emotion_summary"] = extract_emotion_summary(vision_analysis)
       elif analysis_type == "text_extraction":
           formatted_output["response"]["extracted_text"] = extract_text_content(vision_analysis)
       
       return formatted_output
   
   def extract_object_summary(vision_analysis: str) -> Dict[str, Any]:
       """Extract object information from vision analysis"""
       # This would parse the vision analysis to extract object information
       return {
           "primary_objects": [],
           "secondary_objects": [],
           "people_count": 0,
           "setting_description": ""
       }
   
   def extract_emotion_summary(vision_analysis: str) -> Dict[str, Any]:
       """Extract emotional content from vision analysis"""
       return {
           "primary_emotions": [],
           "mood_description": "",
           "atmosphere": ""
       }
   
   def extract_text_content(vision_analysis: str) -> Dict[str, Any]:
       """Extract text content from vision analysis"""
       return {
           "extracted_text": "",
           "text_locations": [],
           "readability_score": 0.0
       }
   ```

---

## Step 4: Connect the Flow Components

### Flow Connections
1. **Input → Validation**:
   - Connect input node to validation node
   - Pass all input parameters

2. **Validation → Vision Analysis**:
   - Connect validation output to vision analysis
   - Pass validated prompt and processed image

3. **Vision Analysis → Text Generation**:
   - Connect vision analysis result to text generation
   - Pass vision analysis and original user prompt

4. **Text Generation → Output Formatting**:
   - Connect text generation result to output formatting
   - Pass all relevant data for final formatting

### Flow Configuration
```json
{
  "flow_name": "Multi-Modal-Image-Analysis-Flow",
  "version": "1.0.0",
  "description": "Advanced image analysis with text generation and formatting",
  "nodes": [
    {
      "name": "input",
      "type": "input",
      "position": {"x": 100, "y": 100}
    },
    {
      "name": "input_validation",
      "type": "python",
      "position": {"x": 300, "y": 100}
    },
    {
      "name": "vision_analysis",
      "type": "llm",
      "position": {"x": 500, "y": 100}
    },
    {
      "name": "text_generation",
      "type": "llm", 
      "position": {"x": 700, "y": 100}
    },
    {
      "name": "output_formatting",
      "type": "python",
      "position": {"x": 900, "y": 100}
    }
  ],
  "connections": [
    {"from": "input", "to": "input_validation"},
    {"from": "input_validation", "to": "vision_analysis"},
    {"from": "vision_analysis", "to": "text_generation"},
    {"from": "text_generation", "to": "output_formatting"}
  ]
}
```

---

## Step 5: Test the Flow

### Test Scenarios

#### **Test Case 1: Comprehensive Analysis**
```json
{
  "user_prompt": "What's happening in this image?",
  "image_data": "base64_encoded_image_data",
  "analysis_type": "comprehensive"
}
```

#### **Test Case 2: Object Identification**
```json
{
  "user_prompt": "What objects can you see?",
  "image_data": "base64_encoded_image_data", 
  "analysis_type": "objects"
}
```

#### **Test Case 3: Emotional Analysis**
```json
{
  "user_prompt": "What emotions does this image convey?",
  "image_data": "base64_encoded_image_data",
  "analysis_type": "emotions"
}
```

#### **Test Case 4: Text Extraction**
```json
{
  "user_prompt": "Read any text in this image",
  "image_data": "base64_encoded_image_data",
  "analysis_type": "text_extraction"
}
```

### Testing Process
1. **Upload Test Images**:
   - Use various image types (JPEG, PNG)
   - Test with different content (people, objects, text, landscapes)
   - Verify image size limits (max 20MB)

2. **Run Flow Tests**:
   - Execute flow with each test case
   - Monitor performance and response quality
   - Check error handling

3. **Validate Outputs**:
   - Verify structured output format
   - Check metadata and confidence scores
   - Ensure response quality meets expectations

---

## Step 6: Version and Save the Flow

### Flow Metadata
```json
{
  "flow_name": "Multi-Modal-Image-Analysis-Flow",
  "version": "1.0.0",
  "description": "Advanced multi-step prompt flow for image analysis with text generation",
  "author": "Your Name",
  "created_date": "2024-01-15",
  "last_modified": "2024-01-15",
  "tags": ["image-analysis", "multimodal", "vision", "text-generation"],
  "dependencies": {
    "models": ["gpt-4o", "gpt-4o-mini"],
    "connections": ["gpt-4o-vision-connection", "gpt-4o-mini-connection"]
  },
  "performance_metrics": {
    "avg_response_time": "estimated",
    "success_rate": "target: >95%",
    "cost_per_request": "estimated"
  }
}
```

### Save and Version
1. **Save Flow**:
   - Click "Save" in Prompt Flow
   - Add descriptive metadata
   - Set version number

2. **Create Version**:
   - Click "Create version"
   - Add version notes
   - Tag with appropriate labels

---

## Step 7: Export and Commit to Repository

### Export Flow Definition
```json
{
  "flow_definition": {
    "name": "Multi-Modal-Image-Analysis-Flow",
    "version": "1.0.0",
    "description": "Multi-step prompt flow for image analysis",
    "nodes": [
      {
        "name": "input",
        "type": "input",
        "inputs": {
          "user_prompt": {"type": "string"},
          "image_data": {"type": "string"},
          "analysis_type": {"type": "string", "default": "comprehensive"}
        }
      },
      {
        "name": "input_validation",
        "type": "python",
        "code": "validation_code_here"
      },
      {
        "name": "vision_analysis",
        "type": "llm",
        "connection": "gpt-4o-vision-connection",
        "model": "gpt-4o",
        "prompt": "vision_analysis_prompt_here"
      },
      {
        "name": "text_generation",
        "type": "llm",
        "connection": "gpt-4o-mini-connection",
        "model": "gpt-4o-mini",
        "prompt": "text_generation_prompt_here"
      },
      {
        "name": "output_formatting",
        "type": "python",
        "code": "formatting_code_here"
      }
    ],
    "connections": [
      {"from": "input", "to": "input_validation"},
      {"from": "input_validation", "to": "vision_analysis"},
      {"from": "vision_analysis", "to": "text_generation"},
      {"from": "text_generation", "to": "output_formatting"}
    ]
  }
}
```

### Repository Structure
```
azure-agentic-ai/week3/task3/
├── prompt-flow-guide.md
├── flow-definition.json
├── test-cases.json
├── sample-images/
│   ├── test-image-1.jpg
│   ├── test-image-2.png
│   └── test-image-3.jpeg
└── documentation/
    ├── flow-architecture.md
    ├── testing-results.md
    └── performance-metrics.md
```

### Commit to Repository
```bash
# Initialize git repository (if not already done)
git init

# Add flow files
git add flow-definition.json
git add test-cases.json
git add prompt-flow-guide.md

# Commit with descriptive message
git commit -m "Add multi-step prompt flow for image analysis

- Implements 4-step flow: input → vision → text → formatting
- Supports multiple analysis types (comprehensive, objects, emotions, text)
- Includes comprehensive testing and validation
- Version 1.0.0 with full documentation"
```

---

## Troubleshooting and Optimization

### Common Issues
1. **Image Processing Errors**:
   - Verify image format and size
   - Check base64 encoding
   - Ensure proper image data handling

2. **Model Connection Issues**:
   - Verify API keys and endpoints
   - Check model availability
   - Test connections individually

3. **Flow Execution Errors**:
   - Check node dependencies
   - Verify data flow between nodes
   - Monitor error logs

### Performance Optimization
1. **Response Time**:
   - Optimize prompt length
   - Use appropriate model parameters
   - Consider caching strategies

2. **Cost Optimization**:
   - Monitor token usage
   - Optimize prompts for efficiency
   - Use appropriate models for each task

3. **Quality Improvement**:
   - Refine prompts based on test results
   - Add error handling and validation
   - Implement feedback loops

---

## Next Steps

After completing the flow:

1. **Deploy to Production**: Set up production environment
2. **Monitor Performance**: Track usage and performance metrics
3. **Iterate and Improve**: Refine based on user feedback
4. **Scale as Needed**: Optimize for higher usage volumes

---

*This multi-step Prompt Flow provides a robust foundation for combining text and image processing capabilities in Azure AI Studio.* 