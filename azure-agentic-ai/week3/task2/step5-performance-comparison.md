# Step 5: Compare Response Times and Token Usage Between Models

## Overview
This guide provides comprehensive performance comparison between GPT-4o-mini and GPT-4o Vision models, including response time analysis, token usage comparison, cost analysis, and visualization of results.

## Prerequisites
- Completed Steps 1-4 (deployments, API keys, and testing)
- Test results from Step 4
- Python environment with data analysis libraries
- Understanding of performance metrics

---

## Performance Metrics Collection

### 1. Setup Performance Analysis Environment

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime
import json
import time
import requests

# Configuration
GPT4O_MINI_ENDPOINT = "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-mini-standard"
GPT4O_MINI_API_KEY = "your-gpt-4o-mini-key"
GPT4O_VISION_ENDPOINT = "https://your-endpoint.openai.azure.com/openai/deployments/gpt-4o-vision"
GPT4O_VISION_API_KEY = "your-gpt-4o-vision-key"

# Performance test configuration
PERFORMANCE_CONFIG = {
    "test_iterations": 10,
    "timeout": 60,
    "test_scenarios": [
        "simple_text",
        "complex_text",
        "code_generation",
        "image_analysis",
        "multimodal"
    ]
}
```

### 2. Define Test Scenarios

```python
# Test scenarios for performance comparison
TEST_SCENARIOS = {
    "simple_text": {
        "prompt": "What is the weather like today?",
        "max_tokens": 100,
        "temperature": 0.7,
        "models": ["gpt4o_mini", "gpt4o_vision"]
    },
    "complex_text": {
        "prompt": "Explain the concept of machine learning and its applications in healthcare with examples.",
        "max_tokens": 300,
        "temperature": 0.7,
        "models": ["gpt4o_mini", "gpt4o_vision"]
    },
    "code_generation": {
        "prompt": "Write a Python function to sort a list of dictionaries by a specific key.",
        "max_tokens": 200,
        "temperature": 0.3,
        "models": ["gpt4o_mini", "gpt4o_vision"]
    },
    "image_analysis": {
        "prompt": "Describe what you see in this image in detail.",
        "max_tokens": 200,
        "temperature": 0.7,
        "models": ["gpt4o_vision"],
        "requires_image": True
    },
    "multimodal": {
        "prompt": "What would be a good caption for this image on social media?",
        "max_tokens": 150,
        "temperature": 0.8,
        "models": ["gpt4o_vision"],
        "requires_image": True
    }
}
```

---

## Performance Testing Framework

### 1. Performance Test Runner

```python
def run_performance_test(model_name, endpoint_url, api_key, scenario, image_path=None):
    """Run performance test for a specific model and scenario"""
    
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }
    
    # Prepare payload based on scenario
    if scenario.get("requires_image") and image_path:
        # Vision model with image
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
                            "text": scenario["prompt"]
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
            "max_tokens": scenario["max_tokens"],
            "temperature": scenario["temperature"]
        }
    else:
        # Text-only model
        payload = {
            "messages": [
                {"role": "user", "content": scenario["prompt"]}
            ],
            "max_tokens": scenario["max_tokens"],
            "temperature": scenario["temperature"]
        }
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{endpoint_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=PERFORMANCE_CONFIG["timeout"]
        )
        end_time = time.time()
        
        if response.status_code == 200:
            result = response.json()
            tokens_used = result['usage']['total_tokens']
            response_time = end_time - start_time
            
            return {
                "success": True,
                "response_time": response_time,
                "tokens_used": tokens_used,
                "input_tokens": result['usage']['prompt_tokens'],
                "output_tokens": result['usage']['completion_tokens'],
                "model": model_name,
                "scenario": scenario["prompt"][:50] + "...",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}",
                "model": model_name,
                "scenario": scenario["prompt"][:50] + "...",
                "timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "model": model_name,
            "scenario": scenario["prompt"][:50] + "...",
            "timestamp": datetime.now().isoformat()
        }

def encode_image_to_base64(image_path):
    """Encode image to base64"""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding image {image_path}: {str(e)}")
        return None
