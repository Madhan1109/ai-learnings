# Step 4: Test Both Endpoints with Sample Calls

## Overview
This guide provides comprehensive testing procedures for both GPT-4o-mini and GPT-4o Vision endpoints, including text generation, image analysis, and performance testing.

## Prerequisites
- Completed Steps 1-3 (deployments and API keys)
- Both endpoints active and accessible
- API keys properly configured
- Python environment with required libraries

---

## Setup Testing Environment

### 1. Install Required Libraries

```bash
# Install required packages
pip install openai requests pillow matplotlib pandas seaborn numpy
```

### 2. Configure Test Environment

```python
import requests
import json
import time
import base64
from PIL import Image
import io
import os

# Configuration - Replace with your actual values
GPT4O_MINI_ENDPOINT = "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard"
GPT4O_MINI_API_KEY = "your-gpt-4o-mini-key"
GPT4O_VISION_ENDPOINT = "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision"
GPT4O_VISION_API_KEY = "your-gpt-4o-vision-key"

# Test configuration
TEST_CONFIG = {
    "timeout": 60,
    "max_retries": 3,
    "test_iterations": 5
}
```

---

## Test GPT-4o-mini Endpoint

### 1. Basic Text Generation Test

```python
def test_gpt4o_mini_text_generation():
    """Test GPT-4o-mini for basic text generation"""
    url = f"{GPT4O_MINI_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_MINI_API_KEY
    }
    
    test_prompts = [
        "Explain quantum computing in simple terms.",
        "Write a short poem about artificial intelligence.",
        "What are the benefits of renewable energy?",
        "How does machine learning work?"
    ]
    
    results = []
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n🧪 Testing GPT-4o-mini - Prompt {i}: {prompt[:50]}...")
        
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
            "temperature": 0.7
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                tokens_used = result['usage']['total_tokens']
                response_time = end_time - start_time
                
                print(f"✅ Success - Response Time: {response_time:.2f}s, Tokens: {tokens_used}")
                print(f"   Response: {result['choices'][0]['message']['content'][:100]}...")
                
                results.append({
                    "prompt": prompt,
                    "success": True,
                    "response_time": response_time,
                    "tokens_used": tokens_used,
                    "response": result['choices'][0]['message']['content']
                })
            else:
                print(f"❌ Failed - Status: {response.status_code}, Error: {response.text}")
                results.append({
                    "prompt": prompt,
                    "success": False,
                    "error": response.text
                })
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            results.append({
                "prompt": prompt,
                "success": False,
                "error": str(e)
            })
    
    return results

# Run text generation tests
print("🚀 Testing GPT-4o-mini Text Generation...")
mini_text_results = test_gpt4o_mini_text_generation()
```

### 2. Code Generation Test

```python
def test_gpt4o_mini_code_generation():
    """Test GPT-4o-mini for code generation capabilities"""
    url = f"{GPT4O_MINI_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_MINI_API_KEY
    }
    
    code_prompts = [
        "Write a Python function to calculate fibonacci numbers.",
        "Create a JavaScript function to validate email addresses.",
        "Write SQL query to find the top 10 customers by order value.",
        "Create a Python class for a simple calculator."
    ]
    
    results = []
    
    for i, prompt in enumerate(code_prompts, 1):
        print(f"\n💻 Testing GPT-4o-mini Code Generation - Prompt {i}")
        
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 300,
            "temperature": 0.3
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                tokens_used = result['usage']['total_tokens']
                response_time = end_time - start_time
                
                print(f"✅ Success - Response Time: {response_time:.2f}s, Tokens: {tokens_used}")
                
                results.append({
                    "prompt": prompt,
                    "success": True,
                    "response_time": response_time,
                    "tokens_used": tokens_used,
                    "code": result['choices'][0]['message']['content']
                })
            else:
                print(f"❌ Failed - Status: {response.status_code}")
                results.append({
                    "prompt": prompt,
                    "success": False,
                    "error": response.text
                })
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            results.append({
                "prompt": prompt,
                "success": False,
                "error": str(e)
            })
    
    return results

# Run code generation tests
print("\n🚀 Testing GPT-4o-mini Code Generation...")
mini_code_results = test_gpt4o_mini_code_generation()
```

### 3. Performance Stress Test

