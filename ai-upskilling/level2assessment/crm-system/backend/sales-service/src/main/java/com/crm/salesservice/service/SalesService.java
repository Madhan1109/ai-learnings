package com.crm.salesservice.service;

import com.crm.salesservice.entity.Opportunity;
import com.crm.salesservice.entity.Task;
import com.crm.salesservice.repository.OpportunityRepository;
import com.crm.salesservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class SalesService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private SalesAIService salesAIService;

    // ========== OPPORTUNITY MANAGEMENT ==========

    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    public Optional<Opportunity> getOpportunityById(Long id) {
        return opportunityRepository.findById(id);
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        // AI-powered scoring and predictions
        opportunity.setAiScore(salesAIService.calculateDealScore(opportunity));
        opportunity.setWinProbability(salesAIService.predictWinProbability(opportunity));
        opportunity.setDealVelocity(salesAIService.calculateDealVelocity(opportunity));
        opportunity.setNextAction(salesAIService.getNextBestAction(opportunity));
        
        return opportunityRepository.save(opportunity);
    }

    public Opportunity updateOpportunity(Long id, Opportunity opportunityDetails) {
        Optional<Opportunity> opportunityOpt = opportunityRepository.findById(id);
        if (opportunityOpt.isPresent()) {
            Opportunity opportunity = opportunityOpt.get();
            opportunity.setTitle(opportunityDetails.getTitle());
            opportunity.setDescription(opportunityDetails.getDescription());
            opportunity.setAmount(opportunityDetails.getAmount());
            opportunity.setStage(opportunityDetails.getStage());
            opportunity.setProbability(opportunityDetails.getProbability());
            opportunity.setExpectedCloseDate(opportunityDetails.getExpectedCloseDate());
            opportunity.setAssignedTo(opportunityDetails.getAssignedTo());
            
            // Recalculate AI metrics
            opportunity.setAiScore(salesAIService.calculateDealScore(opportunity));
            opportunity.setWinProbability(salesAIService.predictWinProbability(opportunity));
            opportunity.setDealVelocity(salesAIService.calculateDealVelocity(opportunity));
            opportunity.setNextAction(salesAIService.getNextBestAction(opportunity));
            
            return opportunityRepository.save(opportunity);
        }
        return null;
    }

    public void deleteOpportunity(Long id) {
        opportunityRepository.deleteById(id);
    }

    // ========== AI-POWERED FEATURES ==========

    @Cacheable(value = "highValueOpportunities", key = "#minScore")
    public List<Opportunity> getHighValueOpportunities(Integer minScore) {
        return opportunityRepository.findHighValueOpportunities(minScore);
    }

    public List<Opportunity> getHighWinProbabilityOpportunities(Double minProbability) {
        return opportunityRepository.findHighWinProbabilityOpportunities(minProbability);
    }

    public List<Opportunity> getHighVelocityDeals(Integer minVelocity) {
        return opportunityRepository.findHighVelocityDeals(minVelocity);
    }

    public String getNextBestAction(Long opportunityId) {
        Optional<Opportunity> opportunityOpt = opportunityRepository.findById(opportunityId);
        if (opportunityOpt.isPresent()) {
            return salesAIService.getNextBestAction(opportunityOpt.get());
        }
        return "No recommendation available";
    }

    public String assessDealRisk(Long opportunityId) {
        Optional<Opportunity> opportunityOpt = opportunityRepository.findById(opportunityId);
        if (opportunityOpt.isPresent()) {
            return salesAIService.assessDealRisk(opportunityOpt.get());
        }
        return "UNKNOWN";
    }

    // ========== PIPELINE MANAGEMENT ==========

    public List<Opportunity> getOpportunitiesByStage(String stage) {
        return opportunityRepository.findByStage(stage);
    }

    public List<Opportunity> getOpportunitiesByCustomer(Long customerId) {
        return opportunityRepository.findByCustomerId(customerId);
    }

    public List<Opportunity> getOpportunitiesByAssignedUser(Long assignedTo) {
        return opportunityRepository.findByAssignedTo(assignedTo);
    }

    public List<Opportunity> getOpportunitiesByAmountRange(BigDecimal minAmount, BigDecimal maxAmount) {
        return opportunityRepository.findByAmountBetween(minAmount, maxAmount);
    }

    // ========== SALES ANALYTICS ==========

    public CompletableFuture<List<Object[]>> getPipelineAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> 
            opportunityRepository.getPipelineAnalytics()
        );
    }

    public CompletableFuture<BigDecimal> getForecastedRevenueAsync(LocalDate startDate) {
        return CompletableFuture.supplyAsync(() -> 
            opportunityRepository.getForecastedRevenue(startDate)
        );
    }

    public CompletableFuture<Double> getAverageAiScoreAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Double avgScore = opportunityRepository.getAverageAiScore();
            return avgScore != null ? avgScore : 0.0;
        });
    }

    public List<Object[]> getPipelineSummary() {
        return opportunityRepository.getPipelineSummary();
    }

    // ========== TASK MANAGEMENT ==========

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        // AI-powered priority scoring
        task.setAiPriorityScore(salesAIService.calculateTaskPriorityScore(task));
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setAssignedTo(taskDetails.getAssignedTo());
            task.setCustomerId(taskDetails.getCustomerId());
            task.setOpportunityId(taskDetails.getOpportunityId());
            task.setDueDate(taskDetails.getDueDate());
            task.setStatus(taskDetails.getStatus());
            task.setPriority(taskDetails.getPriority());
            task.setEstimatedDuration(taskDetails.getEstimatedDuration());
            
            // Recalculate AI priority score
            task.setAiPriorityScore(salesAIService.calculateTaskPriorityScore(task));
            
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // ========== AI-POWERED TASK FEATURES ==========

    public List<Task> getHighPriorityTasks(Integer minScore) {
        return taskRepository.findHighPriorityTasks(minScore);
    }

    public List<Task> getHighPriorityTasksByUser(Long assignedTo, Integer minScore) {
        return taskRepository.findHighPriorityTasksByUser(assignedTo, minScore);
    }

    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBeforeAndStatusNot(LocalDateTime.now(), "COMPLETED");
    }

    public List<Task> getTasksDueToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return taskRepository.findByDueDateBetween(startOfDay, endOfDay);
    }

    // ========== TASK ANALYTICS ==========

    public CompletableFuture<List<Object[]>> getTaskStatusAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> 
            taskRepository.getTaskStatusAnalytics()
        );
    }

    public CompletableFuture<List<Object[]>> getTaskPriorityAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> 
            taskRepository.getTaskPriorityAnalytics()
        );
    }

    public CompletableFuture<Double> getAverageAiPriorityScoreByUserAsync(Long assignedTo) {
        return CompletableFuture.supplyAsync(() -> {
            Double avgScore = taskRepository.getAverageAiPriorityScoreByUser(assignedTo);
            return avgScore != null ? avgScore : 0.0;
        });
    }

    // ========== SALES FORECASTING ==========

    public BigDecimal forecastRevenue(List<Opportunity> opportunities) {
        return salesAIService.forecastRevenue(opportunities);
    }

    public String getPipelineOptimizationRecommendation(List<Opportunity> opportunities) {
        return salesAIService.getPipelineOptimizationRecommendation(opportunities);
    }

    public Double predictSalesPerformance(Long assignedTo, List<Opportunity> opportunities) {
        return salesAIService.predictSalesPerformance(assignedTo, opportunities);
    }

    // ========== CACHE MANAGEMENT ==========

    public void clearSalesCache() {
        redisTemplate.delete("highValueOpportunities");
    }

    // ========== BULK OPERATIONS ==========

    public List<Opportunity> createOpportunities(List<Opportunity> opportunities) {
        opportunities.forEach(opportunity -> {
            opportunity.setAiScore(salesAIService.calculateDealScore(opportunity));
            opportunity.setWinProbability(salesAIService.predictWinProbability(opportunity));
            opportunity.setDealVelocity(salesAIService.calculateDealVelocity(opportunity));
            opportunity.setNextAction(salesAIService.getNextBestAction(opportunity));
        });
        return opportunityRepository.saveAll(opportunities);
    }

    public List<Task> createTasks(List<Task> tasks) {
        tasks.forEach(task -> {
            task.setAiPriorityScore(salesAIService.calculateTaskPriorityScore(task));
        });
        return taskRepository.saveAll(tasks);
    }

    // ========== ADVANCED SEARCH ==========

    public List<Opportunity> advancedOpportunitySearch(String stage, BigDecimal minAmount, BigDecimal maxAmount, Integer minProbability) {
        List<Opportunity> allOpportunities = opportunityRepository.findAll();
        
        return allOpportunities.stream()
                .filter(opportunity -> stage == null || stage.equals(opportunity.getStage()))
                .filter(opportunity -> minAmount == null || (opportunity.getAmount() != null && 
                        opportunity.getAmount().compareTo(minAmount) >= 0))
                .filter(opportunity -> maxAmount == null || (opportunity.getAmount() != null && 
                        opportunity.getAmount().compareTo(maxAmount) <= 0))
                .filter(opportunity -> minProbability == null || (opportunity.getProbability() != null && 
                        opportunity.getProbability() >= minProbability))
                .toList();
    }
} 