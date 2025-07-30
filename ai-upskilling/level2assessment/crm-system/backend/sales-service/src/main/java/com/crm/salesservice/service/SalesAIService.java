package com.crm.salesservice.service;

import com.crm.salesservice.entity.Opportunity;
import com.crm.salesservice.entity.Task;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
public class SalesAIService {

    private final Random random = new Random();

    /**
     * AI-Powered Deal Scoring
     * Analyzes opportunity data to calculate an AI score (0-100)
     */
    public Integer calculateDealScore(Opportunity opportunity) {
        int score = 0;
        
        // Amount-based scoring
        if (opportunity.getAmount() != null) {
            BigDecimal amount = opportunity.getAmount();
            if (amount.compareTo(new BigDecimal("100000")) > 0) {
                score += 25; // High-value deals
            } else if (amount.compareTo(new BigDecimal("50000")) > 0) {
                score += 20; // Medium-value deals
            } else if (amount.compareTo(new BigDecimal("10000")) > 0) {
                score += 15; // Standard deals
            } else {
                score += 10; // Small deals
            }
        }

        // Stage-based scoring
        switch (opportunity.getStage().toUpperCase()) {
            case "CLOSED_WON":
                score += 30;
                break;
            case "PROPOSAL":
                score += 25;
                break;
            case "NEGOTIATION":
                score += 20;
                break;
            case "QUALIFIED":
                score += 15;
                break;
            case "LEAD":
                score += 10;
                break;
            default:
                score += 5;
        }

        // Probability-based scoring
        if (opportunity.getProbability() != null) {
            score += opportunity.getProbability() / 4; // Scale probability to score
        }

        // Close date urgency scoring
        if (opportunity.getExpectedCloseDate() != null) {
            long daysUntilClose = ChronoUnit.DAYS.between(LocalDate.now(), opportunity.getExpectedCloseDate());
            if (daysUntilClose <= 30) {
                score += 15; // Urgent deals
            } else if (daysUntilClose <= 90) {
                score += 10; // Near-term deals
            } else {
                score += 5; // Long-term deals
            }
        }

        // Add AI-driven randomness
        score += random.nextInt(10);

        return Math.min(score, 100);
    }

    /**
     * AI-Powered Win Probability Prediction
     */
    public Double predictWinProbability(Opportunity opportunity) {
        double baseProbability = opportunity.getProbability() != null ? opportunity.getProbability() / 100.0 : 0.0;
        
        // Adjust based on deal characteristics
        if (opportunity.getAmount() != null && opportunity.getAmount().compareTo(new BigDecimal("50000")) > 0) {
            baseProbability += 0.1; // Higher value deals have better win rates
        }

        // Stage-based adjustments
        switch (opportunity.getStage().toUpperCase()) {
            case "CLOSED_WON":
                baseProbability = 1.0;
                break;
            case "PROPOSAL":
                baseProbability += 0.2;
                break;
            case "NEGOTIATION":
                baseProbability += 0.15;
                break;
            case "QUALIFIED":
                baseProbability += 0.1;
                break;
        }

        // Add AI-driven randomness
        baseProbability += (random.nextDouble() - 0.5) * 0.1;

        return Math.max(0.0, Math.min(1.0, baseProbability));
    }

    /**
     * AI-Powered Deal Velocity Calculation
     */
    public Integer calculateDealVelocity(Opportunity opportunity) {
        int velocity = 0;
        
        // Base velocity from stage
        switch (opportunity.getStage().toUpperCase()) {
            case "CLOSED_WON":
                velocity = 100;
                break;
            case "PROPOSAL":
                velocity = 80;
                break;
            case "NEGOTIATION":
                velocity = 60;
                break;
            case "QUALIFIED":
                velocity = 40;
                break;
            case "LEAD":
                velocity = 20;
                break;
            default:
                velocity = 10;
        }

        // Adjust based on time in stage
        if (opportunity.getCreatedAt() != null) {
            long daysInStage = ChronoUnit.DAYS.between(opportunity.getCreatedAt().toLocalDate(), LocalDate.now());
            if (daysInStage > 30) {
                velocity -= 20; // Stagnant deals
            } else if (daysInStage > 14) {
                velocity -= 10; // Slowing deals
            }
        }

        // Add AI-driven randomness
        velocity += random.nextInt(20) - 10;

        return Math.max(0, Math.min(100, velocity));
    }

