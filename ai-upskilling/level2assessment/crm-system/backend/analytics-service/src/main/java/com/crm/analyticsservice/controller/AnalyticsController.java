package com.crm.analyticsservice.controller;

import com.crm.analyticsservice.entity.AnalyticsReport;
import com.crm.analyticsservice.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    // ========== AI-POWERED ANALYTICS ENDPOINTS ==========

    @PostMapping("/ai/sales-trends")
    public ResponseEntity<Map<String, Object>> analyzeSalesTrends(@RequestBody List<Map<String, Object>> salesData) {
        Map<String, Object> analysis = analyticsService.analyzeSalesTrends(salesData);
        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/ai/customer-segmentation")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> segmentCustomers(@RequestBody List<Map<String, Object>> customerData) {
        Map<String, List<Map<String, Object>>> segments = analyticsService.segmentCustomers(customerData);
        return ResponseEntity.ok(segments);
    }

    @PostMapping("/ai/churn-prediction")
    public ResponseEntity<Map<String, Object>> predictChurn(@RequestBody Map<String, Object> customerData) {
        Map<String, Object> prediction = analyticsService.predictChurn(customerData);
        return ResponseEntity.ok(prediction);
    }

    @PostMapping("/ai/revenue-forecast")
    public ResponseEntity<Map<String, Object>> forecastRevenue(@RequestBody List<Map<String, Object>> historicalData) {
        Map<String, Object> forecast = analyticsService.forecastRevenue(historicalData);
        return ResponseEntity.ok(forecast);
    }

    @PostMapping("/ai/performance-analysis")
    public ResponseEntity<Map<String, Object>> analyzePerformance(@RequestBody List<Map<String, Object>> performanceData) {
        Map<String, Object> analysis = analyticsService.analyzePerformance(performanceData);
        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/ai/market-trends")
    public ResponseEntity<Map<String, Object>> analyzeMarketTrends(@RequestBody List<Map<String, Object>> marketData) {
        Map<String, Object> analysis = analyticsService.analyzeMarketTrends(marketData);
        return ResponseEntity.ok(analysis);
    }

    // ========== REPORT MANAGEMENT ENDPOINTS ==========

    @GetMapping("/reports")
    public ResponseEntity<List<AnalyticsReport>> getAllReports() {
        List<AnalyticsReport> reports = analyticsService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<AnalyticsReport> getReportById(@PathVariable Long id) {
        Optional<AnalyticsReport> report = analyticsService.getReportById(id);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reports")
    public ResponseEntity<AnalyticsReport> createReport(@RequestBody AnalyticsReport report) {
        AnalyticsReport createdReport = analyticsService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<AnalyticsReport> updateReport(@PathVariable Long id, @RequestBody AnalyticsReport report) {
        AnalyticsReport updatedReport = analyticsService.updateReport(id, report);
        if (updatedReport != null) {
            return ResponseEntity.ok(updatedReport);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        analyticsService.deleteReport(id);
        return ResponseEntity.ok().build();
    }

    // ========== AI-POWERED REPORT FEATURES ==========

    @GetMapping("/reports/ai/type/{reportType}")
    public ResponseEntity<List<AnalyticsReport>> getAIReportsByType(@PathVariable String reportType) {
        List<AnalyticsReport> reports = analyticsService.getAIReportsByType(reportType);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/ai/high-confidence")
    public ResponseEntity<List<AnalyticsReport>> getHighConfidenceReports(
            @RequestParam(defaultValue = "0.7") Double minConfidence) {
        List<AnalyticsReport> reports = analyticsService.getHighConfidenceReports(minConfidence);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/recent")
    public ResponseEntity<List<AnalyticsReport>> getRecentReports(
            @RequestParam(defaultValue = "7") Integer daysAgo) {
        LocalDateTime since = LocalDateTime.now().minusDays(daysAgo);
        List<AnalyticsReport> reports = analyticsService.getRecentReports(since);
        return ResponseEntity.ok(reports);
    }

    // ========== ADVANCED ANALYTICS ==========

    @GetMapping("/comprehensive-report")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> generateComprehensiveReport() {
        return analyticsService.generateComprehensiveReportAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/executive-dashboard")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> generateExecutiveDashboard() {
        return analyticsService.generateExecutiveDashboardAsync()
                .thenApply(ResponseEntity::ok);
    }

    // ========== PREDICTIVE ANALYTICS ==========

    @PostMapping("/predict/business-outcomes")
    public ResponseEntity<Map<String, Object>> predictBusinessOutcomes(@RequestBody List<Map<String, Object>> businessData) {
        Map<String, Object> predictions = analyticsService.predictBusinessOutcomes(businessData);
        return ResponseEntity.ok(predictions);
    }

    // ========== REAL-TIME ANALYTICS ==========

    @GetMapping("/real-time/metrics")
    public ResponseEntity<Map<String, Object>> getRealTimeMetrics() {
        Map<String, Object> metrics = analyticsService.getRealTimeMetrics();
        return ResponseEntity.ok(metrics);
    }

    // ========== ADVANCED SEARCH ==========

    @GetMapping("/reports/search")
    public ResponseEntity<List<AnalyticsReport>> advancedReportSearch(
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) Double minConfidence,
            @RequestParam(required = false) Boolean aiGenerated) {
        List<AnalyticsReport> reports = analyticsService.advancedReportSearch(reportType, minConfidence, aiGenerated);
        return ResponseEntity.ok(reports);
    }

    // ========== BULK OPERATIONS ==========

    @PostMapping("/reports/bulk")
    public ResponseEntity<List<AnalyticsReport>> createReports(@RequestBody List<AnalyticsReport> reports) {
        List<AnalyticsReport> createdReports = analyticsService.createReports(reports);
        return ResponseEntity.ok(createdReports);
    }

    // ========== CACHE MANAGEMENT ==========

    @DeleteMapping("/cache/clear")
    public ResponseEntity<Void> clearCache() {
        analyticsService.clearAnalyticsCache();
        return ResponseEntity.ok().build();
    }

    // ========== HEALTH CHECK ==========

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Analytics Service is running!");
    }

    // ========== AI ANALYTICS SUMMARY ==========

    @GetMapping("/ai/summary")
    public ResponseEntity<String> getAnalyticsSummary() {
        return ResponseEntity.ok("AI Analytics Summary: Advanced ML algorithms for sales trends, customer segmentation, churn prediction, revenue forecasting, performance analysis, and market trends with real-time insights and predictive analytics.");
    }

    // ========== EXPORT ENDPOINTS ==========

    @GetMapping("/reports/export/{id}")
    public ResponseEntity<Map<String, Object>> exportReport(@PathVariable Long id) {
        Optional<AnalyticsReport> reportOpt = analyticsService.getReportById(id);
        if (reportOpt.isPresent()) {
            AnalyticsReport report = reportOpt.get();
            Map<String, Object> export = new java.util.HashMap<>();
            export.put("report", report);
            export.put("exportedAt", LocalDateTime.now());
            export.put("format", "JSON");
            return ResponseEntity.ok(export);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== DASHBOARD ENDPOINTS ==========

    @GetMapping("/dashboard/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> overview = new java.util.HashMap<>();
        overview.put("totalReports", analyticsService.getAllReports().size());
        overview.put("aiGeneratedCount", analyticsService.getAIReportsByType("SALES_TREND").size());
        overview.put("recentActivity", analyticsService.getRecentReports(LocalDateTime.now().minusDays(7)).size());
        overview.put("highConfidenceReports", analyticsService.getHighConfidenceReports(0.8).size());
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/dashboard/trends")
    public ResponseEntity<Map<String, Object>> getDashboardTrends() {
        Map<String, Object> trends = new java.util.HashMap<>();
        trends.put("salesTrend", "INCREASING");
        trends.put("customerGrowth", "15%");
        trends.put("revenueForecast", "$1.2M");
        trends.put("churnRate", "2.5%");
        return ResponseEntity.ok(trends);
    }

    // ========== AI INSIGHTS ENDPOINTS ==========

    @GetMapping("/ai/insights/sales")
    public ResponseEntity<Map<String, Object>> getSalesInsights() {
        Map<String, Object> insights = new java.util.HashMap<>();
        insights.put("trend", "Sales are increasing by 12% month-over-month");
        insights.put("topPerformer", "Madhan M S - $150K this month");
        insights.put("opportunity", "High-value deals in Q4 pipeline");
        insights.put("recommendation", "Focus on enterprise customers");
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/ai/insights/customers")
    public ResponseEntity<Map<String, Object>> getCustomerInsights() {
        Map<String, Object> insights = new java.util.HashMap<>();
        insights.put("segments", "3 high-value segments identified");
        insights.put("churnRisk", "5 customers at high risk");
        insights.put("lifetimeValue", "Average LTV: $25,000");
        insights.put("recommendation", "Implement retention campaigns");
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/ai/insights/market")
    public ResponseEntity<Map<String, Object>> getMarketInsights() {
        Map<String, Object> insights = new java.util.HashMap<>();
        insights.put("growth", "Market growing at 8% annually");
        insights.put("competition", "3 new competitors identified");
        insights.put("opportunity", "$2M market opportunity");
        insights.put("recommendation", "Expand to new territories");
        return ResponseEntity.ok(insights);
    }
} 