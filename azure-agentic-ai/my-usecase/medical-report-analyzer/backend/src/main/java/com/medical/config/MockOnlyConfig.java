package com.medical.config;

import com.medical.service.MockAzureDocumentIntelligenceService;
import com.medical.service.MockAzureOpenAIService;
import com.medical.service.MockAzureCognitiveSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Mock-only configuration for development and testing
 * 
 * This configuration provides mock implementations of all Azure services
 * to allow the application to compile and run without Azure dependencies.
 */
@Configuration
public class MockOnlyConfig {

    private static final Logger logger = LoggerFactory.getLogger(MockOnlyConfig.class);

    /**
     * Mock Document Intelligence service
     */
    @Bean
    @Primary
    public MockAzureDocumentIntelligenceService mockDocumentService() {
        logger.info("Initializing Mock Document Intelligence service");
        return new MockAzureDocumentIntelligenceService();
    }

    /**
     * Mock OpenAI service
     */
    @Bean
    @Primary
    public MockAzureOpenAIService mockOpenAIService() {
        logger.info("Initializing Mock OpenAI service");
        return new MockAzureOpenAIService();
    }

    /**
     * Mock Cognitive Search service
     */
    @Bean
    @Primary
    public MockAzureCognitiveSearchService mockCognitiveSearchService() {
        logger.info("Initializing Mock Cognitive Search service");
        return new MockAzureCognitiveSearchService();
    }
}
