package com.crm.medicalaiservice.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import com.crm.medicalaiservice.entity.MedicalDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AISummaryService {

    private static final Logger logger = LoggerFactory.getLogger(AISummaryService.class);

    @Autowired
    private OpenAIClient openAIClient;

    @Value("${azure.ai.openai.deployment-name}")
    private String deploymentName;

    @Value("${azure.ai.openai.max-tokens}")
    private Integer maxTokens;

    @Value("${azure.ai.openai.temperature}")
    private Double temperature;

    /**
     * Generate AI summary for medical document
     */
    public String generateSummary(String documentText, String documentType) {
        try {
            String prompt = buildSummaryPrompt(documentText, documentType);
            
            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(maxTokens)
                .setTemperature(temperature)
                .setMessages(buildSystemAndUserMessages(prompt));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String summary = response.getChoices().get(0).getMessage().getContent();
                logger.info("Generated AI summary for {} document: {} characters", documentType, summary.length());
                return summary;
            } else {
                logger.warn("No summary generated from OpenAI");
                return "Summary generation failed";
            }
            
        } catch (Exception e) {
            logger.error("Error generating AI summary: {}", e.getMessage(), e);
            return "Error generating summary: " + e.getMessage();
        }
    }

    /**
     * Answer medical questions using RAG approach
     */
    public String answerMedicalQuestion(String question, List<MedicalDocument> relevantDocuments) {
        try {
            String context = buildContextFromDocuments(relevantDocuments);
            String prompt = buildQuestionPrompt(question, context);
            
            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(maxTokens)
                .setTemperature(0.1) // Lower temperature for more focused medical answers
                .setMessages(buildSystemAndUserMessages(prompt));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String answer = response.getChoices().get(0).getMessage().getContent();
                logger.info("Generated medical answer: {} characters", answer.length());
                return answer;
            } else {
                return "Unable to generate answer at this time.";
            }
            
        } catch (Exception e) {
            logger.error("Error answering medical question: {}", e.getMessage(), e);
            return "Error generating answer: " + e.getMessage();
        }
    }

    /**
     * Extract key medical insights from document
     */
    public String extractMedicalInsights(String documentText) {
        try {
            String prompt = buildInsightsPrompt(documentText);
            
            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(maxTokens)
                .setTemperature(0.2)
                .setMessages(buildSystemAndUserMessages(prompt));

            ChatCompletions response = openAIClient.getChatCompletions(options);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            } else {
                return "Unable to extract insights at this time.";
            }
            
        } catch (Exception e) {
            logger.error("Error extracting medical insights: {}", e.getMessage(), e);
            return "Error extracting insights: " + e.getMessage();
        }
    }

    /**
     * Build system and user messages for OpenAI
     */
    private List<ChatRequestMessage> buildSystemAndUserMessages(String userPrompt) {
        List<ChatRequestMessage> messages = new ArrayList<>();
        
        // System message for medical context
        messages.add(new ChatRequestSystemMessage(
            "You are a medical AI assistant with expertise in analyzing medical documents, " +
            "research papers, and clinical records. Provide accurate, helpful, and " +
            "professional responses. Always prioritize patient safety and medical accuracy. " +
            "If you're unsure about medical information, recommend consulting with a healthcare professional."
        ));
        
        // User message
        messages.add(new ChatRequestUserMessage(userPrompt));
        
        return messages;
    }

    /**
     * Build summary prompt based on document type
     */
    private String buildSummaryPrompt(String documentText, String documentType) {
        return String.format(
            "Please provide a comprehensive summary of this %s document. " +
            "Focus on key medical information, findings, and important details. " +
            "Use clear, professional medical language. " +
            "Document content:\n\n%s",
            documentType, documentText
        );
    }

    /**
     * Build question prompt with context
     */
    private String buildQuestionPrompt(String question, String context) {
        return String.format(
            "Based on the following medical documents and context, please answer this question: %s\n\n" +
            "Context:\n%s\n\n" +
            "Please provide a clear, accurate answer based on the available information. " +
            "If the information is not sufficient, please state that clearly.",
            question, context
        );
    }

    /**
     * Build insights extraction prompt
     */
    private String buildInsightsPrompt(String documentText) {
        return String.format(
            "Please analyze this medical document and extract key insights including:\n" +
            "1. Main medical findings or diagnoses\n" +
            "2. Important symptoms or observations\n" +
            "3. Treatment recommendations or medications\n" +
            "4. Risk factors or warnings\n" +
            "5. Follow-up requirements\n\n" +
            "Document content:\n%s\n\n" +
            "Please provide insights in a structured, easy-to-read format.",
            documentText
        );
    }

    /**
     * Build context from relevant documents
     */
    private String buildContextFromDocuments(List<MedicalDocument> documents) {
        StringBuilder context = new StringBuilder();
        for (MedicalDocument doc : documents) {
            context.append("Document: ").append(doc.getDocumentName()).append("\n");
            context.append("Type: ").append(doc.getDocumentType()).append("\n");
            if (doc.getExtractedText() != null) {
                context.append("Content: ").append(doc.getExtractedText()).append("\n\n");
            }
        }
        return context.toString();
    }
}
