package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Comprehensive health check service for all Azure AI services
 * 
 * Monitors:
 * - Azure Document Intelligence (OCR)
 * - Azure OpenAI (GPT-4)
 * - Azure Cognitive Search (Knowledge Base)
 * - Overall system health and free tier usage
 */
@Service
public class HealthCheckService {

    private static final Logger logger = LoggerFactory.getLogger(HealthCheckService.class);

    @Autowired(required = false)
    private AzureDocumentIntelligenceService azureDocumentService;

    @Autowired(required = false)
    private AzureOpenAIService azureOpenAIService;

    @Autowired(required = false)
    private AzureCognitiveSearchService azureCognitiveSearchService;

    @Autowired(required = false)
    private MockAzureDocumentIntelligenceService documentService;

    @Autowired(required = false)
    private MockAzureOpenAIService openAIService;

    @Autowired(required = false)
    private MockAzureCognitiveSearchService searchService;

    @Autowired
    private RAGPipelineService ragPipelineService;

    /**
     * Get comprehensive health status of all services
     * 
     * @return Health status map
     */
    public Map<String, Object> getComprehensiveHealthStatus() {
        Map<String, Object> healthStatus = new HashMap<>();
        
        try {
            // Overall system status
            healthStatus.put("timestamp", LocalDateTime.now().toString());
            healthStatus.put("service", "Medical Report Analyzer");
            healthStatus.put("overallStatus", determineOverallStatus());
            
            // Individual service status
            healthStatus.put("services", getIndividualServiceStatus());
            
            // Azure free tier usage information
            healthStatus.put("azureFreeTierInfo", getAzureFreeTierInfo());
            
            // RAG pipeline status
            healthStatus.put("ragPipelineStatus", getRAGPipelineStatus());
            
            logger.info("Health check completed successfully");
            
        } catch (Exception e) {
            logger.error("Error during health check: {}", e.getMessage());
            healthStatus.put("error", "Health check failed: " + e.getMessage());
            healthStatus.put("overallStatus", "UNHEALTHY");
        }
        
        return healthStatus;
    }

    /**
     * Get individual service status
     */
    private Map<String, Object> getIndividualServiceStatus() {
        Map<String, Object> services = new HashMap<>();
        
        // Document Intelligence Service
        Map<String, Object> documentServiceStatus = new HashMap<>();
        if (azureDocumentService != null) {
            documentServiceStatus.put("status", azureDocumentService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            documentServiceStatus.put("usageInfo", azureDocumentService.getUsageInfo());
        } else {
            documentServiceStatus.put("status", documentService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            documentServiceStatus.put("usageInfo", documentService.getUsageInfo());
        }
        services.put("azureDocumentIntelligence", documentServiceStatus);
        
        // OpenAI Service
        Map<String, Object> openAIServiceStatus = new HashMap<>();
        if (azureOpenAIService != null) {
            openAIServiceStatus.put("status", azureOpenAIService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            openAIServiceStatus.put("usageInfo", azureOpenAIService.getUsageInfo());
        } else {
            openAIServiceStatus.put("status", openAIService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            openAIServiceStatus.put("usageInfo", openAIService.getUsageInfo());
        }
        services.put("azureOpenAI", openAIServiceStatus);
        
        // Cognitive Search Service
        Map<String, Object> searchServiceStatus = new HashMap<>();
        if (azureCognitiveSearchService != null) {
            searchServiceStatus.put("status", azureCognitiveSearchService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            searchServiceStatus.put("usageInfo", azureCognitiveSearchService.getUsageInfo());
            searchServiceStatus.put("indexInfo", azureCognitiveSearchService.getIndexInfo());
        } else {
            searchServiceStatus.put("status", searchService.isServiceAvailable() ? "HEALTHY" : "UNAVAILABLE");
            searchServiceStatus.put("usageInfo", searchService.getUsageInfo());
            searchServiceStatus.put("indexInfo", searchService.getIndexInfo());
        }
        services.put("azureCognitiveSearch", searchServiceStatus);
        
        return services;
    }

    /**
     * Get Azure free tier usage information
     */
    private Map<String, Object> getAzureFreeTierInfo() {
        Map<String, Object> freeTierInfo = new HashMap<>();
        
        freeTierInfo.put("documentIntelligence", Map.of(
            "limit", "500 pages/month",
            "description", "OCR and text extraction from medical reports"
        ));
        
        freeTierInfo.put("openAI", Map.of(
            "limit", "1000 tokens/month",
            "description", "GPT-4 analysis and solution generation"
        ));
        
        freeTierInfo.put("cognitiveSearch", Map.of(
            "limit", "1 index, 10,000 documents",
            "description", "Medical knowledge base storage and retrieval"
        ));
        
        return freeTierInfo;
    }

    /**
     * Get RAG pipeline status
     */
    private Map<String, Object> getRAGPipelineStatus() {
        Map<String, Object> pipelineStatus = new HashMap<>();
        
        pipelineStatus.put("overallStatus", ragPipelineService.areServicesAvailable() ? "OPERATIONAL" : "DEGRADED");
        pipelineStatus.put("details", ragPipelineService.getPipelineStatus());
        pipelineStatus.put("components", Map.of(
            "documentProcessing", documentService.isServiceAvailable(),
            "aiAnalysis", openAIService.isServiceAvailable(),
            "knowledgeRetrieval", searchService.isServiceAvailable()
        ));
        
        return pipelineStatus;
    }

    /**
     * Determine overall system status
     */
    private String determineOverallStatus() {
        boolean allServicesAvailable = documentService.isServiceAvailable() &&
                                     openAIService.isServiceAvailable() &&
                                     searchService.isServiceAvailable();
        
        if (allServicesAvailable) {
            return "HEALTHY";
        } else if (documentService.isServiceAvailable() || 
                   openAIService.isServiceAvailable() || 
                   searchService.isServiceAvailable()) {
            return "DEGRADED";
        } else {
            return "UNHEALTHY";
        }
    }

    /**
     * Get quick health status for monitoring
     */
    public String getQuickHealthStatus() {
        try {
            String overallStatus = determineOverallStatus();
            logger.info("Quick health check - Status: {}", overallStatus);
            return overallStatus;
        } catch (Exception e) {
            logger.error("Quick health check failed: {}", e.getMessage());
            return "UNHEALTHY";
        }
    }

    /**
     * Check if system is ready for processing
     */
    public boolean isSystemReady() {
        try {
            boolean ready = ragPipelineService.areServicesAvailable();
            logger.info("System readiness check: {}", ready ? "READY" : "NOT READY");
            return ready;
        } catch (Exception e) {
            logger.error("System readiness check failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get service availability summary
     */
    public Map<String, Boolean> getServiceAvailability() {
        Map<String, Boolean> availability = new HashMap<>();
        
        availability.put("documentIntelligence", documentService.isServiceAvailable());
        availability.put("openAI", openAIService.isServiceAvailable());
        availability.put("cognitiveSearch", searchService.isServiceAvailable());
        availability.put("ragPipeline", ragPipelineService.areServicesAvailable());
        
        return availability;
    }
}
