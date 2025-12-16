package com.medical.service;

import com.azure.search.documents.SearchClient;
import com.azure.search.documents.SearchClientBuilder;
import com.azure.search.documents.models.SearchOptions;
import com.azure.search.documents.models.SearchResult;
import com.azure.search.documents.indexes.models.IndexDocumentsBatch;
import com.azure.search.documents.models.IndexAction;
import com.azure.search.documents.models.IndexActionType;
import com.azure.core.credential.AzureKeyCredential;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Real Azure Cognitive Search Service
 * 
 * This service provides actual search functionality using Azure Cognitive Search.
 * Optimized for Azure free tier usage with proper index management and cost control.
 */
@Service
public class AzureCognitiveSearchService {

    private static final Logger logger = LoggerFactory.getLogger(AzureCognitiveSearchService.class);

    @Value("${azure.search.endpoint}")
    private String endpoint;

    @Value("${azure.search.api-key}")
    private String apiKey;

    @Value("${azure.search.index-name}")
    private String indexName;

    private SearchClient searchClient;

    /**
     * Initialize the Azure Cognitive Search client
     */
    private void initializeClient() {
        if (searchClient == null) {
            try {
                searchClient = new SearchClientBuilder()
                    .endpoint(endpoint)
                    .credential(new AzureKeyCredential(apiKey))
                    .indexName(indexName)
                    .buildClient();
                logger.info("Azure Cognitive Search client initialized successfully");
            } catch (Exception e) {
                logger.error("Failed to initialize Azure Cognitive Search client: {}", e.getMessage());
                throw new RuntimeException("Azure Cognitive Search initialization failed", e);
            }
        }
    }