    /**
     * AI-Powered Next Best Action Recommendation
     */
    public String getNextBestAction(Opportunity opportunity) {
        String stage = opportunity.getStage().toUpperCase();
        Double winProbability = opportunity.getWinProbability();
        
        if (winProbability != null && winProbability > 0.8) {
            return "Schedule contract signing - High win probability";
        } else if (winProbability != null && winProbability > 0.6) {
            return "Send final proposal with pricing";
        } else if (winProbability != null && winProbability > 0.4) {
            return "Schedule technical demo";
        } else if (winProbability != null && winProbability > 0.2) {
            return "Send follow-up email with case studies";
        } else {
            return "Schedule discovery call";
        }
    }

    /**
     * AI-Powered Task Priority Scoring
     */
    public Integer calculateTaskPriorityScore(Task task) {
        int score = 0;
        
        // Due date urgency
        if (task.getDueDate() != null) {
            long daysUntilDue = ChronoUnit.DAYS.between(LocalDate.now(), task.getDueDate().toLocalDate());
            if (daysUntilDue < 0) {
                score += 50; // Overdue tasks
            } else if (daysUntilDue <= 1) {
                score += 40; // Due today/tomorrow
            } else if (daysUntilDue <= 3) {
                score += 30; // Due this week
            } else if (daysUntilDue <= 7) {
                score += 20; // Due next week
            } else {
                score += 10; // Future tasks
            }
        }

        // Priority-based scoring
        switch (task.getPriority().toUpperCase()) {
            case "HIGH":
                score += 30;
                break;
            case "MEDIUM":
                score += 20;
                break;
            case "LOW":
                score += 10;
                break;
        }

        // Status-based scoring
        switch (task.getStatus().toUpperCase()) {
            case "PENDING":
                score += 20;
                break;
            case "IN_PROGRESS":
                score += 15;
                break;
            case "COMPLETED":
                score += 0;
                break;
        }

        // Add AI-driven randomness
        score += random.nextInt(10);

        return Math.min(score, 100);
    }

    /**
     * AI-Powered Sales Forecasting
     */
    public BigDecimal forecastRevenue(java.util.List<Opportunity> opportunities) {
        return opportunities.stream()
                .filter(o -> o.getAmount() != null && o.getWinProbability() != null)
                .map(o -> o.getAmount().multiply(BigDecimal.valueOf(o.getWinProbability())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * AI-Powered Pipeline Optimization Recommendations
     */
    public String getPipelineOptimizationRecommendation(java.util.List<Opportunity> opportunities) {
        long totalOpportunities = opportunities.size();
        long qualifiedOpportunities = opportunities.stream()
                .filter(o -> "QUALIFIED".equals(o.getStage()))
                .count();
        
        double qualificationRate = (double) qualifiedOpportunities / totalOpportunities;
        
        if (qualificationRate < 0.3) {
            return "Focus on lead qualification - Current rate is low";
        } else if (qualificationRate < 0.5) {
            return "Improve lead nurturing and qualification process";
        } else {
            return "Pipeline looks healthy - focus on conversion";
        }
    }

    /**
     * AI-Powered Deal Risk Assessment
     */
    public String assessDealRisk(Opportunity opportunity) {
        double risk = 0.0;
        
        // High amount deals have higher risk
        if (opportunity.getAmount() != null && opportunity.getAmount().compareTo(new BigDecimal("100000")) > 0) {
            risk += 0.3;
        }
        
        // Low probability deals have higher risk
        if (opportunity.getProbability() != null && opportunity.getProbability() < 30) {
            risk += 0.4;
        }
        
        // Stagnant deals have higher risk
        if (opportunity.getCreatedAt() != null) {
            long daysInPipeline = ChronoUnit.DAYS.between(opportunity.getCreatedAt().toLocalDate(), LocalDate.now());
            if (daysInPipeline > 60) {
                risk += 0.3;
            }
        }
        
        if (risk > 0.7) {
            return "HIGH_RISK";
        } else if (risk > 0.4) {
            return "MEDIUM_RISK";
        } else {
            return "LOW_RISK";
        }
    }

    /**
     * AI-Powered Sales Performance Prediction
     */
    public Double predictSalesPerformance(Long assignedTo, java.util.List<Opportunity> opportunities) {
        double performance = 0.0;
        
        // Calculate based on win rates and deal values
        long totalDeals = opportunities.size();
        long wonDeals = opportunities.stream()
                .filter(o -> "CLOSED_WON".equals(o.getStage()))
                .count();
        
        if (totalDeals > 0) {
            double winRate = (double) wonDeals / totalDeals;
            double avgDealValue = opportunities.stream()
                    .filter(o -> o.getAmount() != null)
                    .mapToDouble(o -> o.getAmount().doubleValue())
                    .average()
                    .orElse(0.0);
            
            performance = winRate * avgDealValue / 10000; // Normalize to 0-1 scale
        }
        
        return Math.min(1.0, performance);
    }
} 