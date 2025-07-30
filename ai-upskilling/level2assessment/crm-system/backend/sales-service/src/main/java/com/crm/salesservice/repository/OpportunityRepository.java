package com.crm.salesservice.repository;

import com.crm.salesservice.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    // Find by customer ID
    List<Opportunity> findByCustomerId(Long customerId);

    // Find by stage
    List<Opportunity> findByStage(String stage);

    // Find by assigned user
    List<Opportunity> findByAssignedTo(Long assignedTo);

    // Find by amount range
    List<Opportunity> findByAmountBetween(BigDecimal minAmount, BigDecimal maxAmount);

    // Find by probability range
    List<Opportunity> findByProbabilityBetween(Integer minProbability, Integer maxProbability);

    // Find by expected close date
    List<Opportunity> findByExpectedCloseDateBetween(LocalDate startDate, LocalDate endDate);

    // AI-Powered Queries
    @Query("SELECT o FROM Opportunity o WHERE o.aiScore >= :minScore ORDER BY o.aiScore DESC")
    List<Opportunity> findHighValueOpportunities(@Param("minScore") Integer minScore);

    @Query("SELECT o FROM Opportunity o WHERE o.winProbability >= :minProbability ORDER BY o.winProbability DESC")
    List<Opportunity> findHighWinProbabilityOpportunities(@Param("minProbability") Double minProbability);

    @Query("SELECT o FROM Opportunity o WHERE o.dealVelocity >= :minVelocity ORDER BY o.dealVelocity DESC")
    List<Opportunity> findHighVelocityDeals(@Param("minVelocity") Integer minVelocity);

    // Pipeline Analytics
    @Query("SELECT o.stage, COUNT(o), SUM(o.amount) FROM Opportunity o GROUP BY o.stage")
    List<Object[]> getPipelineAnalytics();

    @Query("SELECT AVG(o.amount) FROM Opportunity o WHERE o.stage = :stage")
    Double getAverageAmountByStage(@Param("stage") String stage);

    @Query("SELECT AVG(o.probability) FROM Opportunity o WHERE o.stage = :stage")
    Double getAverageProbabilityByStage(@Param("stage") String stage);

    // Sales Forecasting
    @Query("SELECT SUM(o.amount * o.probability / 100.0) FROM Opportunity o WHERE o.expectedCloseDate >= :startDate")
    BigDecimal getForecastedRevenue(@Param("startDate") LocalDate startDate);

    @Query("SELECT COUNT(o) FROM Opportunity o WHERE o.expectedCloseDate BETWEEN :startDate AND :endDate")
    Long getOpportunityCountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // AI Score Analytics
    @Query("SELECT AVG(o.aiScore) FROM Opportunity o")
    Double getAverageAiScore();

    @Query("SELECT o FROM Opportunity o WHERE o.aiScore >= :minScore AND o.stage = :stage")
    List<Opportunity> findHighValueOpportunitiesByStage(@Param("minScore") Integer minScore, @Param("stage") String stage);

    // Deal Velocity Analysis
    @Query("SELECT AVG(o.dealVelocity) FROM Opportunity o WHERE o.stage = :stage")
    Double getAverageDealVelocityByStage(@Param("stage") String stage);

    // Win Rate Analysis
    @Query("SELECT AVG(o.winProbability) FROM Opportunity o WHERE o.stage = :stage")
    Double getAverageWinProbabilityByStage(@Param("stage") String stage);

    // Recent Opportunities
    @Query("SELECT o FROM Opportunity o WHERE o.createdAt >= :startDate ORDER BY o.createdAt DESC")
    List<Opportunity> findRecentOpportunities(@Param("startDate") java.time.LocalDateTime startDate);

    // High Value Opportunities by User
    @Query("SELECT o FROM Opportunity o WHERE o.assignedTo = :assignedTo AND o.aiScore >= :minScore ORDER BY o.aiScore DESC")
    List<Opportunity> findHighValueOpportunitiesByUser(@Param("assignedTo") Long assignedTo, @Param("minScore") Integer minScore);

    // Pipeline Summary
    @Query("SELECT o.stage, COUNT(o), SUM(o.amount), AVG(o.probability) FROM Opportunity o GROUP BY o.stage ORDER BY COUNT(o) DESC")
    List<Object[]> getPipelineSummary();
} 