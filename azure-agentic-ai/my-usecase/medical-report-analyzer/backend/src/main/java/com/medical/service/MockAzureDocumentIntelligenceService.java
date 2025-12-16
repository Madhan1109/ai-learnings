package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Mock implementation of Azure Document Intelligence Service
 * 
 * This service provides mock functionality for development and testing
 * when Azure services are not available or configured.
 */
@Service
public class MockAzureDocumentIntelligenceService {

    private static final Logger logger = LoggerFactory.getLogger(MockAzureDocumentIntelligenceService.class);

    /**
     * Mock text extraction from document
     * 
     * @param fileContent File content as byte array
     * @param fileName Original file name
     * @return Mock extracted text content
     */
    public CompletableFuture<String> extractTextFromDocument(byte[] fileContent, String fileName) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                logger.info("Mock processing document: {}", fileName);
                
                // Simulate processing delay
                Thread.sleep(1000);
                
                // Return mock extracted text based on file type
                String mockText = generateMockExtractedText(fileName);
                
                logger.info("Mock successfully extracted text from document: {} ({} characters)", 
                    fileName, mockText.length());
                
                return mockText;
                
            } catch (Exception e) {
                logger.error("Mock error processing document {}: {}", fileName, e.getMessage());
                throw new RuntimeException("Mock document processing failed", e);
            }
        });
    }

    /**
     * Generate mock extracted text based on file name
     */
    private String generateMockExtractedText(String fileName) {
        if (fileName.toLowerCase().contains("knee")) {
            return "Knee Injury Report\n\n" +
                   "Patient: John Doe\n" +
                   "Date: 2024-01-15\n" +
                   "Injury: Anterior cruciate ligament (ACL) tear\n" +
                   "Severity: Grade 2\n" +
                   "Symptoms: Pain, swelling, instability\n" +
                   "Recommendations: Rest, ice, compression, elevation (RICE)\n" +
                   "Follow-up: 2 weeks";
        } else if (fileName.toLowerCase().contains("back")) {
            return "Back Injury Report\n\n" +
                   "Patient: Jane Smith\n" +
                   "Date: 2024-01-20\n" +
                   "Injury: Lumbar strain\n" +
                   "Severity: Mild to moderate\n" +
                   "Symptoms: Lower back pain, muscle stiffness\n" +
                   "Recommendations: Physical therapy, core strengthening\n" +
                   "Follow-up: 1 week";
        } else {
            return "Medical Report\n\n" +
                   "Patient: Unknown\n" +
                   "Date: 2024-01-25\n" +
                   "Injury: General musculoskeletal injury\n" +
                   "Severity: To be determined\n" +
                   "Symptoms: Pain and discomfort\n" +
                   "Recommendations: Further evaluation needed\n" +
                   "Follow-up: As needed";
        }
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
        return "Mock Azure Document Intelligence - Simulated processing for development";
    }
}
