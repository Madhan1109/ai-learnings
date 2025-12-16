package com.crm.medicalaiservice.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ComplianceCheckService {

    private static final Logger logger = LoggerFactory.getLogger(ComplianceCheckService.class);

    @Autowired
    private OpenAIClient openAIClient;

    @Value("${azure.ai.openai.deployment-name}")
    private String deploymentName;

    @Value("${security.content-safety.enabled}")
    private boolean contentSafetyEnabled;

    // HIPAA compliance patterns
    private static final Pattern PHI_PATTERN = Pattern.compile(
        "\\b(\\d{3}-\\d{2}-\\d{4}|\\d{10})\\b|" + // SSN
        "\\b\\d{3}-\\d{3}-\\d{4}\\b|" + // Phone
        "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b|" + // Email
        "\\b\\d{1,2}/\\d{1,2}/\\d{4}\\b" // Date
    );

    /**
     * Check document compliance and return score (0.0 - 1.0)
     */
    public double checkCompliance(String documentText, String documentType) {
        try {
            double complianceScore = 1.0;
            
            // Check for PHI violations
            double phiScore = checkPHICompliance(documentText);
            complianceScore *= phiScore;
            
            // Check for content safety issues
            if (contentSafetyEnabled) {
                double safetyScore = checkContentSafety(documentText);
                complianceScore *= safetyScore;
            }
            
            // Check for medical compliance issues
            double medicalScore = checkMedicalCompliance(documentText, documentType);
            complianceScore *= medicalScore;
            
            // Check for regulatory compliance
            double regulatoryScore = checkRegulatoryCompliance(documentText, documentType);
            complianceScore *= regulatoryScore;
            
            logger.info("Compliance check completed for {} document. Score: {}", documentType, complianceScore);
            return complianceScore;
            
        } catch (Exception e) {
            logger.error("Error during compliance check: {}", e.getMessage(), e);
            return 0.0; // Fail safe - return 0 for any errors
        }
    }

    /**
     * Check for PHI (Protected Health Information) violations
     */
    private double checkPHICompliance(String documentText) {
        if (documentText == null || documentText.trim().isEmpty()) {
            return 1.0;
        }

        // Check for common PHI patterns
        if (PHI_PATTERN.matcher(documentText).find()) {
            logger.warn("Potential PHI detected in document");
            return 0.3; // Significant penalty for PHI violations
        }

        // Check for other PHI indicators
        String[] phiKeywords = {
            "patient name", "social security", "ssn", "date of birth", "dob",
            "address", "phone number", "email address", "medical record number"
        };

        int phiCount = 0;
        for (String keyword : phiKeywords) {
            if (documentText.toLowerCase().contains(keyword.toLowerCase())) {
                phiCount++;
            }
        }

        // Calculate score based on PHI keyword density
        if (phiCount == 0) {
            return 1.0;
        } else if (phiCount <= 2) {
            return 0.8;
        } else if (phiCount <= 5) {
            return 0.6;
        } else {
            return 0.4;
        }
    }

    /**
     * Check content safety using Azure OpenAI
     */
    private double checkContentSafety(String documentText) {
        try {
            String prompt = "Analyze the following medical document for content safety issues. " +
                "Check for inappropriate content, hate speech, violence, or self-harm content. " +
                "Respond with 'SAFE' if content is appropriate, or 'UNSAFE' with reason if issues found.\n\n" +
                "Document: " + documentText;

            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(100)
                .setTemperature(0.0)
                .setMessages(List.of(
                    new ChatRequestSystemMessage("You are a content safety analyzer for medical documents."),
                    new ChatRequestUserMessage(prompt)
                ));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String result = response.getChoices().get(0).getMessage().getContent().toLowerCase();
                if (result.contains("safe")) {
                    return 1.0;
                } else if (result.contains("unsafe")) {
                    logger.warn("Content safety issues detected: {}", result);
                    return 0.2;
                }
            }
            
            return 0.8; // Default score if analysis is unclear
            
        } catch (Exception e) {
            logger.error("Error during content safety check: {}", e.getMessage(), e);
            return 0.8; // Default score on error
        }
    }

    /**
     * Check medical compliance and accuracy
     */
    private double checkMedicalCompliance(String documentText, String documentType) {
        try {
            String prompt = String.format(
                "Analyze this %s document for medical compliance issues:\n" +
                "1. Check for medical terminology accuracy\n" +
                "2. Identify potential medical errors or inconsistencies\n" +
                "3. Verify compliance with medical standards\n" +
                "4. Check for missing critical information\n\n" +
                "Document: %s\n\n" +
                "Respond with 'COMPLIANT' if no issues found, or 'NON_COMPLIANT' with specific issues.",
                documentType, documentText
            );

            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(200)
                .setTemperature(0.0)
                .setMessages(List.of(
                    new ChatRequestSystemMessage("You are a medical compliance expert."),
                    new ChatRequestUserMessage(prompt)
                ));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String result = response.getChoices().get(0).getMessage().getContent().toLowerCase();
                if (result.contains("compliant")) {
                    return 1.0;
                } else if (result.contains("non_compliant") || result.contains("non-compliant")) {
                    logger.warn("Medical compliance issues detected: {}", result);
                    return 0.6;
                }
            }
            
            return 0.8; // Default score if analysis is unclear
            
        } catch (Exception e) {
            logger.error("Error during medical compliance check: {}", e.getMessage(), e);
            return 0.8; // Default score on error
        }
    }

    /**
     * Check regulatory compliance based on document type
     */
    private double checkRegulatoryCompliance(String documentText, String documentType) {
        try {
            String prompt = String.format(
                "Analyze this %s document for regulatory compliance:\n" +
                "1. HIPAA compliance for patient privacy\n" +
                "2. FDA compliance for medical devices/drugs\n" +
                "3. Clinical trial compliance if applicable\n" +
                "4. Medical device reporting requirements\n\n" +
                "Document: %s\n\n" +
                "Respond with 'COMPLIANT' if no regulatory issues found, or 'NON_COMPLIANT' with specific issues.",
                documentType, documentText
            );

            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(200)
                .setTemperature(0.0)
                .setMessages(List.of(
                    new ChatRequestSystemMessage("You are a regulatory compliance expert for medical documents."),
                    new ChatRequestUserMessage(prompt)
                ));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String result = response.getChoices().get(0).getMessage().getContent().toLowerCase();
                if (result.contains("compliant")) {
                    return 1.0;
                } else if (result.contains("non_compliant") || result.contains("non-compliant")) {
                    logger.warn("Regulatory compliance issues detected: {}", result);
                    return 0.5;
                }
            }
            
            return 0.8; // Default score if analysis is unclear
            
        } catch (Exception e) {
            logger.error("Error during regulatory compliance check: {}", e.getMessage(), e);
            return 0.8; // Default score on error
        }
    }

    /**
     * Get compliance recommendations for improvement
     */
    public String getComplianceRecommendations(String documentText, String documentType) {
        try {
            String prompt = String.format(
                "Based on the compliance analysis of this %s document, provide specific recommendations for improvement:\n\n" +
                "Document: %s\n\n" +
                "Please provide:\n" +
                "1. Specific compliance issues found\n" +
                "2. Recommended actions to fix issues\n" +
                "3. Best practices to follow\n" +
                "4. Priority level for each recommendation",
                documentType, documentText
            );

            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(500)
                .setTemperature(0.2)
                .setMessages(List.of(
                    new ChatRequestSystemMessage("You are a medical compliance consultant providing improvement recommendations."),
                    new ChatRequestUserMessage(prompt)
                ));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            } else {
                return "Unable to generate compliance recommendations at this time.";
            }
            
        } catch (Exception e) {
            logger.error("Error generating compliance recommendations: {}", e.getMessage(), e);
            return "Error generating recommendations: " + e.getMessage();
        }
    }
}
