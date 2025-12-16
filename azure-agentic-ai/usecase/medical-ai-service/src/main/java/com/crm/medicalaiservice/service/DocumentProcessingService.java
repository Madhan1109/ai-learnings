package com.crm.medicalaiservice.service;

import com.azure.ai.formrecognizer.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.models.*;
import com.crm.medicalaiservice.entity.MedicalDocument;
import com.crm.medicalaiservice.repository.MedicalDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class DocumentProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentProcessingService.class);

    @Autowired
    private DocumentAnalysisClient documentAnalysisClient;

    @Autowired
    private MedicalDocumentRepository medicalDocumentRepository;

    @Autowired
    private AISummaryService aiSummaryService;

    @Autowired
    private ComplianceCheckService complianceCheckService;

    /**
     * Process uploaded medical document asynchronously
     */
    public CompletableFuture<MedicalDocument> processDocumentAsync(MultipartFile file, String uploadedBy, String documentType) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Save document metadata
                MedicalDocument document = saveDocumentMetadata(file, uploadedBy, documentType);
                
                // Extract text using Azure Document Intelligence
                String extractedText = extractTextFromDocument(file);
                document.setExtractedText(extractedText);
                
                // Generate AI summary
                String aiSummary = aiSummaryService.generateSummary(extractedText, documentType);
                document.setAiSummary(aiSummary);
                
                // Check compliance
                double complianceScore = complianceCheckService.checkCompliance(extractedText, documentType);
                document.setComplianceScore(complianceScore);
                
                // Update processing status
                document.setProcessingStatus(MedicalDocument.ProcessingStatus.COMPLETED);
                document.setProcessedAt(LocalDateTime.now());
                
                // Save updated document
                return medicalDocumentRepository.save(document);
                
            } catch (Exception e) {
                logger.error("Error processing document: {}", e.getMessage(), e);
                throw new RuntimeException("Document processing failed", e);
            }
        });
    }

    /**
     * Extract text from document using Azure Document Intelligence
     */
    private String extractTextFromDocument(MultipartFile file) throws IOException {
        try {
            // Analyze document with Azure Form Recognizer
            DocumentAnalysisResult result = documentAnalysisClient.analyzeDocument(
                "prebuilt-document", 
                file.getInputStream()
            );

            StringBuilder extractedText = new StringBuilder();
            
            // Extract text from all pages
            for (DocumentPage page : result.getPages()) {
                for (DocumentLine line : page.getLines()) {
                    extractedText.append(line.getContent()).append("\n");
                }
            }

            // Extract text from tables if present
            for (DocumentTable table : result.getTables()) {
                extractedText.append("\n--- TABLE ---\n");
                for (DocumentTableRow row : table.getRows()) {
                    for (DocumentTableCell cell : row.getCells()) {
                        if (cell.getContent() != null) {
                            extractedText.append(cell.getContent()).append("\t");
                        }
                    }
                    extractedText.append("\n");
                }
            }

            logger.info("Successfully extracted text from document: {} characters", extractedText.length());
            return extractedText.toString();
            
        } catch (Exception e) {
            logger.error("Error extracting text from document: {}", e.getMessage(), e);
            throw new RuntimeException("Text extraction failed", e);
        }
    }

    /**
     * Save initial document metadata
     */
    private MedicalDocument saveDocumentMetadata(MultipartFile file, String uploadedBy, String documentType) {
        MedicalDocument document = new MedicalDocument();
        document.setDocumentName(file.getOriginalFilename());
        document.setDocumentType(documentType);
        document.setFileSize(file.getSize());
        document.setMimeType(file.getContentType());
        document.setUploadedBy(uploadedBy);
        document.setProcessingStatus(MedicalDocument.ProcessingStatus.PROCESSING);
        
        // Generate unique file path (in production, this would be cloud storage)
        String filePath = "uploads/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
        document.setFilePath(filePath);
        
        return medicalDocumentRepository.save(document);
    }

    /**
     * Get document processing status
     */
    public MedicalDocument.ProcessingStatus getDocumentStatus(UUID documentId) {
        MedicalDocument document = medicalDocumentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        return document.getProcessingStatus();
    }

    /**
     * Get processed document by ID
     */
    public MedicalDocument getProcessedDocument(UUID documentId) {
        return medicalDocumentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
    }
}