```python
def stress_test_gpt4o_mini():
    """Stress test GPT-4o-mini with multiple concurrent requests"""
    url = f"{GPT4O_MINI_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_MINI_API_KEY
    }
    
    payload = {
        "messages": [{"role": "user", "content": "Hello, this is a stress test."}],
        "max_tokens": 50,
        "temperature": 0.7
    }
    
    results = []
    print(f"\n🔥 Stress Testing GPT-4o-mini ({TEST_CONFIG['test_iterations']} iterations)...")
    
    for i in range(TEST_CONFIG["test_iterations"]):
        try:
            start_time = time.time()
            response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                tokens_used = result['usage']['total_tokens']
                response_time = end_time - start_time
                
                print(f"   Iteration {i+1}: {response_time:.2f}s, {tokens_used} tokens")
                
                results.append({
                    "iteration": i+1,
                    "success": True,
                    "response_time": response_time,
                    "tokens_used": tokens_used
                })
            else:
                print(f"   Iteration {i+1}: Failed - {response.status_code}")
                results.append({
                    "iteration": i+1,
                    "success": False,
                    "error": response.text
                })
                
        except Exception as e:
            print(f"   Iteration {i+1}: Exception - {str(e)}")
            results.append({
                "iteration": i+1,
                "success": False,
                "error": str(e)
            })
    
    return results

# Run stress test
mini_stress_results = stress_test_gpt4o_mini()
```

---

## Test GPT-4o Vision Endpoint

### 1. Image Analysis Test

```python
def encode_image_to_base64(image_path):
    """Encode image to base64 for API calls"""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding image {image_path}: {str(e)}")
        return None

def test_gpt4o_vision_image_analysis(image_paths):
    """Test GPT-4o Vision for image analysis"""
    url = f"{GPT4O_VISION_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_VISION_API_KEY
    }
    
    results = []
    
    for i, image_path in enumerate(image_paths, 1):
        print(f"\n🖼️ Testing GPT-4o Vision - Image {i}: {os.path.basename(image_path)}")
        
        # Encode image
        base64_image = encode_image_to_base64(image_path)
        if not base64_image:
            continue
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe what you see in this image in detail."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                tokens_used = result['usage']['total_tokens']
                response_time = end_time - start_time
                
                print(f"✅ Success - Response Time: {response_time:.2f}s, Tokens: {tokens_used}")
                print(f"   Analysis: {result['choices'][0]['message']['content'][:150]}...")
                
                results.append({
                    "image": os.path.basename(image_path),
                    "success": True,
                    "response_time": response_time,
                    "tokens_used": tokens_used,
                    "analysis": result['choices'][0]['message']['content']
                })
            else:
                print(f"❌ Failed - Status: {response.status_code}, Error: {response.text}")
                results.append({
                    "image": os.path.basename(image_path),
                    "success": False,
                    "error": response.text
                })
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            results.append({
                "image": os.path.basename(image_path),
                "success": False,
                "error": str(e)
            })
    
    return results

# Test with sample images (you'll need to provide actual image paths)
sample_images = [
    "sample_image1.jpg",
    "sample_image2.png",
    "sample_image3.jpeg"
]

print("🚀 Testing GPT-4o Vision Image Analysis...")
vision_image_results = test_gpt4o_vision_image_analysis(sample_images)
```

### 2. Multimodal Test (Text + Image)

```python
def test_gpt4o_vision_multimodal(image_path, text_prompt):
    """Test GPT-4o Vision for multimodal understanding"""
    url = f"{GPT4O_VISION_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_VISION_API_KEY
    }
    
    base64_image = encode_image_to_base64(image_path)
    if not base64_image:
        return None
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": text_prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 200,
        "temperature": 0.8
    }
    
    try:
        start_time = time.time()
        response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
        end_time = time.time()
        
        if response.status_code == 200:
            result = response.json()
            tokens_used = result['usage']['total_tokens']
            response_time = end_time - start_time
            
            return {
                "success": True,
                "response_time": response_time,
                "tokens_used": tokens_used,
                "response": result['choices'][0]['message']['content']
            }
        else:
            return {
                "success": False,
                "error": response.text
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Test multimodal scenarios
multimodal_tests = [
    {
        "image": "sample_image1.jpg",
        "prompt": "What would be a good caption for this image on social media?"
    },
    {
        "image": "sample_image2.png",
        "prompt": "What emotions does this image convey?"
    },
    {
        "image": "sample_image3.jpeg",
        "prompt": "How could this image be used in marketing?"
    }
]

print("\n🚀 Testing GPT-4o Vision Multimodal Capabilities...")
multimodal_results = []

for test in multimodal_tests:
    print(f"\n🔄 Testing: {test['prompt']}")
    result = test_gpt4o_vision_multimodal(test['image'], test['prompt'])
    if result:
        if result['success']:
            print(f"✅ Success - {result['response_time']:.2f}s, {result['tokens_used']} tokens")
            print(f"   Response: {result['response'][:100]}...")
        else:
            print(f"❌ Failed: {result['error']}")
        multimodal_results.append(result)
```

