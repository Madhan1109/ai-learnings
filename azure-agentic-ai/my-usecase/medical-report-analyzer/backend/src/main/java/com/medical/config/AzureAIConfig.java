package com.medical.config;

import com.azure.ai.documentintelligence.DocumentIntelligenceClient;
import com.azure.ai.documentintelligence.DocumentIntelligenceClientBuilder;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.medical.service.AzureCognitiveSearchService;
import com.medical.service.AzureDocumentIntelligenceService;
import com.medical.service.AzureOpenAIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * Azure AI Services Configuration
 * 
 * This configuration provides real Azure AI service beans.
 * Activated when 'azure' profile is active or when mock services are disabled.
 */
@Configuration
@Profile("azure")
public class AzureAIConfig {

    private static final Logger logger = LoggerFactory.getLogger(AzureAIConfig.class);

    @Value("${azure.form-recognizer.endpoint}")
    private String formRecognizerEndpoint;

    @Value("${azure.form-recognizer.api-key}")
    private String formRecognizerApiKey;

    @Value("${azure.openai.endpoint}")
    private String openAIEndpoint;

    @Value("${azure.openai.api-key}")
    private String openAIApiKey;

    @Value("${azure.search.endpoint}")
    private String searchEndpoint;

    @Value("${azure.search.api-key}")
    private String searchApiKey;

    @Value("${azure.search.index-name}")
    private String searchIndexName;

    /**
     * Azure Document Intelligence Client
     */
    @Bean
    @Primary
    public DocumentIntelligenceClient documentIntelligenceClient() {
        try {
            logger.info("Initializing Azure Document Intelligence client");
            return new DocumentIntelligenceClientBuilder()
                .endpoint(formRecognizerEndpoint)
                .credential(new AzureKeyCredential(formRecognizerApiKey))
                .buildClient();
        } catch (Exception e) {
            logger.error("Failed to initialize Azure Document Intelligence client: {}", e.getMessage());
            throw new RuntimeException("Azure Document Intelligence initialization failed", e);
        }
    }

    /**
     * Azure OpenAI Client
     */
    @Bean
    @Primary
    public OpenAIClient openAIClient() {
        try {
            logger.info("Initializing Azure OpenAI client");
            return new OpenAIClientBuilder()
                .endpoint(openAIEndpoint)
                .credential(new AzureKeyCredential(openAIApiKey))
                .buildClient();
        } catch (Exception e) {
            logger.error("Failed to initialize Azure OpenAI client: {}", e.getMessage());
            throw new RuntimeException("Azure OpenAI initialization failed", e);
        }
    }

    /**
     * Azure Document Intelligence Service
     */
    @Bean
    @Primary
    public AzureDocumentIntelligenceService azureDocumentIntelligenceService() {
        logger.info("Initializing Azure Document Intelligence service");
        return new AzureDocumentIntelligenceService();
    }

    /**
     * Azure OpenAI Service
     */
    @Bean
    @Primary
    public AzureOpenAIService azureOpenAIService() {
        logger.info("Initializing Azure OpenAI service");
        return new AzureOpenAIService();
    }

    /**
     * Azure Cognitive Search Service
     */
    @Bean
    @Primary
    public AzureCognitiveSearchService azureCognitiveSearchService() {
        logger.info("Initializing Azure Cognitive Search service");
        return new AzureCognitiveSearchService();
    }
}