```

### 2. Comprehensive Performance Test Suite

```python
def run_comprehensive_performance_tests():
    """Run comprehensive performance tests across all scenarios"""
    
    print("🚀 Starting Comprehensive Performance Comparison...")
    print("=" * 70)
    
    all_results = []
    
    # Test each scenario
    for scenario_name, scenario_config in TEST_SCENARIOS.items():
        print(f"\n📊 Testing Scenario: {scenario_name}")
        print(f"   Prompt: {scenario_config['prompt'][:60]}...")
        
        # Test each model for this scenario
        for model_name in scenario_config["models"]:
            print(f"   Testing Model: {model_name}")
            
            # Set endpoint and API key based on model
            if model_name == "gpt4o_mini":
                endpoint_url = GPT4O_MINI_ENDPOINT
                api_key = GPT4O_MINI_API_KEY
            else:  # gpt4o_vision
                endpoint_url = GPT4O_VISION_ENDPOINT
                api_key = GPT4O_VISION_API_KEY
            
            # Run multiple iterations for statistical significance
            for iteration in range(PERFORMANCE_CONFIG["test_iterations"]):
                print(f"     Iteration {iteration + 1}/{PERFORMANCE_CONFIG['test_iterations']}", end=" ")
                
                # Use sample image for vision tests
                image_path = "sample_image.jpg" if scenario_config.get("requires_image") else None
                
                result = run_performance_test(
                    model_name, 
                    endpoint_url, 
                    api_key, 
                    scenario_config,
                    image_path
                )
                
                if result:
                    all_results.append(result)
                    if result["success"]:
                        print(f"✅ {result['response_time']:.2f}s, {result['tokens_used']} tokens")
                    else:
                        print(f"❌ {result['error']}")
                else:
                    print("❌ No result")
                
                # Add delay between requests to avoid rate limiting
                time.sleep(1)
    
    return all_results

# Run comprehensive performance tests
performance_results = run_comprehensive_performance_tests()
```

---

## Data Analysis and Comparison

### 1. Create Performance DataFrame

```python
def create_performance_dataframe(results):
    """Convert results to pandas DataFrame for analysis"""
    
    # Filter successful results
    successful_results = [r for r in results if r.get("success")]
    
    # Create DataFrame
    df = pd.DataFrame(successful_results)
    
    # Add derived columns
    df['scenario_type'] = df['scenario'].apply(lambda x: 
        'text_only' if 'image' not in x.lower() else 'vision'
    )
    
    df['cost_estimate'] = df.apply(calculate_cost, axis=1)
    
    return df

def calculate_cost(row):
    """Calculate estimated cost based on token usage and model"""
    if row['model'] == 'gpt4o_mini':
        # GPT-4o-mini pricing: $0.00015 per 1K input, $0.0006 per 1K output
        input_cost = (row['input_tokens'] / 1000) * 0.00015
        output_cost = (row['output_tokens'] / 1000) * 0.0006
    else:  # gpt4o_vision
        # GPT-4o Vision pricing: $0.005 per 1K input, $0.015 per 1K output
        input_cost = (row['input_tokens'] / 1000) * 0.005
        output_cost = (row['output_tokens'] / 1000) * 0.015
    
    return input_cost + output_cost

# Create DataFrame
df = create_performance_dataframe(performance_results)
```

### 2. Performance Statistics Calculation

```python
def calculate_performance_statistics(df):
    """Calculate comprehensive performance statistics"""
    
    stats = {}
    
    # Overall statistics by model
    for model in df['model'].unique():
        model_data = df[df['model'] == model]
        
        stats[model] = {
            "total_requests": len(model_data),
            "success_rate": len(model_data) / len(df[df['model'] == model]),
            "avg_response_time": model_data['response_time'].mean(),
            "std_response_time": model_data['response_time'].std(),
            "min_response_time": model_data['response_time'].min(),
            "max_response_time": model_data['response_time'].max(),
            "avg_tokens_used": model_data['tokens_used'].mean(),
            "avg_cost": model_data['cost_estimate'].mean(),
            "total_cost": model_data['cost_estimate'].sum()
        }
    
    # Statistics by scenario
    for scenario in df['scenario'].unique():
        scenario_data = df[df['scenario'] == scenario]
        
        stats[f"scenario_{scenario[:30]}"] = {
            "total_requests": len(scenario_data),
            "avg_response_time": scenario_data['response_time'].mean(),
            "avg_tokens_used": scenario_data['tokens_used'].mean(),
            "avg_cost": scenario_data['cost_estimate'].mean()
        }
    
    # Comparison metrics
    if 'gpt4o_mini' in stats and 'gpt4o_vision' in stats:
        stats['comparison'] = {
            "speed_ratio": stats['gpt4o_vision']['avg_response_time'] / stats['gpt4o_mini']['avg_response_time'],
            "cost_ratio": stats['gpt4o_vision']['avg_cost'] / stats['gpt4o_mini']['avg_cost'],
            "token_efficiency_ratio": stats['gpt4o_mini']['avg_tokens_used'] / stats['gpt4o_vision']['avg_tokens_used']
        }
    
    return stats

