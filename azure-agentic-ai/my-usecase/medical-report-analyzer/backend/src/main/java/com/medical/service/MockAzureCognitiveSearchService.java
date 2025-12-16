package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mock implementation of Azure Cognitive Search Service
 * 
 * This service provides mock functionality for development and testing
 * when Azure Cognitive Search services are not available or configured.
 */
@Service
public class MockAzureCognitiveSearchService {

    private static final Logger logger = LoggerFactory.getLogger(MockAzureCognitiveSearchService.class);

    /**
     * Mock search medical knowledge base
     * 
     * @param query Search query
     * @param injuryType Type of injury to filter by
     * @return List of mock relevant medical knowledge documents
     */
    public List<Map<String, Object>> searchMedicalKnowledge(String query, String injuryType) {
        try {
            logger.info("Mock searching medical knowledge for query: '{}' with injury type: {}", query, injuryType);
            
            // Simulate processing delay
            Thread.sleep(500);
            
            // Generate mock search results
            List<Map<String, Object>> results = generateMockSearchResults(query, injuryType);
            
            logger.info("Mock found {} relevant medical knowledge documents", results.size());
            return results;
            
        } catch (Exception e) {
            logger.error("Mock error searching medical knowledge: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Mock add medical knowledge document to the index
     * 
     * @param document Medical knowledge document
     * @return Success status (always true for mock)
     */
    public boolean addMedicalKnowledge(Map<String, Object> document) {
        try {
            logger.info("Mock adding medical knowledge document: {}", document.get("title"));
            
            // Simulate processing delay
            Thread.sleep(200);
            
            logger.info("Mock successfully added medical knowledge document");
            return true;
            
        } catch (Exception e) {
            logger.error("Mock error adding medical knowledge: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Mock initialize medical knowledge base
     */
    public void initializeMedicalKnowledgeBase() {
        try {
            logger.info("Mock initializing medical knowledge base...");
            
            // Simulate processing delay
            Thread.sleep(1000);
            
            // Add mock knowledge entries
            addMockKneeInjuryKnowledge();
            addMockBackInjuryKnowledge();
            addMockShoulderInjuryKnowledge();
            addMockGeneralInjuryKnowledge();
            
            logger.info("Mock medical knowledge base initialization completed");
            
        } catch (Exception e) {
            logger.error("Mock error initializing medical knowledge base: {}", e.getMessage());
        }
    }

    /**
     * Mock get relevant medical knowledge for RAG pipeline
     * 
     * @param injuryType Type of injury
     * @param query Additional search terms
     * @return Mock relevant medical knowledge
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
                knowledge.append("  ").append(result.get("content")).append("\n\n");
            }
            
            return knowledge.toString();
            
        } catch (Exception e) {
            logger.error("Mock error retrieving medical knowledge: {}", e.getMessage());
            return "Unable to retrieve medical knowledge at this time.";
        }
    }

    /**
     * Generate mock search results
     */
    private List<Map<String, Object>> generateMockSearchResults(String query, String injuryType) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        if ("knee".equalsIgnoreCase(injuryType)) {
            Map<String, Object> kneeInjury = new HashMap<>();
            kneeInjury.put("id", "knee-injury-001");
            kneeInjury.put("title", "Knee Injury Treatment Guidelines");
            kneeInjury.put("injuryType", "knee");
            kneeInjury.put("category", "treatment");
            kneeInjury.put("content", "Rest and ice application for 48-72 hours. Elevation to reduce swelling. Compression with elastic bandage. Physical therapy exercises after initial healing.");
            kneeInjury.put("source", "medical-guidelines");
            results.add(kneeInjury);
            
            Map<String, Object> kneeRecovery = new HashMap<>();
            kneeRecovery.put("id", "knee-recovery-001");
            kneeRecovery.put("title", "Knee Injury Recovery Protocol");
            kneeRecovery.put("injuryType", "knee");
            kneeRecovery.put("category", "recovery");
            kneeRecovery.put("content", "Gradual return to activity. Strengthening exercises for quadriceps and hamstrings. Avoid high-impact activities initially.");
            kneeRecovery.put("source", "medical-guidelines");
            results.add(kneeRecovery);
            
        } else if ("back".equalsIgnoreCase(injuryType)) {
            Map<String, Object> backInjury = new HashMap<>();
            backInjury.put("id", "back-injury-001");
            backInjury.put("title", "Back Injury Recovery Protocol");
            backInjury.put("injuryType", "back");
            backInjury.put("category", "recovery");
            backInjury.put("content", "Gentle stretching exercises. Core strengthening. Proper posture maintenance. Gradual return to normal activities.");
            backInjury.put("source", "medical-guidelines");
            results.add(backInjury);
            
        } else {
            Map<String, Object> generalInjury = new HashMap<>();
            generalInjury.put("id", "general-injury-001");
            generalInjury.put("title", "General Injury Recovery Principles");
            generalInjury.put("injuryType", "general");
            generalInjury.put("category", "principles");
            generalInjury.put("content", "Rest and allow proper healing time. Follow medical professional advice. Gradual return to normal activities. Monitor for any worsening symptoms.");
            generalInjury.put("source", "medical-guidelines");
            results.add(generalInjury);
        }
        
        return results;
    }

    /**
     * Add mock knee injury knowledge
     */
    private void addMockKneeInjuryKnowledge() {
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
     * Add mock back injury knowledge
     */
    private void addMockBackInjuryKnowledge() {
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
     * Add mock shoulder injury knowledge
     */
    private void addMockShoulderInjuryKnowledge() {
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
     * Add mock general injury knowledge
     */
    private void addMockGeneralInjuryKnowledge() {
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
     * Check if service is available (always true for mock)
     */
    public boolean isServiceAvailable() {
        return true;
    }

    /**
     * Get mock usage information
     */
    public String getUsageInfo() {
        return "Mock Azure Cognitive Search - Simulated search for development";
    }

    /**
     * Get mock index information
     */
    public String getIndexInfo() {
        return "Mock Search Index: medical-knowledge";
    }
}
