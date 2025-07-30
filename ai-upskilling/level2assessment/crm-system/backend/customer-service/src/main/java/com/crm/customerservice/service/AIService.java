package com.crm.customerservice.service;

import com.crm.customerservice.entity.Customer;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AIService {

    private final Random random = new Random();

    /**
     * AI-Powered Lead Scoring
     * Analyzes customer data to calculate a lead score (0-100)
     */
    public Integer calculateLeadScore(Customer customer) {
        int score = 0;
        
        // Base score from company size (simplified logic)
        if (customer.getCompany() != null) {
            if (customer.getCompany().contains("Corp") || customer.getCompany().contains("Inc")) {
                score += 20;
            } else if (customer.getCompany().contains("LLC") || customer.getCompany().contains("Ltd")) {
                score += 15;
            } else {
                score += 10;
            }
        }

        // Industry-based scoring
        if (customer.getIndustry() != null) {
            switch (customer.getIndustry().toLowerCase()) {
                case "technology":
                case "software":
                    score += 25;
                    break;
                case "finance":
                case "banking":
                    score += 20;
                    break;
                case "healthcare":
                    score += 18;
                    break;
                case "consulting":
                    score += 15;
                    break;
                default:
                    score += 10;
            }
        }

        // Email domain scoring
        if (customer.getEmail() != null) {
            if (customer.getEmail().contains("@gmail.com")) {
                score += 5;
            } else if (customer.getEmail().contains("@") && !customer.getEmail().contains("@gmail.com")) {
                score += 15; // Corporate email
            }
        }

        // Phone number scoring
        if (customer.getPhone() != null && customer.getPhone().length() >= 10) {
            score += 10;
        }

        // Add some randomness to simulate AI learning
        score += random.nextInt(10);

        return Math.min(score, 100);
    }

    /**
     * AI-Powered Sentiment Analysis
     * Analyzes customer communications for sentiment
     */
    public Double analyzeSentiment(String text) {
        if (text == null || text.isEmpty()) {
            return 0.5; // Neutral
        }

        String lowerText = text.toLowerCase();
        double sentiment = 0.5; // Neutral baseline

        // Positive indicators
        if (lowerText.contains("interested") || lowerText.contains("great") || 
            lowerText.contains("excellent") || lowerText.contains("good")) {
            sentiment += 0.3;
        }

        // Negative indicators
        if (lowerText.contains("not interested") || lowerText.contains("bad") || 
            lowerText.contains("expensive") || lowerText.contains("no")) {
            sentiment -= 0.3;
        }

        // Urgency indicators
        if (lowerText.contains("urgent") || lowerText.contains("asap") || 
            lowerText.contains("immediately")) {
            sentiment += 0.2;
        }

        return Math.max(0.0, Math.min(1.0, sentiment));
    }

    /**
     * AI-Powered Conversion Probability Prediction
     */
    public Integer predictConversionProbability(Customer customer) {
        int baseProbability = customer.getLeadScore();
        
        // Adjust based on customer characteristics
        if (customer.getIndustry() != null && 
            customer.getIndustry().toLowerCase().equals("technology")) {
            baseProbability += 10;
        }

        // Add some AI-driven randomness
        baseProbability += random.nextInt(20) - 10;

        return Math.max(0, Math.min(100, baseProbability));
    }

    /**
     * AI-Powered Next Best Action Recommendation
     */
    public String getNextBestAction(Customer customer) {
        int leadScore = customer.getLeadScore();
        
        if (leadScore >= 80) {
            return "Schedule executive meeting - High-value prospect";
        } else if (leadScore >= 60) {
            return "Send personalized proposal with case studies";
        } else if (leadScore >= 40) {
            return "Schedule product demo";
        } else if (leadScore >= 20) {
            return "Send follow-up email with educational content";
        } else {
            return "Send welcome email and nurture sequence";
        }
    }

    /**
     * AI-Powered Customer Segmentation
     */
    public String segmentCustomer(Customer customer) {
        int leadScore = customer.getLeadScore();
        
        if (leadScore >= 80) {
            return "PREMIUM";
        } else if (leadScore >= 60) {
            return "HIGH_VALUE";
        } else if (leadScore >= 40) {
            return "MEDIUM_VALUE";
        } else {
            return "STANDARD";
        }
    }

    /**
     * AI-Powered Churn Risk Assessment
     */
    public Double assessChurnRisk(Customer customer) {
        double risk = 0.1; // Base risk
        
        // Higher risk for customers with low engagement
        if (customer.getLeadScore() < 30) {
            risk += 0.3;
        }
        
        // Industry-specific risk
        if (customer.getIndustry() != null && 
            customer.getIndustry().toLowerCase().equals("startup")) {
            risk += 0.2;
        }
        
        return Math.min(1.0, risk);
    }

    /**
     * AI-Powered Upsell Opportunity Detection
     */
    public Double detectUpsellOpportunity(Customer customer) {
        double opportunity = 0.0;
        
        // High lead score indicates potential for upsell
        if (customer.getLeadScore() >= 70) {
            opportunity += 0.4;
        }
        
        // Technology companies often have expansion opportunities
        if (customer.getIndustry() != null && 
            customer.getIndustry().toLowerCase().equals("technology")) {
            opportunity += 0.3;
        }
        
        return Math.min(1.0, opportunity);
    }

    /**
     * AI-Powered Lead Nurturing Recommendations
     */
    public String getNurturingRecommendation(Customer customer) {
        String segment = segmentCustomer(customer);
        
        switch (segment) {
            case "PREMIUM":
                return "Personalized executive outreach with ROI analysis";
            case "HIGH_VALUE":
                return "Targeted content marketing with industry insights";
            case "MEDIUM_VALUE":
                return "Educational webinar invitations and case studies";
            default:
                return "General nurturing sequence with value-focused content";
        }
    }
} 