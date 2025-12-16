package com.crm.medicalaiservice.controller;

import com.crm.medicalaiservice.entity.MedicalDocument;
import com.crm.medicalaiservice.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/medical-ai")
@CrossOrigin(origins = "*")
public class MedicalAIController {

    private static final Logger logger = LoggerFactory.getLogger(MedicalAIController.class);

    @Autowired
    private DocumentProcessingService documentProcessingService;

    @Autowired
    private AISummaryService aiSummaryService;

    @Autowired
    private ComplianceCheckService complianceCheckService;

    @Autowired
    private RAGSearchService ragSearchService;

    /**
     * Upload and process medical document
     */
    @PostMapping("/documents/upload")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam("uploadedBy") String uploadedBy) {
        
        try {
            logger.info("Document upload request received: {} ({}) by {}", 
                file.getOriginalFilename(), documentType, uploadedBy);

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new DocumentUploadResponse("File is empty", null, null));
            }

            // Validate document type
            if (!isValidDocumentType(documentType)) {
                return ResponseEntity.badRequest()
                    .body(new DocumentUploadResponse("Invalid document type", null, null));
            }

            // Process document asynchronously
            CompletableFuture<MedicalDocument> processingFuture = 
                documentProcessingService.processDocumentAsync(file, uploadedBy, documentType);

            // Return immediate response with processing status
            DocumentUploadResponse response = new DocumentUploadResponse(
                "Document uploaded successfully and processing started",
                processingFuture.thenApply(MedicalDocument::getId).join(),
                "PROCESSING"
            );

            return ResponseEntity.accepted().body(response);

        } catch (Exception e) {
            logger.error("Error uploading document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new DocumentUploadResponse("Upload failed: " + e.getMessage(), null, null));
        }
    }

    /**
     * Get document processing status
     */
    @GetMapping("/documents/{documentId}/status")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<DocumentStatusResponse> getDocumentStatus(@PathVariable UUID documentId) {
        try {
            MedicalDocument.ProcessingStatus status = documentProcessingService.getDocumentStatus(documentId);
            return ResponseEntity.ok(new DocumentStatusResponse(documentId, status.toString()));
        } catch (Exception e) {
            logger.error("Error getting document status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new DocumentStatusResponse(documentId, "ERROR"));
        }
    }

    /**
     * Get processed document details
     */
    @GetMapping("/documents/{documentId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<MedicalDocument> getDocument(@PathVariable UUID documentId) {
        try {
            MedicalDocument document = documentProcessingService.getProcessedDocument(documentId);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            logger.error("Error getting document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search medical literature using RAG
     */
    @PostMapping("/search/rag")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<RAGSearchService.RAGSearchResult> searchMedicalLiterature(
            @RequestBody MedicalSearchRequest request) {
        
        try {
            logger.info("RAG search request: '{}' for document type: {}", 
                request.getQuery(), request.getDocumentType());

            RAGSearchService.RAGSearchResult result = ragSearchService.searchMedicalLiterature(
                request.getQuery(), 
                request.getDocumentType(), 
                request.getMaxResults()
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("Error during RAG search: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Answer medical question using AI
     */
    @PostMapping("/ai/answer-question")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<AIAnswerResponse> answerMedicalQuestion(
            @RequestBody MedicalQuestionRequest request) {
        
        try {
            logger.info("Medical question request: '{}'", request.getQuestion());

            // Get relevant documents for context
            List<MedicalDocument> relevantDocs = ragSearchService.searchMedicalLiterature(
                request.getQuestion(), 
                request.getDocumentType(), 
                5
            ).getSourceDocuments();

            // Generate AI answer
            String answer = aiSummaryService.answerMedicalQuestion(request.getQuestion(), relevantDocs);

            AIAnswerResponse response = new AIAnswerResponse(
                request.getQuestion(),
                answer,
                relevantDocs.size()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error answering medical question: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AIAnswerResponse(request.getQuestion(), "Error generating answer", 0));
        }
    }

    /**
     * Extract medical insights from document
     */
    @PostMapping("/ai/extract-insights")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<MedicalInsightsResponse> extractMedicalInsights(
            @RequestBody InsightsRequest request) {
        
        try {
            logger.info("Insights extraction request for document: {}", request.getDocumentId());

            MedicalDocument document = documentProcessingService.getProcessedDocument(request.getDocumentId());
            
            if (document.getExtractedText() == null) {
                return ResponseEntity.badRequest()
                    .body(new MedicalInsightsResponse("Document text not available", null));
            }

            String insights = aiSummaryService.extractMedicalInsights(document.getExtractedText());

            MedicalInsightsResponse response = new MedicalInsightsResponse(
                "Insights extracted successfully",
                insights
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error extracting medical insights: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MedicalInsightsResponse("Error extracting insights", null));
        }
    }

    /**
     * Check document compliance
     */
    @PostMapping("/compliance/check")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ComplianceCheckResponse> checkDocumentCompliance(
            @RequestBody ComplianceCheckRequest request) {
        
        try {
            logger.info("Compliance check request for document: {}", request.getDocumentId());

            MedicalDocument document = documentProcessingService.getProcessedDocument(request.getDocumentId());
            
            if (document.getExtractedText() == null) {
                return ResponseEntity.badRequest()
                    .body(new ComplianceCheckResponse("Document text not available", 0.0, null));
            }

            double complianceScore = complianceCheckService.checkCompliance(
                document.getExtractedText(), 
                document.getDocumentType()
            );

            String recommendations = complianceCheckService.getComplianceRecommendations(
                document.getExtractedText(), 
                document.getDocumentType()
            );

            ComplianceCheckResponse response = new ComplianceCheckResponse(
                "Compliance check completed",
                complianceScore,
                recommendations
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error checking compliance: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ComplianceCheckResponse("Error checking compliance", 0.0, null));
        }
    }

    /**
     * Get similar documents for recommendation
     */
    @GetMapping("/documents/{documentId}/similar")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalDocument>> getSimilarDocuments(
            @PathVariable UUID documentId,
            @RequestParam(defaultValue = "5") int maxResults) {
        
        try {
            List<MedicalDocument> similarDocs = ragSearchService.findSimilarDocuments(documentId, maxResults);
            return ResponseEntity.ok(similarDocs);
        } catch (Exception e) {
            logger.error("Error finding similar documents: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Validate document type
     */
    private boolean isValidDocumentType(String documentType) {
        String[] validTypes = {
            "PATIENT_RECORD", "RESEARCH_PAPER", "COMPLIANCE_DOC", "MEDICAL_REPORT",
            "CLINICAL_TRIAL", "DRUG_APPROVAL", "DEVICE_APPROVAL", "CASE_STUDY"
        };

        for (String validType : validTypes) {
            if (validType.equals(documentType)) {
                return true;
            }
        }
        return false;
    }

    // Request/Response DTOs

    public static class DocumentUploadResponse {
        private String message;
        private UUID documentId;
        private String status;

        public DocumentUploadResponse(String message, UUID documentId, String status) {
            this.message = message;
            this.documentId = documentId;
            this.status = status;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public UUID getDocumentId() { return documentId; }
        public void setDocumentId(UUID documentId) { this.documentId = documentId; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class DocumentStatusResponse {
        private UUID documentId;
        private String status;

        public DocumentStatusResponse(UUID documentId, String status) {
            this.documentId = documentId;
            this.status = status;
        }

        // Getters and setters
        public UUID getDocumentId() { return documentId; }
        public void setDocumentId(UUID documentId) { this.documentId = documentId; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class MedicalSearchRequest {
        private String query;
        private String documentType;
        private int maxResults = 10;

        // Getters and setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        
        public int getMaxResults() { return maxResults; }
        public void setMaxResults(int maxResults) { this.maxResults = maxResults; }
    }

    public static class MedicalQuestionRequest {
        private String question;
        private String documentType;

        // Getters and setters
        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
    }

    public static class AIAnswerResponse {
        private String question;
        private String answer;
        private int sourceCount;

        public AIAnswerResponse(String question, String answer, int sourceCount) {
            this.question = question;
            this.answer = answer;
            this.sourceCount = sourceCount;
        }

        // Getters and setters
        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
        
        public int getSourceCount() { return sourceCount; }
        public void setSourceCount(int sourceCount) { this.sourceCount = sourceCount; }
    }

    public static class InsightsRequest {
        private UUID documentId;

        // Getters and setters
        public UUID getDocumentId() { return documentId; }
        public void setDocumentId(UUID documentId) { this.documentId = documentId; }
    }

    public static class MedicalInsightsResponse {
        private String message;
        private String insights;

        public MedicalInsightsResponse(String message, String insights) {
            this.message = message;
            this.insights = insights;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public String getInsights() { return insights; }
        public void setInsights(String insights) { this.insights = insights; }
    }

    public static class ComplianceCheckRequest {
        private UUID documentId;

        // Getters and setters
        public UUID getDocumentId() { return documentId; }
        public void setDocumentId(UUID documentId) { this.documentId = documentId; }
    }

    public static class ComplianceCheckResponse {
        private String message;
        private double complianceScore;
        private String recommendations;

        public ComplianceCheckResponse(String message, double complianceScore, String recommendations) {
            this.message = message;
            this.complianceScore = complianceScore;
            this.recommendations = recommendations;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public double getComplianceScore() { return complianceScore; }
        public void setComplianceScore(double complianceScore) { this.complianceScore = complianceScore; }
        
        public String getRecommendations() { return recommendations; }
        public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    }
}
