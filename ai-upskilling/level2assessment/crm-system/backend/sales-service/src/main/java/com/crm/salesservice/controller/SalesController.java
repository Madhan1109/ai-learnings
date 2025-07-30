package com.crm.salesservice.controller;

import com.crm.salesservice.entity.Opportunity;
import com.crm.salesservice.entity.Task;
import com.crm.salesservice.service.SalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    @Autowired
    private SalesService salesService;

    // ========== OPPORTUNITY ENDPOINTS ==========

    @GetMapping("/opportunities")
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        List<Opportunity> opportunities = salesService.getAllOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable Long id) {
        Optional<Opportunity> opportunity = salesService.getOpportunityById(id);
        return opportunity.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/opportunities")
    public ResponseEntity<Opportunity> createOpportunity(@RequestBody Opportunity opportunity) {
        Opportunity createdOpportunity = salesService.createOpportunity(opportunity);
        return ResponseEntity.ok(createdOpportunity);
    }

    @PutMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id, @RequestBody Opportunity opportunity) {
        Opportunity updatedOpportunity = salesService.updateOpportunity(id, opportunity);
        if (updatedOpportunity != null) {
            return ResponseEntity.ok(updatedOpportunity);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/opportunities/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable Long id) {
        salesService.deleteOpportunity(id);
        return ResponseEntity.ok().build();
    }

    // ========== AI-POWERED OPPORTUNITY FEATURES ==========

    @GetMapping("/opportunities/ai/high-value")
    public ResponseEntity<List<Opportunity>> getHighValueOpportunities(
            @RequestParam(defaultValue = "70") Integer minScore) {
        List<Opportunity> opportunities = salesService.getHighValueOpportunities(minScore);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/ai/high-win-probability")
    public ResponseEntity<List<Opportunity>> getHighWinProbabilityOpportunities(
            @RequestParam(defaultValue = "0.6") Double minProbability) {
        List<Opportunity> opportunities = salesService.getHighWinProbabilityOpportunities(minProbability);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/ai/high-velocity")
    public ResponseEntity<List<Opportunity>> getHighVelocityDeals(
            @RequestParam(defaultValue = "60") Integer minVelocity) {
        List<Opportunity> opportunities = salesService.getHighVelocityDeals(minVelocity);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/ai/next-best-action/{opportunityId}")
    public ResponseEntity<String> getNextBestAction(@PathVariable Long opportunityId) {
        String recommendation = salesService.getNextBestAction(opportunityId);
        return ResponseEntity.ok(recommendation);
    }

    @GetMapping("/opportunities/ai/risk-assessment/{opportunityId}")
    public ResponseEntity<String> assessDealRisk(@PathVariable Long opportunityId) {
        String risk = salesService.assessDealRisk(opportunityId);
        return ResponseEntity.ok(risk);
    }

    // ========== PIPELINE MANAGEMENT ==========

    @GetMapping("/opportunities/stage/{stage}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByStage(@PathVariable String stage) {
        List<Opportunity> opportunities = salesService.getOpportunitiesByStage(stage);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/customer/{customerId}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByCustomer(@PathVariable Long customerId) {
        List<Opportunity> opportunities = salesService.getOpportunitiesByCustomer(customerId);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/assigned/{assignedTo}")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByAssignedUser(@PathVariable Long assignedTo) {
        List<Opportunity> opportunities = salesService.getOpportunitiesByAssignedUser(assignedTo);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/opportunities/amount-range")
    public ResponseEntity<List<Opportunity>> getOpportunitiesByAmountRange(
            @RequestParam BigDecimal minAmount,
            @RequestParam BigDecimal maxAmount) {
        List<Opportunity> opportunities = salesService.getOpportunitiesByAmountRange(minAmount, maxAmount);
        return ResponseEntity.ok(opportunities);
    }

    // ========== SALES ANALYTICS ==========

    @GetMapping("/analytics/pipeline")
    public CompletableFuture<ResponseEntity<List<Object[]>>> getPipelineAnalytics() {
        return salesService.getPipelineAnalyticsAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/forecasted-revenue")
    public CompletableFuture<ResponseEntity<BigDecimal>> getForecastedRevenue(
            @RequestParam LocalDate startDate) {
        return salesService.getForecastedRevenueAsync(startDate)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/average-ai-score")
    public CompletableFuture<ResponseEntity<Double>> getAverageAiScore() {
        return salesService.getAverageAiScoreAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/pipeline-summary")
    public ResponseEntity<List<Object[]>> getPipelineSummary() {
        List<Object[]> summary = salesService.getPipelineSummary();
        return ResponseEntity.ok(summary);
    }

    // ========== TASK ENDPOINTS ==========

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = salesService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = salesService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = salesService.createTask(task);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = salesService.updateTask(id, task);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        salesService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    // ========== AI-POWERED TASK FEATURES ==========

    @GetMapping("/tasks/ai/high-priority")
    public ResponseEntity<List<Task>> getHighPriorityTasks(
            @RequestParam(defaultValue = "70") Integer minScore) {
        List<Task> tasks = salesService.getHighPriorityTasks(minScore);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/ai/high-priority/user/{assignedTo}")
    public ResponseEntity<List<Task>> getHighPriorityTasksByUser(
            @PathVariable Long assignedTo,
            @RequestParam(defaultValue = "70") Integer minScore) {
        List<Task> tasks = salesService.getHighPriorityTasksByUser(assignedTo, minScore);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        List<Task> tasks = salesService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/due-today")
    public ResponseEntity<List<Task>> getTasksDueToday() {
        List<Task> tasks = salesService.getTasksDueToday();
        return ResponseEntity.ok(tasks);
    }

    // ========== TASK ANALYTICS ==========

    @GetMapping("/analytics/tasks/status")
    public CompletableFuture<ResponseEntity<List<Object[]>>> getTaskStatusAnalytics() {
        return salesService.getTaskStatusAnalyticsAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/tasks/priority")
    public CompletableFuture<ResponseEntity<List<Object[]>>> getTaskPriorityAnalytics() {
        return salesService.getTaskPriorityAnalyticsAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/tasks/average-priority-score/{assignedTo}")
    public CompletableFuture<ResponseEntity<Double>> getAverageAiPriorityScoreByUser(@PathVariable Long assignedTo) {
        return salesService.getAverageAiPriorityScoreByUserAsync(assignedTo)
                .thenApply(ResponseEntity::ok);
    }

    // ========== SALES FORECASTING ==========

    @PostMapping("/forecasting/revenue")
    public ResponseEntity<BigDecimal> forecastRevenue(@RequestBody List<Opportunity> opportunities) {
        BigDecimal forecast = salesService.forecastRevenue(opportunities);
        return ResponseEntity.ok(forecast);
    }

    @PostMapping("/forecasting/pipeline-optimization")
    public ResponseEntity<String> getPipelineOptimizationRecommendation(@RequestBody List<Opportunity> opportunities) {
        String recommendation = salesService.getPipelineOptimizationRecommendation(opportunities);
        return ResponseEntity.ok(recommendation);
    }

    @PostMapping("/forecasting/sales-performance/{assignedTo}")
    public ResponseEntity<Double> predictSalesPerformance(
            @PathVariable Long assignedTo,
            @RequestBody List<Opportunity> opportunities) {
        Double performance = salesService.predictSalesPerformance(assignedTo, opportunities);
        return ResponseEntity.ok(performance);
    }

    // ========== ADVANCED SEARCH ==========

    @GetMapping("/opportunities/advanced-search")
    public ResponseEntity<List<Opportunity>> advancedOpportunitySearch(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) Integer minProbability) {
        List<Opportunity> opportunities = salesService.advancedOpportunitySearch(stage, minAmount, maxAmount, minProbability);
        return ResponseEntity.ok(opportunities);
    }

    // ========== BULK OPERATIONS ==========

    @PostMapping("/opportunities/bulk")
    public ResponseEntity<List<Opportunity>> createOpportunities(@RequestBody List<Opportunity> opportunities) {
        List<Opportunity> createdOpportunities = salesService.createOpportunities(opportunities);
        return ResponseEntity.ok(createdOpportunities);
    }

    @PostMapping("/tasks/bulk")
    public ResponseEntity<List<Task>> createTasks(@RequestBody List<Task> tasks) {
        List<Task> createdTasks = salesService.createTasks(tasks);
        return ResponseEntity.ok(createdTasks);
    }

    // ========== CACHE MANAGEMENT ==========

    @DeleteMapping("/cache/clear")
    public ResponseEntity<Void> clearCache() {
        salesService.clearSalesCache();
        return ResponseEntity.ok().build();
    }

    // ========== HEALTH CHECK ==========

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Sales Service is running!");
    }

    // ========== AI ANALYTICS SUMMARY ==========

    @GetMapping("/ai/analytics-summary")
    public ResponseEntity<String> getAnalyticsSummary() {
        return ResponseEntity.ok("AI Sales Analytics Summary: High-value opportunities identified, win probabilities calculated, deal velocity tracked, and next best actions recommended.");
    }
} 