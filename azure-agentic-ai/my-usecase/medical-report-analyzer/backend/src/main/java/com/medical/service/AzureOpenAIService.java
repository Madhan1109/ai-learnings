package com.medical.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatRequestMessage;
import com.azure.ai.openai.models.ChatRequestSystemMessage;
import com.azure.ai.openai.models.ChatRequestUserMessage;
import com.azure.ai.openai.models.ChatRole;
import com.azure.core.credential.AzureKeyCredential;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Real Azure OpenAI Service
 * 
 * This service provides actual AI analysis using Azure OpenAI.
 * Optimized for Azure free tier usage with token management and cost control.
 */
@Service
public class AzureOpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(AzureOpenAIService.class);

    @Value("${azure.openai.endpoint}")
    private String endpoint;

    @Value("${azure.openai.api-key}")
    private String apiKey;

    @Value("${azure.openai.deployment-name}")
    private String deploymentName;

    @Value("${azure.openai.max-tokens:500}")
    private int maxTokens;

    @Value("${azure.openai.temperature:0.1}")
    private double temperature;

    private OpenAIClient client;

    /**
     * Initialize the Azure OpenAI client
     */
    private void initializeClient() {
        if (client == null) {
            try {
                client = new OpenAIClientBuilder()
                    .endpoint(endpoint)
                    .credential(new AzureKeyCredential(apiKey))
                    .buildClient();
                logger.info("Azure OpenAI client initialized successfully");
            } catch (Exception e) {
                logger.error("Failed to initialize Azure OpenAI client: {}", e.getMessage());
                throw new RuntimeException("Azure OpenAI initialization failed", e);
            }
        }
    }

    /**
     * Analyze medical report with Azure OpenAI
     * 
     * @param extractedText Text extracted from medical report
     * @param injuryType Type of injury (if known)
     * @return AI-generated analysis and recommendations
     */
    public String analyzeMedicalReport(String extractedText, String injuryType) {
        try {
            initializeClient();
            
            logger.info("Analyzing medical report with Azure OpenAI (injury type: {})", injuryType);
            
            // Create chat messages for the analysis
            String systemPrompt = createSystemPrompt(injuryType);
            String userPrompt = createUserPrompt(extractedText, injuryType);
            
            List<ChatRequestMessage> messages = Arrays.asList(
                new ChatRequestSystemMessage(systemPrompt),
                new ChatRequestUserMessage(userPrompt)
            );
            
            ChatCompletionsOptions options = new ChatCompletionsOptions(messages)
                .setMaxTokens(maxTokens)
                .setTemperature(temperature);
            
            // Get AI analysis
            ChatCompletions chatCompletions = client.getChatCompletions(deploymentName, options);
            String analysis = chatCompletions.getChoices().get(0).getMessage().getContent();
            
            logger.info("Successfully generated medical analysis with Azure OpenAI");
            return analysis;
            
        } catch (Exception e) {
            logger.error("Error analyzing medical report with Azure OpenAI: {}", e.getMessage());
            throw new RuntimeException("AI analysis failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generate exercise recommendations
     */
    public String generateExerciseRecommendations(String injuryType, String severity) {
        try {
            initializeClient();
            
            logger.info("Generating exercise recommendations for {} injury with {} severity", 
                injuryType, severity);
            
            String systemPrompt = "You are a physical therapist AI assistant. Provide specific, safe exercise recommendations for injury recovery.";
            String userPrompt = String.format(
                "Provide exercise recommendations for a %s injury with %s severity. " +
                "Include specific exercises, repetitions, sets, and safety precautions. " +
                "Format the response clearly with numbered exercises and detailed instructions.",
                injuryType, severity
            );
            
            List<ChatRequestMessage> messages = Arrays.asList(
                new ChatRequestSystemMessage(systemPrompt),
                new ChatRequestUserMessage(userPrompt)
            );
            
            ChatCompletionsOptions options = new ChatCompletionsOptions(messages)
                .setMaxTokens(maxTokens)
                .setTemperature(temperature);
            
            ChatCompletions chatCompletions = client.getChatCompletions(deploymentName, options);
            String recommendations = chatCompletions.getChoices().get(0).getMessage().getContent();
            
            logger.info("Successfully generated exercise recommendations");
            return recommendations;
            
        } catch (Exception e) {
            logger.error("Error generating exercise recommendations: {}", e.getMessage());
            return "Unable to generate exercise recommendations due to service limitations.";
        }
    }

    /**
     * Create system prompt for medical analysis
     */
    private String createSystemPrompt(String injuryType) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a medical AI assistant specialized in injury analysis and treatment recommendations. ");
        prompt.append("Analyze medical reports and provide evidence-based recommendations for injury recovery. ");
        prompt.append("Always include safety disclaimers and recommend consulting healthcare professionals. ");
        
        if (injuryType != null && !injuryType.isEmpty()) {
            prompt.append("Focus specifically on ").append(injuryType).append(" injury analysis and treatment. ");
        }
        
        prompt.append("Format your response with clear sections: Injury Assessment, Treatment Solutions, ");
        prompt.append("Physical Therapy Exercises, Recovery Timeline, Medication Recommendations, and Follow-up Care.");
        
        return prompt.toString();
    }

    /**
     * Create user prompt for medical analysis
     */
    private String createUserPrompt(String extractedText, String injuryType) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Please analyze the following medical report and provide comprehensive treatment recommendations:\n\n");
        prompt.append("Medical Report Content:\n");
        prompt.append(extractedText);
        prompt.append("\n\n");
        
        if (injuryType != null && !injuryType.isEmpty()) {
            prompt.append("Injury Type: ").append(injuryType).append("\n");
        }
        
        prompt.append("Please provide:\n");
        prompt.append("1. Injury assessment and severity\n");
        prompt.append("2. Recommended treatment solutions\n");
        prompt.append("3. Specific physical therapy exercises\n");
        prompt.append("4. Recovery timeline\n");
        prompt.append("5. Medication recommendations (if applicable)\n");
        prompt.append("6. Follow-up care instructions\n\n");
        prompt.append("Ensure all recommendations are evidence-based and include safety precautions.");
        
        return prompt.toString();
    }

    /**
     * Check if service is available
     */
    public boolean isServiceAvailable() {
        try {
            initializeClient();
            return client != null;
        } catch (Exception e) {
            logger.warn("Azure OpenAI service not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get usage information for monitoring
     */
    public String getUsageInfo() {
        if (isServiceAvailable()) {
            return String.format("Azure OpenAI - Active (Free Tier: 1000 tokens/month, Max: %d tokens)", maxTokens);
        }
        return "Azure OpenAI - Not Available";
    }
}
