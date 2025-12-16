package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

/**
 * Service to initialize medical knowledge base on application startup
 * 
 * This service:
 * - Initializes the medical knowledge base with common injury information
 * - Runs automatically when the application starts
 * - Ensures the RAG pipeline has access to medical knowledge
 */
@Service
public class MedicalKnowledgeInitializationService {

    private static final Logger logger = LoggerFactory.getLogger(MedicalKnowledgeInitializationService.class);

    @Autowired
    private MockAzureCognitiveSearchService cognitiveSearchService;

    /**
     * Initialize medical knowledge base when application is ready
     */
    @EventListener(ApplicationReadyEvent.class)
    public void initializeMedicalKnowledgeBase() {
        try {
            logger.info("Starting medical knowledge base initialization...");
            
            // Initialize the medical knowledge base
            cognitiveSearchService.initializeMedicalKnowledgeBase();
            
            logger.info("Medical knowledge base initialization completed successfully");
            
        } catch (Exception e) {
            logger.error("Failed to initialize medical knowledge base: {}", e.getMessage());
            logger.warn("Application will continue without medical knowledge base initialization");
        }
    }

    /**
     * Manual initialization method for testing
     */
    public void manualInitialization() {
        logger.info("Manual medical knowledge base initialization requested");
        initializeMedicalKnowledgeBase();
    }
}