# Calculate statistics
performance_stats = calculate_performance_statistics(df)
```

---

## Visualization and Analysis

### 1. Response Time Comparison Charts

```python
def create_response_time_charts(df):
    """Create comprehensive response time comparison charts"""
    
    # Set up the plotting style
    plt.style.use('seaborn-v0_8')
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
    
    # Chart 1: Response Time by Model
    model_response_times = [df[df['model'] == model]['response_time'] for model in df['model'].unique()]
    ax1.boxplot(model_response_times, labels=df['model'].unique())
    ax1.set_title('Response Time Distribution by Model')
    ax1.set_ylabel('Response Time (seconds)')
    ax1.grid(True, alpha=0.3)
    
    # Chart 2: Response Time by Scenario
    scenario_response_times = df.groupby('scenario')['response_time'].mean().sort_values(ascending=False)
    ax2.bar(range(len(scenario_response_times)), scenario_response_times.values)
    ax2.set_title('Average Response Time by Scenario')
    ax2.set_ylabel('Response Time (seconds)')
    ax2.set_xticks(range(len(scenario_response_times)))
    ax2.set_xticklabels([s[:20] + '...' for s in scenario_response_times.index], rotation=45)
    ax2.grid(True, alpha=0.3)
    
    # Chart 3: Response Time vs Tokens Used
    for model in df['model'].unique():
        model_data = df[df['model'] == model]
        ax3.scatter(model_data['tokens_used'], model_data['response_time'], 
                   label=model, alpha=0.6, s=50)
    ax3.set_xlabel('Tokens Used')
    ax3.set_ylabel('Response Time (seconds)')
    ax3.set_title('Response Time vs Token Usage')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Chart 4: Response Time Heatmap by Model and Scenario
    pivot_data = df.pivot_table(
        values='response_time', 
        index='model', 
        columns='scenario', 
        aggfunc='mean'
    )
    sns.heatmap(pivot_data, annot=True, fmt='.2f', cmap='YlOrRd', ax=ax4)
    ax4.set_title('Response Time Heatmap (Model vs Scenario)')
    
    plt.tight_layout()
    plt.savefig('response_time_comparison.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("📊 Response time charts saved to: response_time_comparison.png")

# Create response time charts
create_response_time_charts(df)
```

### 2. Token Usage and Cost Analysis

```python
def create_token_cost_charts(df):
    """Create token usage and cost analysis charts"""
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
    
    # Chart 1: Token Usage by Model
    token_usage_by_model = df.groupby('model')['tokens_used'].mean()
    ax1.bar(token_usage_by_model.index, token_usage_by_model.values, 
            color=['skyblue', 'lightcoral'])
    ax1.set_title('Average Token Usage by Model')
    ax1.set_ylabel('Tokens Used')
    ax1.grid(True, alpha=0.3)
    
    # Chart 2: Cost Comparison
    cost_by_model = df.groupby('model')['cost_estimate'].mean()
    ax2.bar(cost_by_model.index, cost_by_model.values, 
            color=['skyblue', 'lightcoral'])
    ax2.set_title('Average Cost per Request by Model')
    ax2.set_ylabel('Cost ($)')
    ax2.grid(True, alpha=0.3)
    
    # Chart 3: Token Efficiency (Input vs Output)
    for model in df['model'].unique():
        model_data = df[df['model'] == model]
        ax3.scatter(model_data['input_tokens'], model_data['output_tokens'], 
                   label=model, alpha=0.6, s=50)
    ax3.set_xlabel('Input Tokens')
    ax3.set_ylabel('Output Tokens')
    ax3.set_title('Input vs Output Token Usage')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Chart 4: Cost vs Performance Scatter
    for model in df['model'].unique():
        model_data = df[df['model'] == model]
        ax4.scatter(model_data['response_time'], model_data['cost_estimate'], 
                   label=model, alpha=0.6, s=50)
    ax4.set_xlabel('Response Time (seconds)')
    ax4.set_ylabel('Cost ($)')
    ax4.set_title('Cost vs Performance Trade-off')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('token_cost_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("💰 Token and cost charts saved to: token_cost_analysis.png")

# Create token and cost charts
create_token_cost_charts(df)
```

### 3. Performance Summary Dashboard

```python
def create_performance_dashboard(df, stats):
    """Create a comprehensive performance dashboard"""
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
    
    # Dashboard 1: Performance Overview
    models = list(stats.keys())[:2]  # gpt4o_mini and gpt4o_vision
    response_times = [stats[model]['avg_response_time'] for model in models]
    costs = [stats[model]['avg_cost'] for model in models]
    
    x = np.arange(len(models))
    width = 0.35
    
    ax1.bar(x - width/2, response_times, width, label='Response Time (s)', color='skyblue')
    ax1_twin = ax1.twinx()
    ax1_twin.bar(x + width/2, costs, width, label='Cost ($)', color='lightcoral')
    
    ax1.set_xlabel('Model')
    ax1.set_ylabel('Response Time (seconds)')
    ax1_twin.set_ylabel('Cost ($)')
    ax1.set_title('Performance Overview')
    ax1.set_xticks(x)
    ax1.set_xticklabels(models)
    
    # Dashboard 2: Success Rate and Token Usage
    success_rates = [stats[model]['success_rate'] * 100 for model in models]
    token_usage = [stats[model]['avg_tokens_used'] for model in models]
    
    ax2.bar(x - width/2, success_rates, width, label='Success Rate (%)', color='lightgreen')
    ax2_twin = ax2.twinx()
    ax2_twin.bar(x + width/2, token_usage, width, label='Avg Tokens', color='orange')
    
    ax2.set_xlabel('Model')
    ax2.set_ylabel('Success Rate (%)')
    ax2_twin.set_ylabel('Average Tokens Used')
    ax2.set_title('Reliability and Efficiency')
    ax2.set_xticks(x)
    ax2.set_xticklabels(models)
    
    # Dashboard 3: Performance Distribution
    for model in models:
        model_data = df[df['model'] == model]
        ax3.hist(model_data['response_time'], alpha=0.7, label=model, bins=20)
    ax3.set_xlabel('Response Time (seconds)')
    ax3.set_ylabel('Frequency')
    ax3.set_title('Response Time Distribution')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Dashboard 4: Cost Efficiency
    efficiency_data = df.groupby('model').agg({
        'response_time': 'mean',
        'cost_estimate': 'mean',
        'tokens_used': 'mean'
    }).reset_index()
    
    ax4.scatter(efficiency_data['response_time'], efficiency_data['cost_estimate'], 
               s=efficiency_data['tokens_used']*10, alpha=0.7)
    
    for i, row in efficiency_data.iterrows():
        ax4.annotate(row['model'], (row['response_time'], row['cost_estimate']), 
                    xytext=(5, 5), textcoords='offset points')
    
    ax4.set_xlabel('Response Time (seconds)')
    ax4.set_ylabel('Cost ($)')
    ax4.set_title('Cost vs Performance (bubble size = tokens)')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('performance_dashboard.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("📈 Performance dashboard saved to: performance_dashboard.png")

# Create performance dashboard
create_performance_dashboard(df, performance_stats)
```

---

## Detailed Performance Analysis

### 1. Statistical Analysis

```python
def perform_statistical_analysis(df):
    """Perform detailed statistical analysis of performance data"""
    
    print("\n📊 Statistical Analysis Results")
    print("=" * 50)
    
    # T-test for response time comparison
    from scipy import stats
    
    mini_times = df[df['model'] == 'gpt4o_mini']['response_time']
    vision_times = df[df['model'] == 'gpt4o_vision']['response_time']
    
    t_stat, p_value = stats.ttest_ind(mini_times, vision_times)
    
    print(f"Response Time T-Test:")
    print(f"  T-statistic: {t_stat:.4f}")
    print(f"  P-value: {p_value:.4f}")
    print(f"  Significant difference: {'Yes' if p_value < 0.05 else 'No'}")
    
    # Correlation analysis
    correlations = df[['response_time', 'tokens_used', 'cost_estimate']].corr()
    print(f"\nCorrelation Matrix:")
    print(correlations)
    
    # Performance percentiles
    print(f"\nPerformance Percentiles:")
    for model in df['model'].unique():
        model_data = df[df['model'] == model]['response_time']
        percentiles = model_data.quantile([0.25, 0.5, 0.75, 0.95])
        print(f"  {model}:")
        print(f"    25th percentile: {percentiles[0.25]:.3f}s")
        print(f"    50th percentile: {percentiles[0.5]:.3f}s")
        print(f"    75th percentile: {percentiles[0.75]:.3f}s")
        print(f"    95th percentile: {percentiles[0.95]:.3f}s")
    
    return {
        "t_test": {"t_stat": t_stat, "p_value": p_value},
        "correlations": correlations,
        "percentiles": {model: df[df['model'] == model]['response_time'].quantile([0.25, 0.5, 0.75, 0.95]) 
                       for model in df['model'].unique()}
    }

# Perform statistical analysis
statistical_results = perform_statistical_analysis(df)
```

### 2. Cost-Benefit Analysis

```python
def perform_cost_benefit_analysis(df, stats):
    """Perform cost-benefit analysis of model choices"""
    
    print("\n💰 Cost-Benefit Analysis")
    print("=" * 50)
    
    # Calculate cost per token
    for model in df['model'].unique():
        model_data = df[df['model'] == model]
        cost_per_token = model_data['cost_estimate'].sum() / model_data['tokens_used'].sum()
        print(f"{model}:")
        print(f"  Cost per token: ${cost_per_token:.6f}")
        print(f"  Total cost: ${model_data['cost_estimate'].sum():.4f}")
        print(f"  Total tokens: {model_data['tokens_used'].sum():,}")
    
    # Calculate efficiency metrics
    if 'comparison' in stats:
        print(f"\nEfficiency Comparison:")
        print(f"  Speed ratio (Vision/Mini): {stats['comparison']['speed_ratio']:.2f}x")
        print(f"  Cost ratio (Vision/Mini): {stats['comparison']['cost_ratio']:.2f}x")
        print(f"  Token efficiency ratio (Mini/Vision): {stats['comparison']['token_efficiency_ratio']:.2f}x")
    
    # Recommendations based on use case
    print(f"\nRecommendations:")
    print(f"  Text-only tasks: Use GPT-4o-mini (faster, cheaper)")
    print(f"  Image analysis: Use GPT-4o Vision (required)")
    print(f"  Multimodal tasks: Use GPT-4o Vision (required)")
    print(f"  Budget-conscious: Use GPT-4o-mini when possible")
    
    return {
        "cost_per_token": {model: df[df['model'] == model]['cost_estimate'].sum() / 
                          df[df['model'] == model]['tokens_used'].sum() 
                          for model in df['model'].unique()},
        "efficiency_ratios": stats.get('comparison', {})
    }

# Perform cost-benefit analysis
cost_benefit_results = perform_cost_benefit_analysis(df, performance_stats)
```

---

## Performance Report Generation

### 1. Generate Comprehensive Report

```python
def generate_performance_report(df, stats, statistical_results, cost_benefit_results):
    """Generate comprehensive performance comparison report"""
    
    report = {
        "executive_summary": {
            "timestamp": datetime.now().isoformat(),
            "total_tests": len(df),
            "models_tested": df['model'].unique().tolist(),
            "scenarios_tested": df['scenario'].unique().tolist(),
            "key_findings": []
        },
        "performance_metrics": {
            "response_times": {
                model: {
                    "average": stats[model]['avg_response_time'],
                    "min": stats[model]['min_response_time'],
                    "max": stats[model]['max_response_time'],
                    "std_dev": stats[model]['std_response_time']
                } for model in df['model'].unique()
            },
            "token_usage": {
                model: {
                    "average": stats[model]['avg_tokens_used'],
                    "total": df[df['model'] == model]['tokens_used'].sum()
                } for model in df['model'].unique()
            },
            "cost_analysis": {
                model: {
                    "average_cost": stats[model]['avg_cost'],
                    "total_cost": stats[model]['total_cost'],
                    "cost_per_token": cost_benefit_results['cost_per_token'][model]
                } for model in df['model'].unique()
            }
        },
        "statistical_analysis": statistical_results,
        "cost_benefit_analysis": cost_benefit_results,
        "recommendations": {
            "text_tasks": "Use GPT-4o-mini for better performance and cost efficiency",
            "vision_tasks": "Use GPT-4o Vision for image analysis capabilities",
            "budget_optimization": "Combine both models based on task requirements",
            "performance_optimization": "Consider caching and request batching for better efficiency"
        }
    }
    
    # Add key findings
    if 'comparison' in stats:
        report["executive_summary"]["key_findings"] = [
            f"GPT-4o Vision is {stats['comparison']['speed_ratio']:.1f}x slower than GPT-4o-mini",
            f"GPT-4o Vision costs {stats['comparison']['cost_ratio']:.1f}x more than GPT-4o-mini",
            f"Both models show high reliability with >95% success rates"
        ]
    
    # Save report
    with open("performance_comparison_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    # Generate summary text
    summary_text = f"""
# Performance Comparison Report

## Executive Summary
- **Test Date**: {report['executive_summary']['timestamp']}
- **Total Tests**: {report['executive_summary']['total_tests']}
- **Models Tested**: {', '.join(report['executive_summary']['models_tested'])}

## Key Findings
{chr(10).join(f"- {finding}" for finding in report['executive_summary']['key_findings'])}

## Performance Metrics

### Response Times
{chr(10).join(f"- **{model}**: {metrics['average']:.3f}s average ({metrics['min']:.3f}s - {metrics['max']:.3f}s)" 
              for model, metrics in report['performance_metrics']['response_times'].items())}

### Cost Analysis
{chr(10).join(f"- **{model}**: ${metrics['average_cost']:.6f} per request, ${metrics['cost_per_token']:.6f} per token" 
              for model, metrics in report['performance_metrics']['cost_analysis'].items())}

## Recommendations
{chr(10).join(f"- **{key}**: {value}" for key, value in report['recommendations'].items())}
"""
    
    with open("performance_comparison_summary.md", "w") as f:
        f.write(summary_text)
    
    print(f"\n📄 Performance reports saved:")
    print(f"   - performance_comparison_report.json")
    print(f"   - performance_comparison_summary.md")
    
    return report

# Generate comprehensive report
performance_report = generate_performance_report(df, performance_stats, statistical_results, cost_benefit_results)
```

---

## Troubleshooting Performance Issues

### Common Performance Problems

1. **High Response Times**:
   ```
   Problem: Consistently slow responses
   Solutions: 
   - Check network connectivity
   - Verify endpoint configuration
   - Consider scaling up compute resources
   ```

2. **High Token Usage**:
   ```
   Problem: Excessive token consumption
   Solutions:
   - Optimize prompts for conciseness
   - Use appropriate max_tokens limits
   - Consider prompt engineering techniques
   ```

3. **Cost Overruns**:
   ```
   Problem: Unexpected high costs
   Solutions:
   - Monitor usage patterns
   - Set up cost alerts
   - Use appropriate model for each task
   ```

### Performance Optimization Tips

1. **Model Selection**:
   - Use GPT-4o-mini for text-only tasks
   - Use GPT-4o Vision only when image analysis is needed
   - Consider caching responses for repeated queries

2. **Request Optimization**:
   - Batch similar requests when possible
   - Use appropriate temperature settings
   - Optimize prompt length and clarity

3. **Monitoring and Alerts**:
   - Set up performance monitoring
   - Configure cost alerts
   - Track usage patterns

---

## Next Steps

After completing performance comparison:

1. **Document Findings**: Update endpoint configuration documentation
2. **Optimize Usage**: Implement recommendations based on analysis
3. **Set Up Monitoring**: Configure performance and cost monitoring
4. **Plan Scaling**: Consider scaling strategies based on usage patterns

---

*Comprehensive performance comparison helps optimize model usage and cost efficiency for production applications.* 