### 3. Vision Performance Test

```python
def performance_test_gpt4o_vision(image_path):
    """Performance test for GPT-4o Vision with single image"""
    url = f"{GPT4O_VISION_ENDPOINT}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4O_VISION_API_KEY
    }
    
    base64_image = encode_image_to_base64(image_path)
    if not base64_image:
        return None
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image briefly."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 100,
        "temperature": 0.7
    }
    
    results = []
    print(f"\n⚡ Performance Testing GPT-4o Vision ({TEST_CONFIG['test_iterations']} iterations)...")
    
    for i in range(TEST_CONFIG["test_iterations"]):
        try:
            start_time = time.time()
            response = requests.post(url, headers=headers, json=payload, timeout=TEST_CONFIG["timeout"])
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                tokens_used = result['usage']['total_tokens']
                response_time = end_time - start_time
                
                print(f"   Iteration {i+1}: {response_time:.2f}s, {tokens_used} tokens")
                
                results.append({
                    "iteration": i+1,
                    "success": True,
                    "response_time": response_time,
                    "tokens_used": tokens_used
                })
            else:
                print(f"   Iteration {i+1}: Failed - {response.status_code}")
                results.append({
                    "iteration": i+1,
                    "success": False,
                    "error": response.text
                })
                
        except Exception as e:
            print(f"   Iteration {i+1}: Exception - {str(e)}")
            results.append({
                "iteration": i+1,
                "success": False,
                "error": str(e)
            })
    
    return results

# Run vision performance test
vision_performance_results = performance_test_gpt4o_vision("sample_image1.jpg")
```

---

## Comprehensive Test Suite

### 1. Complete Test Runner

```python
def run_comprehensive_tests():
    """Run all tests and generate comprehensive report"""
    print("🚀 Starting Comprehensive Endpoint Testing...")
    print("=" * 60)
    
    # Test results storage
    all_results = {
        "gpt4o_mini": {
            "text_generation": None,
            "code_generation": None,
            "stress_test": None
        },
        "gpt4o_vision": {
            "image_analysis": None,
            "multimodal": None,
            "performance_test": None
        }
    }
    
    # Run GPT-4o-mini tests
    print("\n📝 Testing GPT-4o-mini Endpoint...")
    all_results["gpt4o_mini"]["text_generation"] = test_gpt4o_mini_text_generation()
    all_results["gpt4o_mini"]["code_generation"] = test_gpt4o_mini_code_generation()
    all_results["gpt4o_mini"]["stress_test"] = stress_test_gpt4o_mini()
    
    # Run GPT-4o Vision tests
    print("\n🖼️ Testing GPT-4o Vision Endpoint...")
    all_results["gpt4o_vision"]["image_analysis"] = test_gpt4o_vision_image_analysis(sample_images)
    all_results["gpt4o_vision"]["multimodal"] = multimodal_results
    all_results["gpt4o_vision"]["performance_test"] = vision_performance_results
    
    return all_results

# Run all tests
comprehensive_results = run_comprehensive_tests()
```

### 2. Test Results Analysis

