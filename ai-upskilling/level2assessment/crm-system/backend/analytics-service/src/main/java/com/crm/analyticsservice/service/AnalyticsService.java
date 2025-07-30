package com.crm.analyticsservice.service;

import com.crm.analyticsservice.entity.AnalyticsReport;
import com.crm.analyticsservice.repository.AnalyticsReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsReportRepository analyticsReportRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private AIAnalyticsService aiAnalyticsService;

    // ========== AI-POWERED ANALYTICS ==========

    public Map<String, Object> analyzeSalesTrends(List<Map<String, Object>> salesData) {
        return aiAnalyticsService.analyzeSalesTrends(salesData);
    }

    public Map<String, List<Map<String, Object>>> segmentCustomers(List<Map<String, Object>> customerData) {
        return aiAnalyticsService.segmentCustomers(customerData);
    }

    public Map<String, Object> predictChurn(Map<String, Object> customerData) {
        return aiAnalyticsService.predictChurn(customerData);
    }

    public Map<String, Object> forecastRevenue(List<Map<String, Object>> historicalData) {
        return aiAnalyticsService.forecastRevenue(historicalData);
    }

    public Map<String, Object> analyzePerformance(List<Map<String, Object>> performanceData) {
        return aiAnalyticsService.analyzePerformance(performanceData);
    }

    public Map<String, Object> analyzeMarketTrends(List<Map<String, Object>> marketData) {
        return aiAnalyticsService.analyzeMarketTrends(marketData);
    }

    // ========== REPORT MANAGEMENT ==========

    public List<AnalyticsReport> getAllReports() {
        return analyticsReportRepository.findAll();
    }

    public Optional<AnalyticsReport> getReportById(Long id) {
        return analyticsReportRepository.findById(id);
    }

    public AnalyticsReport createReport(AnalyticsReport report) {
        // Set AI-generated flag and confidence score
        report.setAiGenerated(true);
        report.setConfidenceScore(calculateReportConfidence(report));
        report.setDataPointsAnalyzed(estimateDataPoints(report));
        
        return analyticsReportRepository.save(report);
    }

    public AnalyticsReport updateReport(Long id, AnalyticsReport reportDetails) {
        Optional<AnalyticsReport> reportOpt = analyticsReportRepository.findById(id);
        if (reportOpt.isPresent()) {
            AnalyticsReport report = reportOpt.get();
            report.setTitle(reportDetails.getTitle());
            report.setDescription(reportDetails.getDescription());
            report.setInsights(reportDetails.getInsights());
            report.setRecommendations(reportDetails.getRecommendations());
            report.setIsPublic(reportDetails.getIsPublic());
            report.setMetadata(reportDetails.getMetadata());
            
            // Recalculate confidence score
            report.setConfidenceScore(calculateReportConfidence(report));
            
            return analyticsReportRepository.save(report);
        }
        return null;
    }

    public void deleteReport(Long id) {
        analyticsReportRepository.deleteById(id);
    }

    // ========== AI-POWERED REPORT FEATURES ==========

    @Cacheable(value = "aiGeneratedReports", key = "#reportType")
    public List<AnalyticsReport> getAIReportsByType(String reportType) {
        return analyticsReportRepository.findByReportTypeAndAiGeneratedTrue(reportType);
    }

    public List<AnalyticsReport> getHighConfidenceReports(Double minConfidence) {
        return analyticsReportRepository.findByConfidenceScoreGreaterThanOrderByConfidenceScoreDesc(minConfidence);
    }

    public List<AnalyticsReport> getRecentReports(LocalDateTime since) {
        return analyticsReportRepository.findByCreatedAtAfterOrderByCreatedAtDesc(since);
    }

    // ========== ADVANCED ANALYTICS ==========

    public CompletableFuture<Map<String, Object>> generateComprehensiveReportAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> report = new java.util.HashMap<>();
            
            // Generate comprehensive analytics
            report.put("totalReports", analyticsReportRepository.count());
            report.put("aiGeneratedReports", analyticsReportRepository.countByAiGeneratedTrue());
            report.put("averageConfidence", analyticsReportRepository.getAverageConfidenceScore());
            report.put("topReportTypes", analyticsReportRepository.getTopReportTypes());
            
            return report;
        });
    }

    public CompletableFuture<Map<String, Object>> generateExecutiveDashboardAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> dashboard = new java.util.HashMap<>();
            
            // Executive-level metrics
            dashboard.put("totalAnalytics", analyticsReportRepository.count());
            dashboard.put("aiInsights", analyticsReportRepository.countByAiGeneratedTrue());
            dashboard.put("publicReports", analyticsReportRepository.countByIsPublicTrue());
            dashboard.put("recentActivity", analyticsReportRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7)));
            
            return dashboard;
        });
    }

    // ========== PREDICTIVE ANALYTICS ==========

    public Map<String, Object> predictBusinessOutcomes(List<Map<String, Object>> businessData) {
        Map<String, Object> predictions = new java.util.HashMap<>();
        
        // Sales prediction
        if (businessData.stream().anyMatch(data -> data.containsKey("sales"))) {
            List<Map<String, Object>> salesData = businessData.stream()
                    .filter(data -> data.containsKey("sales"))
                    .collect(java.util.stream.Collectors.toList());
            predictions.put("salesPrediction", aiAnalyticsService.analyzeSalesTrends(salesData));
        }
        
        // Customer behavior prediction
        if (businessData.stream().anyMatch(data -> data.containsKey("customerBehavior"))) {
            List<Map<String, Object>> customerData = businessData.stream()
                    .filter(data -> data.containsKey("customerBehavior"))
                    .collect(java.util.stream.Collectors.toList());
            predictions.put("customerSegments", aiAnalyticsService.segmentCustomers(customerData));
        }
        
        // Market opportunity prediction
        if (businessData.stream().anyMatch(data -> data.containsKey("marketData"))) {
            List<Map<String, Object>> marketData = businessData.stream()
                    .filter(data -> data.containsKey("marketData"))
                    .collect(java.util.stream.Collectors.toList());
            predictions.put("marketOpportunities", aiAnalyticsService.analyzeMarketTrends(marketData));
        }
        
        return predictions;
    }

    // ========== REAL-TIME ANALYTICS ==========

    public Map<String, Object> getRealTimeMetrics() {
        Map<String, Object> metrics = new java.util.HashMap<>();
        
        // Real-time calculations
        metrics.put("totalReports", analyticsReportRepository.count());
        metrics.put("aiGeneratedCount", analyticsReportRepository.countByAiGeneratedTrue());
        metrics.put("averageConfidence", analyticsReportRepository.getAverageConfidenceScore());
        metrics.put("recentReports", analyticsReportRepository.countByCreatedAtAfter(LocalDateTime.now().minusHours(24)));
        
        return metrics;
    }

    // ========== CACHE MANAGEMENT ==========

    public void clearAnalyticsCache() {
        redisTemplate.delete("aiGeneratedReports");
    }

    // ========== BULK OPERATIONS ==========

    public List<AnalyticsReport> createReports(List<AnalyticsReport> reports) {
        reports.forEach(report -> {
            report.setAiGenerated(true);
            report.setConfidenceScore(calculateReportConfidence(report));
            report.setDataPointsAnalyzed(estimateDataPoints(report));
        });
        return analyticsReportRepository.saveAll(reports);
    }

    // ========== HELPER METHODS ==========

    private Double calculateReportConfidence(AnalyticsReport report) {
        // Calculate confidence based on report characteristics
        double confidence = 0.5; // Base confidence
        
        // Adjust based on data points
        if (report.getDataPointsAnalyzed() != null) {
            if (report.getDataPointsAnalyzed() > 1000) confidence += 0.3;
            else if (report.getDataPointsAnalyzed() > 500) confidence += 0.2;
            else if (report.getDataPointsAnalyzed() > 100) confidence += 0.1;
        }
        
        // Adjust based on report type
        if ("SALES_TREND".equals(report.getReportType())) confidence += 0.1;
        if ("CUSTOMER_SEGMENTATION".equals(report.getReportType())) confidence += 0.1;
        if ("CHURN_PREDICTION".equals(report.getReportType())) confidence += 0.1;
        
        // Add some randomness to simulate AI confidence
        confidence += Math.random() * 0.1;
        
        return Math.min(1.0, confidence);
    }

    private Integer estimateDataPoints(AnalyticsReport report) {
        // Estimate data points based on report type
        switch (report.getReportType()) {
            case "SALES_TREND":
                return 500 + (int)(Math.random() * 500);
            case "CUSTOMER_SEGMENTATION":
                return 1000 + (int)(Math.random() * 1000);
            case "CHURN_PREDICTION":
                return 300 + (int)(Math.random() * 300);
            case "PERFORMANCE_ANALYSIS":
                return 200 + (int)(Math.random() * 200);
            case "MARKET_ANALYSIS":
                return 400 + (int)(Math.random() * 400);
            default:
                return 100 + (int)(Math.random() * 100);
        }
    }

    // ========== ADVANCED SEARCH ==========

    public List<AnalyticsReport> advancedReportSearch(String reportType, Double minConfidence, Boolean aiGenerated) {
        List<AnalyticsReport> allReports = analyticsReportRepository.findAll();
        
        return allReports.stream()
                .filter(report -> reportType == null || reportType.equals(report.getReportType()))
                .filter(report -> minConfidence == null || (report.getConfidenceScore() != null && 
                        report.getConfidenceScore() >= minConfidence))
                .filter(report -> aiGenerated == null || aiGenerated.equals(report.getAiGenerated()))
                .collect(java.util.stream.Collectors.toList());
    }
} 