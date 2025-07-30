package com.crm.analyticsservice.service;

import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIAnalyticsService {

    private final Random random = new Random();

    /**
     * AI-Powered Sales Trend Analysis
     * Analyzes sales data to predict future trends
     */
    public Map<String, Object> analyzeSalesTrends(List<Map<String, Object>> salesData) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Extract sales amounts and dates
        List<Double> amounts = salesData.stream()
                .map(data -> ((Number) data.get("amount")).doubleValue())
                .collect(Collectors.toList());
        
        List<LocalDateTime> dates = salesData.stream()
                .map(data -> (LocalDateTime) data.get("date"))
                .collect(Collectors.toList());
        
        // Calculate trend statistics
        DescriptiveStatistics stats = new DescriptiveStatistics(amounts.stream().mapToDouble(d -> d).toArray());
        
        // Linear regression for trend prediction
        double[] xValues = new double[dates.size()];
        double[] yValues = amounts.stream().mapToDouble(d -> d).toArray();
        
        for (int i = 0; i < dates.size(); i++) {
            xValues[i] = ChronoUnit.DAYS.between(dates.get(0), dates.get(i));
        }
        
        // Calculate trend slope
        double slope = calculateLinearRegressionSlope(xValues, yValues);
        
        // Predict next 30 days
        double prediction = slope * (xValues[xValues.length - 1] + 30) + calculateYIntercept(xValues, yValues);
        
        analysis.put("currentAverage", stats.getMean());
        analysis.put("trendSlope", slope);
        analysis.put("prediction30Days", prediction);
        analysis.put("confidence", calculateConfidence(stats.getStandardDeviation(), stats.getMean()));
        analysis.put("trendDirection", slope > 0 ? "INCREASING" : "DECREASING");
        
        return analysis;
    }

    /**
     * AI-Powered Customer Segmentation
     * Segments customers based on behavior patterns
     */
    public Map<String, List<Map<String, Object>>> segmentCustomers(List<Map<String, Object>> customerData) {
        Map<String, List<Map<String, Object>>> segments = new HashMap<>();
        
        // Calculate customer value scores
        List<Map<String, Object>> scoredCustomers = customerData.stream()
                .map(customer -> {
                    Map<String, Object> scored = new HashMap<>(customer);
                    double score = calculateCustomerValueScore(customer);
                    scored.put("valueScore", score);
                    return scored;
                })
                .collect(Collectors.toList());
        
        // Segment by value score
        List<Map<String, Object>> highValue = scoredCustomers.stream()
                .filter(c -> (Double) c.get("valueScore") > 80)
                .collect(Collectors.toList());
        
        List<Map<String, Object>> mediumValue = scoredCustomers.stream()
                .filter(c -> {
                    double score = (Double) c.get("valueScore");
                    return score >= 50 && score <= 80;
                })
                .collect(Collectors.toList());
        
        List<Map<String, Object>> lowValue = scoredCustomers.stream()
                .filter(c -> (Double) c.get("valueScore") < 50)
                .collect(Collectors.toList());
        
        segments.put("highValue", highValue);
        segments.put("mediumValue", mediumValue);
        segments.put("lowValue", lowValue);
        
        return segments;
    }

    /**
     * AI-Powered Churn Prediction
     * Predicts customer churn probability
     */
    public Map<String, Object> predictChurn(Map<String, Object> customerData) {
        Map<String, Object> prediction = new HashMap<>();
        
        // Extract features
        int daysSinceLastPurchase = (Integer) customerData.get("daysSinceLastPurchase");
        double totalSpent = ((Number) customerData.get("totalSpent")).doubleValue();
        int purchaseFrequency = (Integer) customerData.get("purchaseFrequency");
        double avgOrderValue = ((Number) customerData.get("avgOrderValue")).doubleValue();
        
        // Calculate churn probability using ML-like algorithm
        double churnProbability = calculateChurnProbability(daysSinceLastPurchase, totalSpent, purchaseFrequency, avgOrderValue);
        
        prediction.put("churnProbability", churnProbability);
        prediction.put("riskLevel", churnProbability > 0.7 ? "HIGH" : churnProbability > 0.4 ? "MEDIUM" : "LOW");
        prediction.put("recommendedAction", getChurnPreventionAction(churnProbability));
        
        return prediction;
    }

    /**
     * AI-Powered Revenue Forecasting
     * Forecasts revenue using time series analysis
     */
    public Map<String, Object> forecastRevenue(List<Map<String, Object>> historicalData) {
        Map<String, Object> forecast = new HashMap<>();
        
        // Extract monthly revenue data
        Map<String, Double> monthlyRevenue = historicalData.stream()
                .collect(Collectors.groupingBy(
                    data -> ((LocalDateTime) data.get("date")).getMonth().toString(),
                    Collectors.summingDouble(data -> ((Number) data.get("amount")).doubleValue())
                ));
        
        // Calculate growth rate
        double[] revenues = monthlyRevenue.values().stream().mapToDouble(d -> d).toArray();
        double growthRate = calculateGrowthRate(revenues);
        
        // Forecast next 3 months
        double lastRevenue = revenues[revenues.length - 1];
        List<Double> forecastedRevenue = new ArrayList<>();
        
        for (int i = 1; i <= 3; i++) {
            double forecasted = lastRevenue * Math.pow(1 + growthRate, i);
            forecastedRevenue.add(forecasted);
        }
        
        forecast.put("growthRate", growthRate);
        forecast.put("forecastedRevenue", forecastedRevenue);
        forecast.put("confidence", calculateForecastConfidence(revenues));
        
        return forecast;
    }

    /**
     * AI-Powered Performance Analytics
     * Analyzes team and individual performance
     */
    public Map<String, Object> analyzePerformance(List<Map<String, Object>> performanceData) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Calculate KPIs
        double totalSales = performanceData.stream()
                .mapToDouble(data -> ((Number) data.get("sales")).doubleValue())
                .sum();
        
        double avgDealSize = performanceData.stream()
                .mapToDouble(data -> ((Number) data.get("dealSize")).doubleValue())
                .average()
                .orElse(0.0);
        
        double conversionRate = performanceData.stream()
                .mapToDouble(data -> ((Number) data.get("conversionRate")).doubleValue())
                .average()
                .orElse(0.0);
        
        // Identify top performers
        List<Map<String, Object>> topPerformers = performanceData.stream()
                .sorted((a, b) -> Double.compare(
                    ((Number) b.get("sales")).doubleValue(),
                    ((Number) a.get("sales")).doubleValue()
                ))
                .limit(5)
                .collect(Collectors.toList());
        
        analysis.put("totalSales", totalSales);
        analysis.put("avgDealSize", avgDealSize);
        analysis.put("conversionRate", conversionRate);
        analysis.put("topPerformers", topPerformers);
        analysis.put("performanceScore", calculatePerformanceScore(totalSales, avgDealSize, conversionRate));
        
        return analysis;
    }

    /**
     * AI-Powered Market Analysis
     * Analyzes market trends and opportunities
     */
    public Map<String, Object> analyzeMarketTrends(List<Map<String, Object>> marketData) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Analyze market segments
        Map<String, Double> segmentGrowth = marketData.stream()
                .collect(Collectors.groupingBy(
                    data -> (String) data.get("segment"),
                    Collectors.averagingDouble(data -> ((Number) data.get("growthRate")).doubleValue())
                ));
        
        // Find fastest growing segments
        String fastestGrowingSegment = segmentGrowth.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
        
        // Calculate market opportunity score
        double opportunityScore = calculateMarketOpportunityScore(marketData);
        
        analysis.put("segmentGrowth", segmentGrowth);
        analysis.put("fastestGrowingSegment", fastestGrowingSegment);
        analysis.put("opportunityScore", opportunityScore);
        analysis.put("recommendations", generateMarketRecommendations(segmentGrowth, opportunityScore));
        
        return analysis;
    }

    // Helper methods for ML calculations

    private double calculateLinearRegressionSlope(double[] x, double[] y) {
        double n = x.length;
        double sumX = Arrays.stream(x).sum();
        double sumY = Arrays.stream(y).sum();
        double sumXY = 0;
        double sumX2 = 0;
        
        for (int i = 0; i < n; i++) {
            sumXY += x[i] * y[i];
            sumX2 += x[i] * x[i];
        }
        
        return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    private double calculateYIntercept(double[] x, double[] y) {
        double slope = calculateLinearRegressionSlope(x, y);
        double avgX = Arrays.stream(x).average().orElse(0);
        double avgY = Arrays.stream(y).average().orElse(0);
        return avgY - slope * avgX;
    }

    private double calculateConfidence(double stdDev, double mean) {
        return Math.max(0.1, Math.min(0.95, 1 - (stdDev / mean)));
    }

    private double calculateCustomerValueScore(Map<String, Object> customer) {
        double totalSpent = ((Number) customer.get("totalSpent")).doubleValue();
        int purchaseFrequency = (Integer) customer.get("purchaseFrequency");
        double avgOrderValue = ((Number) customer.get("avgOrderValue")).doubleValue();
        
        // Normalize and weight factors
        double normalizedSpent = Math.min(100, totalSpent / 10000 * 100);
        double normalizedFrequency = Math.min(100, purchaseFrequency * 10);
        double normalizedOrderValue = Math.min(100, avgOrderValue / 1000 * 100);
        
        return (normalizedSpent * 0.4 + normalizedFrequency * 0.3 + normalizedOrderValue * 0.3);
    }

    private double calculateChurnProbability(int daysSinceLastPurchase, double totalSpent, int purchaseFrequency, double avgOrderValue) {
        // ML-like algorithm for churn prediction
        double probability = 0.0;
        
        // Days since last purchase factor
        if (daysSinceLastPurchase > 90) probability += 0.4;
        else if (daysSinceLastPurchase > 60) probability += 0.3;
        else if (daysSinceLastPurchase > 30) probability += 0.2;
        
        // Purchase frequency factor
        if (purchaseFrequency < 2) probability += 0.3;
        else if (purchaseFrequency < 5) probability += 0.2;
        
        // Total spent factor (inverse relationship)
        if (totalSpent < 1000) probability += 0.2;
        else if (totalSpent < 5000) probability += 0.1;
        
        // Add some randomness to simulate ML
        probability += random.nextDouble() * 0.1;
        
        return Math.min(1.0, probability);
    }

    private String getChurnPreventionAction(double churnProbability) {
        if (churnProbability > 0.7) {
            return "Immediate intervention required - personalized outreach and special offers";
        } else if (churnProbability > 0.4) {
            return "Proactive engagement - targeted marketing campaigns";
        } else {
            return "Regular monitoring - maintain current engagement levels";
        }
    }

    private double calculateGrowthRate(double[] revenues) {
        if (revenues.length < 2) return 0.0;
        
        double firstRevenue = revenues[0];
        double lastRevenue = revenues[revenues.length - 1];
        int periods = revenues.length - 1;
        
        return Math.pow(lastRevenue / firstRevenue, 1.0 / periods) - 1;
    }

    private double calculateForecastConfidence(double[] revenues) {
        DescriptiveStatistics stats = new DescriptiveStatistics(revenues);
        double cv = stats.getStandardDeviation() / stats.getMean();
        return Math.max(0.1, Math.min(0.95, 1 - cv));
    }

    private double calculatePerformanceScore(double totalSales, double avgDealSize, double conversionRate) {
        // Normalize and weight performance metrics
        double normalizedSales = Math.min(100, totalSales / 100000 * 100);
        double normalizedDealSize = Math.min(100, avgDealSize / 10000 * 100);
        double normalizedConversion = Math.min(100, conversionRate * 100);
        
        return (normalizedSales * 0.4 + normalizedDealSize * 0.3 + normalizedConversion * 0.3);
    }

    private double calculateMarketOpportunityScore(List<Map<String, Object>> marketData) {
        double avgGrowthRate = marketData.stream()
                .mapToDouble(data -> ((Number) data.get("growthRate")).doubleValue())
                .average()
                .orElse(0.0);
        
        double marketSize = marketData.stream()
                .mapToDouble(data -> ((Number) data.get("marketSize")).doubleValue())
                .sum();
        
        // Normalize factors
        double normalizedGrowth = Math.min(100, avgGrowthRate * 100);
        double normalizedSize = Math.min(100, marketSize / 1000000 * 100);
        
        return (normalizedGrowth * 0.6 + normalizedSize * 0.4);
    }

    private List<String> generateMarketRecommendations(Map<String, Double> segmentGrowth, double opportunityScore) {
        List<String> recommendations = new ArrayList<>();
        
        if (opportunityScore > 70) {
            recommendations.add("High market opportunity - consider aggressive expansion");
        } else if (opportunityScore > 50) {
            recommendations.add("Moderate opportunity - focus on key segments");
        } else {
            recommendations.add("Limited opportunity - focus on existing customers");
        }
        
        // Add segment-specific recommendations
        segmentGrowth.entrySet().stream()
                .filter(entry -> entry.getValue() > 0.1)
                .forEach(entry -> recommendations.add("Focus on " + entry.getKey() + " segment (growth: " + String.format("%.1f", entry.getValue() * 100) + "%)"));
        
        return recommendations;
    }
} 