```python
def analyze_test_results(results):
    """Analyze and summarize test results"""
    print("\n📊 Test Results Analysis")
    print("=" * 60)
    
    # GPT-4o-mini Analysis
    print("\n🤖 GPT-4o-mini Results:")
    mini_text_success = sum(1 for r in results["gpt4o_mini"]["text_generation"] if r["success"])
    mini_code_success = sum(1 for r in results["gpt4o_mini"]["code_generation"] if r["success"])
    mini_stress_success = sum(1 for r in results["gpt4o_mini"]["stress_test"] if r["success"])
    
    print(f"   Text Generation: {mini_text_success}/4 successful")
    print(f"   Code Generation: {mini_code_success}/4 successful")
    print(f"   Stress Test: {mini_stress_success}/{TEST_CONFIG['test_iterations']} successful")
    
    # Calculate average response times
    mini_response_times = []
    for test_type in ["text_generation", "code_generation", "stress_test"]:
        for result in results["gpt4o_mini"][test_type]:
            if result.get("success") and "response_time" in result:
                mini_response_times.append(result["response_time"])
    
    if mini_response_times:
        avg_mini_time = sum(mini_response_times) / len(mini_response_times)
        print(f"   Average Response Time: {avg_mini_time:.2f}s")
    
    # GPT-4o Vision Analysis
    print("\n👁️ GPT-4o Vision Results:")
    vision_image_success = sum(1 for r in results["gpt4o_vision"]["image_analysis"] if r["success"])
    vision_multimodal_success = sum(1 for r in results["gpt4o_vision"]["multimodal"] if r["success"])
    vision_perf_success = sum(1 for r in results["gpt4o_vision"]["performance_test"] if r["success"])
    
    print(f"   Image Analysis: {vision_image_success}/{len(sample_images)} successful")
    print(f"   Multimodal: {vision_multimodal_success}/{len(multimodal_tests)} successful")
    print(f"   Performance Test: {vision_perf_success}/{TEST_CONFIG['test_iterations']} successful")
    
    # Calculate average response times for vision
    vision_response_times = []
    for test_type in ["image_analysis", "multimodal", "performance_test"]:
        for result in results["gpt4o_vision"][test_type]:
            if result and result.get("success") and "response_time" in result:
                vision_response_times.append(result["response_time"])
    
    if vision_response_times:
        avg_vision_time = sum(vision_response_times) / len(vision_response_times)
        print(f"   Average Response Time: {avg_vision_time:.2f}s")
    
    return {
        "gpt4o_mini": {
            "success_rate": (mini_text_success + mini_code_success + mini_stress_success) / (4 + 4 + TEST_CONFIG["test_iterations"]),
            "avg_response_time": avg_mini_time if mini_response_times else 0
        },
        "gpt4o_vision": {
            "success_rate": (vision_image_success + vision_multimodal_success + vision_perf_success) / (len(sample_images) + len(multimodal_tests) + TEST_CONFIG["test_iterations"]),
            "avg_response_time": avg_vision_time if vision_response_times else 0
        }
    }

# Analyze results
analysis = analyze_test_results(comprehensive_results)
```

---

## Test Report Generation

### 1. Generate Test Report

```python
def generate_test_report(results, analysis):
    """Generate comprehensive test report"""
    report = {
        "test_summary": {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_tests": len(results["gpt4o_mini"]["text_generation"]) + len(results["gpt4o_vision"]["image_analysis"]),
            "success_rate": (analysis["gpt4o_mini"]["success_rate"] + analysis["gpt4o_vision"]["success_rate"]) / 2
        },
        "endpoint_performance": {
            "gpt4o_mini": {
                "success_rate": analysis["gpt4o_mini"]["success_rate"],
                "avg_response_time": analysis["gpt4o_mini"]["avg_response_time"],
                "recommended_use": "Text generation, code generation, general Q&A"
            },
            "gpt4o_vision": {
                "success_rate": analysis["gpt4o_vision"]["success_rate"],
                "avg_response_time": analysis["gpt4o_vision"]["avg_response_time"],
                "recommended_use": "Image analysis, multimodal tasks, visual content understanding"
            }
        },
        "detailed_results": results
    }
    
    # Save report to file
    with open("endpoint_test_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Test report saved to: endpoint_test_report.json")
    return report

# Generate and save report
test_report = generate_test_report(comprehensive_results, analysis)
```

---

## Troubleshooting Test Issues

### Common Test Problems and Solutions

1. **Image Upload Issues**:
   ```
   Problem: Image not found or encoding fails
   Solution: Verify image path, check file format (JPEG/PNG/GIF/WebP)
   ```

2. **Timeout Errors**:
   ```
   Problem: Requests timing out
   Solution: Increase timeout value, check network connectivity
   ```

3. **Token Limit Exceeded**:
   ```
   Problem: Response too long
   Solution: Reduce max_tokens parameter
   ```

4. **Rate Limiting**:
   ```
   Problem: Too many requests
   Solution: Add delays between requests, reduce test iterations
   ```

### Verification Checklist

- [ ] All test scripts run without errors
- [ ] Both endpoints respond to basic requests
- [ ] Image analysis tests work with sample images
- [ ] Performance metrics collected
- [ ] Test report generated successfully
- [ ] Results documented for comparison

---

## Next Steps

After completing endpoint testing:

1. **Compare Performance**: Proceed to Step 5 for response time and token usage comparison
2. **Optimize Configuration**: Adjust parameters based on test results
3. **Document Findings**: Update configuration documentation
4. **Plan Production Use**: Consider scaling and monitoring requirements

---

*Comprehensive testing ensures both endpoints are working correctly and helps identify optimal usage patterns.* 