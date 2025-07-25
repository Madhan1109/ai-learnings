# Prompt Flow Testing Guide

## Overview
This guide provides comprehensive testing procedures for the Multi-Modal-Image-Analysis-Flow, including step-by-step testing instructions, validation criteria, and troubleshooting tips.

## Prerequisites
- Azure AI Studio access with "Foundry-RG" project
- Multi-Modal-Image-Analysis-Flow deployed and active
- Test images ready for upload
- Understanding of Prompt Flow testing concepts

---

## Step 1: Prepare Testing Environment

### 1.1 Access Prompt Flow
1. **Open Azure AI Studio**:
   - Go to [ai.azure.com](https://ai.azure.com)
   - Sign in with your Azure credentials
   - Select your "Foundry-RG" project

2. **Navigate to Prompt Flow**:
   - Click "Prompt Flow" in the left sidebar
   - Find "Multi-Modal-Image-Analysis-Flow"
   - Click on the flow to open it

### 1.2 Prepare Test Images
Create a test image collection with the following types:

```python
# Test image preparation script
import base64
from PIL import Image
import io

def prepare_test_image(image_path, max_size_mb=20):
    """Prepare image for testing"""
    # Open and resize if needed
    with Image.open(image_path) as img:
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if too large
        max_pixels = max_size_mb * 1024 * 1024 // 3  # Approximate
        if img.width * img.height > max_pixels:
            ratio = (max_pixels / (img.width * img.height)) ** 0.5
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=85)
        img_data = buffer.getvalue()
        
        return base64.b64encode(img_data).decode('utf-8')

# Prepare test images
test_images = {
    "landscape": prepare_test_image("landscape_nature.jpg"),
    "urban": prepare_test_image("urban_cityscape.jpg"),
    "portrait": prepare_test_image("portrait_person.jpg"),
    "document": prepare_test_image("document_with_text.jpg"),
    "artwork": prepare_test_image("artwork_painting.jpg"),
    "event": prepare_test_image("event_gathering.jpg"),
    "product": prepare_test_image("product_technical.jpg"),
    "abstract": prepare_test_image("abstract_art.jpg")
}
```

---

## Step 2: Execute Test Cases

### 2.1 Test Case 1: Comprehensive Analysis

**Test ID**: TC001  
**Description**: Test comprehensive analysis of a landscape image

1. **Setup Test Input**:
   ```json
   {
     "user_prompt": "What's happening in this landscape?",
     "image_data": "base64_encoded_landscape_image",
     "analysis_type": "comprehensive"
   }
   ```

2. **Execute Flow**:
   - Click "Run" in the Prompt Flow interface
   - Wait for all 4 steps to complete
   - Monitor execution time

3. **Validate Output**:
   ```json
   {
     "response": {
       "main_content": "Should provide comprehensive landscape analysis",
       "vision_analysis": "Should include terrain, vegetation, weather details",
       "analysis_type": "comprehensive"
     },
     "metadata": {
       "timestamp": "ISO format timestamp",
       "user_request": "What's happening in this landscape?",
       "processing_status": "success",
       "flow_version": "1.0.0"
     },
     "confidence": {
       "vision_analysis_confidence": 0.95,
       "text_generation_confidence": 0.90,
       "overall_confidence": 0.92
     }
   }
   ```

4. **Validation Criteria**:
   - [ ] Vision analysis includes environmental details
   - [ ] Text generation provides geographical context
   - [ ] Response is well-structured and informative
   - [ ] Confidence scores are >0.90
   - [ ] Processing time is <10 seconds

### 2.2 Test Case 2: Object Identification

**Test ID**: TC002  
**Description**: Test object identification in an urban environment

1. **Setup Test Input**:
   ```json
   {
     "user_prompt": "What objects and buildings can you see?",
     "image_data": "base64_encoded_urban_image",
     "analysis_type": "objects"
   }
   ```

2. **Execute and Validate**:
   - Run the flow
   - Check that objects are accurately identified
   - Verify categories are properly organized
   - Ensure descriptions are detailed and accurate

### 2.3 Test Case 3: Emotional Analysis

**Test ID**: TC003  
**Description**: Test emotional content analysis of a portrait

1. **Setup Test Input**:
   ```json
   {
     "user_prompt": "What emotions does this person convey?",
     "image_data": "base64_encoded_portrait_image",
     "analysis_type": "emotions"
   }
   ```

2. **Execute and Validate**:
   - Run the flow
   - Verify emotional indicators are identified
   - Check mood and atmosphere descriptions
   - Ensure context is considered

### 2.4 Test Case 4: Text Extraction

**Test ID**: TC004  
**Description**: Test text extraction from a document image

1. **Setup Test Input**:
   ```json
   {
     "user_prompt": "Read the text in this document",
     "image_data": "base64_encoded_document_image",
     "analysis_type": "text_extraction"
   }
   ```

2. **Execute and Validate**:
   - Run the flow
   - Verify all text is accurately extracted
   - Check text is properly formatted
   - Ensure readability is maintained

---

## Step 3: Performance Testing

### 3.1 Response Time Testing

```python
import time
import requests

def test_response_time(flow_endpoint, test_input, iterations=5):
    """Test response time performance"""
    
    response_times = []
    
    for i in range(iterations):
        start_time = time.time()
        
        response = requests.post(
            flow_endpoint,
            json=test_input,
            headers={"Content-Type": "application/json"}
        )
        
        end_time = time.time()
        response_time = end_time - start_time
        response_times.append(response_time)
        
        print(f"Iteration {i+1}: {response_time:.2f} seconds")
        
        # Wait between requests
        time.sleep(2)
    
    avg_time = sum(response_times) / len(response_times)
    max_time = max(response_times)
    min_time = min(response_times)
    
    print(f"\nPerformance Summary:")
    print(f"Average: {avg_time:.2f} seconds")
    print(f"Maximum: {max_time:.2f} seconds")
    print(f"Minimum: {min_time:.2f} seconds")
    
    return {
        "average": avg_time,
        "maximum": max_time,
        "minimum": min_time,
        "all_times": response_times
    }

# Test performance with different image types
performance_results = {}
for image_type, image_data in test_images.items():
    print(f"\nTesting performance with {image_type} image...")
    test_input = {
        "user_prompt": "Analyze this image",
        "image_data": image_data,
        "analysis_type": "comprehensive"
    }
    performance_results[image_type] = test_response_time(flow_endpoint, test_input)
```

### 3.2 Load Testing

```python
import concurrent.futures
import threading

def load_test(flow_endpoint, test_input, concurrent_requests=10):
    """Perform load testing with concurrent requests"""
    
    def single_request():
        start_time = time.time()
        response = requests.post(
            flow_endpoint,
            json=test_input,
            headers={"Content-Type": "application/json"}
        )
        end_time = time.time()
        return {
            "status_code": response.status_code,
            "response_time": end_time - start_time,
            "success": response.status_code == 200
        }
    
    print(f"Starting load test with {concurrent_requests} concurrent requests...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_requests) as executor:
        futures = [executor.submit(single_request) for _ in range(concurrent_requests)]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    # Analyze results
    successful_requests = [r for r in results if r["success"]]
    response_times = [r["response_time"] for r in results]
    
    print(f"\nLoad Test Results:")
    print(f"Total requests: {len(results)}")
    print(f"Successful requests: {len(successful_requests)}")
    print(f"Success rate: {len(successful_requests)/len(results)*100:.1f}%")
    print(f"Average response time: {sum(response_times)/len(response_times):.2f} seconds")
    print(f"Maximum response time: {max(response_times):.2f} seconds")
    
    return results

# Run load tests
load_test_results = {
    "light_load": load_test(flow_endpoint, test_input, 5),
    "medium_load": load_test(flow_endpoint, test_input, 10),
    "heavy_load": load_test(flow_endpoint, test_input, 20)
}
```

---

## Step 4: Error Testing

### 4.1 Invalid Input Testing

```python
def test_invalid_inputs(flow_endpoint):
    """Test flow behavior with invalid inputs"""
    
    invalid_test_cases = [
        {
            "name": "Empty User Prompt",
            "input": {
                "user_prompt": "",
                "image_data": test_images["landscape"],
                "analysis_type": "comprehensive"
            },
            "expected_error": "User prompt cannot be empty"
        },
        {
            "name": "Invalid Image Data",
            "input": {
                "user_prompt": "Test prompt",
                "image_data": "invalid_base64_data",
                "analysis_type": "comprehensive"
            },
            "expected_error": "Invalid image data format"
        },
        {
            "name": "Invalid Analysis Type",
            "input": {
                "user_prompt": "Test prompt",
                "image_data": test_images["landscape"],
                "analysis_type": "invalid_type"
            },
            "expected_behavior": "Should default to comprehensive analysis"
        }
    ]
    
    for test_case in invalid_test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            response = requests.post(
                flow_endpoint,
                json=test_case["input"],
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print("✅ Flow handled invalid input gracefully")
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception occurred: {str(e)}")

# Run invalid input tests
test_invalid_inputs(flow_endpoint)
```

### 4.2 Model Failure Testing

```python
def test_model_failures(flow_endpoint):
    """Test flow behavior when models are unavailable"""
    
    # This would require simulating model failures
    # In practice, you might test with invalid API keys or endpoints
    
    print("Testing model failure scenarios...")
    print("Note: This requires controlled failure simulation")
    
    # Test with invalid connection
    invalid_connection_input = {
        "user_prompt": "Test prompt",
        "image_data": test_images["landscape"],
        "analysis_type": "comprehensive"
    }
    
    # You would need to temporarily modify connections to test this
    print("Model failure testing requires environment setup")
```

---

## Step 5: Quality Assurance

### 5.1 Output Validation

```python
def validate_output_structure(response_data):
    """Validate the structure and content of flow output"""
    
    required_fields = [
        "response.main_content",
        "response.vision_analysis",
        "response.analysis_type",
        "metadata.timestamp",
        "metadata.user_request",
        "metadata.processing_status",
        "metadata.flow_version",
        "confidence.vision_analysis_confidence",
        "confidence.text_generation_confidence",
        "confidence.overall_confidence"
    ]
    
    validation_results = {}
    
    for field_path in required_fields:
        field_parts = field_path.split('.')
        current = response_data
        
        try:
            for part in field_parts:
                current = current[part]
            validation_results[field_path] = "✅ Present"
        except KeyError:
            validation_results[field_path] = "❌ Missing"
    
    # Check data types
    type_checks = {
        "response.main_content": str,
        "response.vision_analysis": str,
        "confidence.vision_analysis_confidence": (int, float),
        "confidence.text_generation_confidence": (int, float),
        "confidence.overall_confidence": (int, float)
    }
    
    for field_path, expected_type in type_checks.items():
        field_parts = field_path.split('.')
        current = response_data
        
        try:
            for part in field_parts:
                current = current[part]
            
            if isinstance(current, expected_type):
                validation_results[f"{field_path}_type"] = "✅ Correct"
            else:
                validation_results[f"{field_path}_type"] = f"❌ Expected {expected_type}, got {type(current)}"
        except KeyError:
            validation_results[f"{field_path}_type"] = "❌ Field missing"
    
    return validation_results

# Validate output for each test case
for test_case in test_cases:
    print(f"\nValidating output for: {test_case['name']}")
    validation_results = validate_output_structure(test_case['response'])
    
    for field, status in validation_results.items():
        print(f"  {field}: {status}")
```

### 5.2 Content Quality Assessment

```python
def assess_content_quality(response_data):
    """Assess the quality of generated content"""
    
    quality_metrics = {}
    
    # Check content length
    vision_length = len(response_data["response"]["vision_analysis"])
    text_length = len(response_data["response"]["main_content"])
    
    quality_metrics["vision_analysis_length"] = {
        "value": vision_length,
        "status": "✅ Good" if vision_length >= 50 else "❌ Too short"
    }
    
    quality_metrics["text_generation_length"] = {
        "value": text_length,
        "status": "✅ Good" if text_length >= 100 else "❌ Too short"
    }
    
    # Check confidence scores
    vision_confidence = response_data["confidence"]["vision_analysis_confidence"]
    text_confidence = response_data["confidence"]["text_generation_confidence"]
    overall_confidence = response_data["confidence"]["overall_confidence"]
    
    quality_metrics["vision_confidence"] = {
        "value": vision_confidence,
        "status": "✅ Excellent" if vision_confidence >= 0.95 else 
                 "✅ Good" if vision_confidence >= 0.85 else "⚠️ Low"
    }
    
    quality_metrics["text_confidence"] = {
        "value": text_confidence,
        "status": "✅ Excellent" if text_confidence >= 0.95 else
                 "✅ Good" if text_confidence >= 0.85 else "⚠️ Low"
    }
    
    quality_metrics["overall_confidence"] = {
        "value": overall_confidence,
        "status": "✅ Excellent" if overall_confidence >= 0.95 else
                 "✅ Good" if overall_confidence >= 0.85 else "⚠️ Low"
    }
    
    return quality_metrics

# Assess quality for each test case
for test_case in test_cases:
    print(f"\nQuality assessment for: {test_case['name']}")
    quality_metrics = assess_content_quality(test_case['response'])
    
    for metric, data in quality_metrics.items():
        print(f"  {metric}: {data['value']} - {data['status']}")
```

---

## Step 6: Test Reporting

### 6.1 Generate Test Report

```python
def generate_test_report(test_results, performance_results, quality_metrics):
    """Generate comprehensive test report"""
    
    report = {
        "test_summary": {
            "total_tests": len(test_results),
            "passed_tests": len([r for r in test_results if r["status"] == "passed"]),
            "failed_tests": len([r for r in test_results if r["status"] == "failed"]),
            "success_rate": len([r for r in test_results if r["status"] == "passed"]) / len(test_results) * 100
        },
        "performance_summary": {
            "average_response_time": performance_results["average"],
            "maximum_response_time": performance_results["maximum"],
            "minimum_response_time": performance_results["minimum"],
            "performance_rating": "Excellent" if performance_results["average"] < 10 else
                                "Good" if performance_results["average"] < 15 else "Needs Improvement"
        },
        "quality_summary": {
            "average_confidence": sum([m["overall_confidence"]["value"] for m in quality_metrics]) / len(quality_metrics),
            "content_quality": "High" if all(m["vision_analysis_length"]["status"] == "✅ Good" for m in quality_metrics) else "Medium"
        },
        "recommendations": []
    }
    
    # Generate recommendations
    if report["performance_summary"]["average_response_time"] > 15:
        report["recommendations"].append("Consider optimizing flow for faster response times")
    
    if report["quality_summary"]["average_confidence"] < 0.85:
        report["recommendations"].append("Review and improve prompt engineering for better accuracy")
    
    if report["test_summary"]["success_rate"] < 95:
        report["recommendations"].append("Investigate failed tests and improve error handling")
    
    return report

# Generate and save test report
test_report = generate_test_report(test_results, performance_results, quality_metrics)

with open("prompt_flow_test_report.json", "w") as f:
    json.dump(test_report, f, indent=2)

print("📄 Test report saved to: prompt_flow_test_report.json")
```

---

## Troubleshooting

### Common Issues and Solutions

1. **Flow Execution Fails**:
   ```
   Problem: Flow fails to execute
   Solution: Check model connections and API keys
   ```

2. **Slow Response Times**:
   ```
   Problem: Response times exceed 15 seconds
   Solution: Optimize prompts and check model availability
   ```

3. **Poor Quality Output**:
   ```
   Problem: Low confidence scores or poor content
   Solution: Review and refine prompts
   ```

4. **Image Processing Errors**:
   ```
   Problem: Images fail to process
   Solution: Check image format and size limits
   ```

### Performance Optimization Tips

1. **Prompt Optimization**:
   - Keep prompts concise but specific
   - Use clear, unambiguous language
   - Test different prompt variations

2. **Image Optimization**:
   - Compress images before upload
   - Use appropriate formats (JPEG for photos)
   - Ensure good image quality

3. **Flow Optimization**:
   - Monitor resource usage
   - Consider caching strategies
   - Optimize node configurations

---

## Next Steps

After completing testing:

1. **Review Results**: Analyze test outcomes and identify areas for improvement
2. **Optimize Flow**: Make adjustments based on test findings
3. **Deploy Updates**: Version and deploy improved flow
4. **Monitor Production**: Set up monitoring for production usage

---

*Comprehensive testing ensures the Prompt Flow meets quality standards and performs reliably in production environments.* 