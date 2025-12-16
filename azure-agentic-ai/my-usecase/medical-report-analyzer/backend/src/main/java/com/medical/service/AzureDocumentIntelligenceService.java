package com.medical.service;

import com.azure.ai.documentintelligence.DocumentIntelligenceClient;
import com.azure.ai.documentintelligence.DocumentIntelligenceClientBuilder;
import com.azure.ai.documentintelligence.models.AnalyzeDocumentOptions;
import com.azure.ai.documentintelligence.models.AnalyzeResult;
import com.azure.core.exception.HttpResponseException;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.BinaryData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Real Azure Document Intelligence Service
 * 
 * This service provides actual OCR and text extraction using Azure Document Intelligence.
 * Optimized for Azure free tier usage with proper error handling and cost management.
 */
@Service
public class AzureDocumentIntelligenceService {

    private static final Logger logger = LoggerFactory.getLogger(AzureDocumentIntelligenceService.class);

    @Value("${azure.form-recognizer.endpoint}")
    private String endpoint;

    @Value("${azure.form-recognizer.api-key}")
    private String apiKey;

    private DocumentIntelligenceClient client;

    /**
     * Initialize the Azure Document Intelligence client
     */
    private void initializeClient() {
        if (client == null) {
            try {
                client = new DocumentIntelligenceClientBuilder()
                    .endpoint(endpoint)
                    .credential(new AzureKeyCredential(apiKey))
                    .buildClient();
                logger.info("Azure Document Intelligence client initialized successfully");
            } catch (Exception e) {
                logger.error("Failed to initialize Azure Document Intelligence client: {}", e.getMessage());
                throw new RuntimeException("Azure Document Intelligence initialization failed", e);
            }
        }
    }

    /**
     * Extract text from document using Azure Document Intelligence
     * 
     * @param fileContent File content as byte array
     * @param fileName Original file name
     * @return Extracted text content
     */
    public CompletableFuture<String> extractTextFromDocument(byte[] fileContent, String fileName) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                initializeClient();
                
                logger.info("Processing document with Azure Document Intelligence: {}", fileName);
                
                // Analyze document using prebuilt-read model (free tier friendly)
                // Use the correct method signature for SDK 1.0.4
                // Convert to base64 string as required by the API
                String base64Content = java.util.Base64.getEncoder().encodeToString(fileContent);
                
                // Create a JSON request body with base64Source
                String requestBody = String.format("{\"base64Source\":\"%s\"}", base64Content);
                BinaryData requestData = BinaryData.fromString(requestBody);
                
                // Use beginAnalyzeDocument with the correct parameters
                BinaryData binaryResult = client.beginAnalyzeDocument("prebuilt-read", requestData, null)
                    .getFinalResult();
                
                // Parse the result to get AnalyzeResult
                AnalyzeResult analyzeResult = binaryResult.toObject(AnalyzeResult.class);
                
                // Extract text from all pages
                StringBuilder extractedText = new StringBuilder();
                analyzeResult.getPages().forEach(page -> {
                    page.getLines().forEach(line -> {
                        extractedText.append(line.getContent()).append("\n");
                    });
                });
                
                String result = extractedText.toString().trim();
                logger.info("Successfully extracted text from document: {} ({} characters)", 
                    fileName, result.length());
                
                return result;
                
            } catch (HttpResponseException e) {
                logger.error("Azure Document Intelligence error processing document {}: {}", 
                    fileName, e.getMessage());
                throw new RuntimeException("Document analysis failed: " + e.getMessage(), e);
            } catch (Exception e) {
                logger.error("Unexpected error processing document {}: {}", fileName, e.getMessage());
                throw new RuntimeException("Document processing failed", e);
            }
        });
    }

    /**
     * Check if service is available
     */
    public boolean isServiceAvailable() {
        try {
            initializeClient();
            return client != null;
        } catch (Exception e) {
            logger.warn("Azure Document Intelligence service not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get usage information for monitoring
     */
    public String getUsageInfo() {
        if (isServiceAvailable()) {
            return "Azure Document Intelligence - Active (Free Tier: 500 pages/month)";
        }
        return "Azure Document Intelligence - Not Available";
    }
}