    /**
     * Search medical knowledge base
     * 
     * @param query Search query
     * @param injuryType Type of injury to filter by
     * @return List of relevant medical knowledge documents
     */
    public List<Map<String, Object>> searchMedicalKnowledge(String query, String injuryType) {
        try {
            initializeClient();
            
            logger.info("Searching medical knowledge for query: '{}' with injury type: {}", query, injuryType);
            
            // Build search query with filters
            String searchQuery = query;
            if (injuryType != null && !injuryType.isEmpty()) {
                searchQuery += " AND injuryType:" + injuryType;
            }
            
            SearchOptions searchOptions = new SearchOptions()
                .setSearchFields("title", "content", "category")
                .setTop(5) // Limit results for free tier
                .setSkip(0);
            
            // Perform search
            Iterable<SearchResult> searchResults = searchClient.search(searchQuery, searchOptions, null);
            
            List<Map<String, Object>> results = new ArrayList<>();
            for (SearchResult result : searchResults) {
                Map<String, Object> document = new HashMap<>();
                document.put("id", result.getDocument(Map.class).get("id"));
                document.put("title", result.getDocument(Map.class).get("title"));
                document.put("content", result.getDocument(Map.class).get("content"));
                document.put("injuryType", result.getDocument(Map.class).get("injuryType"));
                document.put("category", result.getDocument(Map.class).get("category"));
                document.put("source", result.getDocument(Map.class).get("source"));
                document.put("score", result.getScore());
                results.add(document);
            }
            
            logger.info("Found {} relevant medical knowledge documents", results.size());
            return results;
            
        } catch (Exception e) {
            logger.error("Error searching medical knowledge: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Add medical knowledge document to the index
     * 
     * @param document Medical knowledge document
     * @return Success status
     */
    public boolean addMedicalKnowledge(Map<String, Object> document) {
        try {
            initializeClient();
            
            logger.info("Adding medical knowledge document: {}", document.get("title"));
            
            // Create index action
            IndexAction<Map<String, Object>> indexAction = new IndexAction<Map<String, Object>>()
                .setActionType(IndexActionType.UPLOAD)
                .setDocument(document);
            
            // Create batch and upload
            IndexDocumentsBatch<Map<String, Object>> batch = new IndexDocumentsBatch<Map<String, Object>>()
                .addActions(Arrays.asList(indexAction));
            
            searchClient.indexDocuments(batch);
            
            logger.info("Successfully added medical knowledge document");
            return true;
            
        } catch (Exception e) {
            logger.error("Error adding medical knowledge: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Initialize medical knowledge base with sample data
     */
    public void initializeMedicalKnowledgeBase() {
        try {
            logger.info("Initializing medical knowledge base with Azure Cognitive Search...");
            
            // Add sample medical knowledge documents
            addKneeInjuryKnowledge();
            addBackInjuryKnowledge();
            addShoulderInjuryKnowledge();
            addGeneralInjuryKnowledge();
            
            logger.info("Medical knowledge base initialization completed successfully");
            
        } catch (Exception e) {
            logger.error("Error initializing medical knowledge base: {}", e.getMessage());
        }
    }

    /**
     * Get relevant medical knowledge for RAG pipeline
     * 
     * @param injuryType Type of injury
     * @param query Additional search terms
     * @return Relevant medical knowledge
     */
    public String getRelevantMedicalKnowledge(String injuryType, String query) {
        try {
            List<Map<String, Object>> searchResults = searchMedicalKnowledge(query, injuryType);
            
            if (searchResults.isEmpty()) {
                return "No specific medical knowledge found for this injury type.";
            }
            
            StringBuilder knowledge = new StringBuilder();
            knowledge.append("Relevant Medical Knowledge:\n");
            knowledge.append("==========================\n\n");
            
            for (Map<String, Object> result : searchResults) {
                knowledge.append("• ").append(result.get("title")).append("\n");
                knowledge.append("  ").append(result.get("content")).append("\n");
                knowledge.append("  (Confidence: ").append(String.format("%.2f", result.get("score"))).append(")\n\n");
            }
            
            return knowledge.toString();
            
        } catch (Exception e) {
            logger.error("Error retrieving medical knowledge: {}", e.getMessage());
            return "Unable to retrieve medical knowledge at this time.";
        }
    }

    /**
     * Add knee injury knowledge
     */
    private void addKneeInjuryKnowledge() {
        Map<String, Object> kneeInjury = new HashMap<>();
        kneeInjury.put("id", "knee-injury-001");
        kneeInjury.put("title", "Knee Injury Treatment Guidelines");
        kneeInjury.put("injuryType", "knee");
        kneeInjury.put("category", "treatment");
        kneeInjury.put("content", "Rest and ice application for 48-72 hours. Elevation to reduce swelling. Compression with elastic bandage. Physical therapy exercises after initial healing.");
        kneeInjury.put("source", "medical-guidelines");
        
        addMedicalKnowledge(kneeInjury);
    }

    /**
     * Add back injury knowledge
     */
    private void addBackInjuryKnowledge() {
        Map<String, Object> backInjury = new HashMap<>();
        backInjury.put("id", "back-injury-001");
        backInjury.put("title", "Back Injury Recovery Protocol");
        backInjury.put("injuryType", "back");
        backInjury.put("category", "recovery");
        backInjury.put("content", "Gentle stretching exercises. Core strengthening. Proper posture maintenance. Gradual return to normal activities.");
        backInjury.put("source", "medical-guidelines");
        
        addMedicalKnowledge(backInjury);
    }

    /**
     * Add shoulder injury knowledge
     */
    private void addShoulderInjuryKnowledge() {
        Map<String, Object> shoulderInjury = new HashMap<>();
        shoulderInjury.put("id", "shoulder-injury-001");
        shoulderInjury.put("title", "Shoulder Injury Rehabilitation");
        shoulderInjury.put("injuryType", "shoulder");
        shoulderInjury.put("category", "rehabilitation");
        shoulderInjury.put("content", "Range of motion exercises. Strengthening with resistance bands. Avoid overhead activities initially. Gradual progression to full function.");
        shoulderInjury.put("source", "medical-guidelines");
        
        addMedicalKnowledge(shoulderInjury);
    }

    /**
     * Add general injury knowledge
     */
    private void addGeneralInjuryKnowledge() {
        Map<String, Object> generalInjury = new HashMap<>();
        generalInjury.put("id", "general-injury-001");
        generalInjury.put("title", "General Injury Recovery Principles");
        generalInjury.put("injuryType", "general");
        generalInjury.put("category", "principles");
        generalInjury.put("content", "Rest and allow proper healing time. Follow medical professional advice. Gradual return to normal activities. Monitor for any worsening symptoms.");
        generalInjury.put("source", "medical-guidelines");
        
        addMedicalKnowledge(generalInjury);
    }

    /**
     * Check if service is available
     */
    public boolean isServiceAvailable() {
        try {
            initializeClient();
            return searchClient != null;
        } catch (Exception e) {
            logger.warn("Azure Cognitive Search service not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get usage information for monitoring
     */
    public String getUsageInfo() {
        if (isServiceAvailable()) {
            return "Azure Cognitive Search - Active (Free Tier: 50MB storage, 20,000 queries/month)";
        }
        return "Azure Cognitive Search - Not Available";
    }

    /**
     * Get index information
     */
    public String getIndexInfo() {
        if (isServiceAvailable()) {
            return "Search Index: " + indexName;
        }
        return "Search Index: Not Available";
    }
}
