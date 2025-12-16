package com.medical.service;

import com.medical.dto.ReportAnalysisRequest;
import com.medical.dto.ReportAnalysisResponse;
import com.medical.entity.MedicalReport;
import com.medical.repository.MedicalReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

/**
 * RAG (Retrieval-Augmented Generation) Pipeline Service
 * 
 * Orchestrates the complete medical report analysis workflow:
 * 1. Document upload and OCR processing
 * 2. Text extraction using Azure Document Intelligence
 * 3. AI analysis using Azure OpenAI
 * 4. Knowledge base integration with Azure Cognitive Search
 * 5. Solution generation and recommendations
 */
@Service
public class RAGPipelineService {

    private static final Logger logger = LoggerFactory.getLogger(RAGPipelineService.class);

    @Autowired(required = false)
    private AzureDocumentIntelligenceService azureDocumentService;

    @Autowired(required = false)
    private AzureOpenAIService azureOpenAIService;

    @Autowired(required = false)
    private AzureCognitiveSearchService azureCognitiveSearchService;

    @Autowired(required = false)
    private MockAzureDocumentIntelligenceService mockDocumentService;

    @Autowired(required = false)
    private MockAzureOpenAIService mockOpenAIService;

    @Autowired(required = false)
    private MockAzureCognitiveSearchService mockCognitiveSearchService;

    @Autowired
    private MedicalReportRepository reportRepository;

    /**
     * Process medical report through the complete RAG pipeline
     * 
     * @param request Analysis request with file and preferences
     * @return Analysis response with recommendations
     */
    @Async
    public CompletableFuture<ReportAnalysisResponse> processMedicalReport(ReportAnalysisRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            MedicalReport report = createMedicalReport(request);
            
            try {
                // Step 1: Extract text from document
                String extractedText = extractDocumentText(request.getFile(), request.getFileName());
                report.setExtractedText(extractedText);
                report.setProcessingStatus(MedicalReport.ProcessingStatus.PROCESSING);
                reportRepository.save(report);

                // Step 2: Analyze extracted text with AI
                String aiAnalysis = analyzeWithAI(extractedText, request.getInjuryType());
                report.setAiAnalysis(aiAnalysis);
                
                // Step 3: Integrate with medical knowledge base
                String enhancedAnalysis = enhanceWithKnowledgeBase(aiAnalysis, request.getInjuryType());
                report.setFinalAnalysis(enhancedAnalysis);
                
                // Step 4: Generate comprehensive response
                ReportAnalysisResponse response = buildAnalysisResponse(report, enhancedAnalysis);
                
                // Step 5: Update report status
                report.setProcessingStatus(MedicalReport.ProcessingStatus.COMPLETED);
                report.setCompletedAt(LocalDateTime.now());
                reportRepository.save(report);

                logger.info("Successfully processed medical report: {}", report.getId());
                return response;

            } catch (Exception e) {
                logger.error("Error processing medical report: {}", e.getMessage());
                report.setProcessingStatus(MedicalReport.ProcessingStatus.FAILED);
                report.setErrorMessage(e.getMessage());
                reportRepository.save(report);
                
                throw new RuntimeException("Report processing failed: " + e.getMessage(), e);
            }
        });
    }

    /**
     * Extract text from uploaded document
     */
    private String extractDocumentText(byte[] file, String fileName) {
        try {
            if (azureDocumentService != null && azureDocumentService.isServiceAvailable()) {
                logger.info("Using Azure Document Intelligence for text extraction");
                return azureDocumentService.extractTextFromDocument(file, fileName).get();
            } else {
                logger.info("Using mock document service for text extraction");
                return mockDocumentService.extractTextFromDocument(file, fileName).get();
            }
        } catch (Exception e) {
            throw new RuntimeException("Document text extraction failed", e);
        }
    }

    /**
     * Analyze extracted text with Azure OpenAI
     */
    private String analyzeWithAI(String extractedText, String injuryType) {
        try {
            if (azureOpenAIService != null && azureOpenAIService.isServiceAvailable()) {
                logger.info("Using Azure OpenAI for AI analysis");
                return azureOpenAIService.analyzeMedicalReport(extractedText, injuryType);
            } else {
                logger.info("Using mock OpenAI service for AI analysis");
                return mockOpenAIService.analyzeMedicalReport(extractedText, injuryType);
            }
        } catch (Exception e) {
            throw new RuntimeException("AI analysis failed", e);
        }
    }

    /**
     * Enhance AI analysis with medical knowledge base using Azure Cognitive Search
     */
    private String enhanceWithKnowledgeBase(String aiAnalysis, String injuryType) {
        StringBuilder enhancedAnalysis = new StringBuilder();
        enhancedAnalysis.append(aiAnalysis).append("\n\n");
        
        try {
            if (azureCognitiveSearchService != null && azureCognitiveSearchService.isServiceAvailable()) {
                logger.info("Using Azure Cognitive Search for medical knowledge");
                String medicalKnowledge = azureCognitiveSearchService.getRelevantMedicalKnowledge(injuryType, "treatment recovery");
                enhancedAnalysis.append(medicalKnowledge);
            } else {
                logger.info("Using mock cognitive search service for medical knowledge");
                String medicalKnowledge = mockCognitiveSearchService.getRelevantMedicalKnowledge(injuryType, "treatment recovery");
                enhancedAnalysis.append(medicalKnowledge);
            }
            
        } catch (Exception e) {
            logger.warn("Failed to retrieve medical knowledge from search service: {}", e.getMessage());
            
            // Fallback to basic knowledge
            enhancedAnalysis.append("Additional Medical Knowledge:\n");
            enhancedAnalysis.append("============================\n\n");
            enhancedAnalysis.append("General Injury Recovery Guidelines:\n");
            enhancedAnalysis.append("• Rest and allow proper healing time\n");
            enhancedAnalysis.append("• Follow medical professional advice\n");
            enhancedAnalysis.append("• Gradual return to normal activities\n");
            enhancedAnalysis.append("• Monitor for any worsening symptoms\n");
        }
        
        return enhancedAnalysis.toString();
    }

    /**
     * Create medical report entity
     */
    private MedicalReport createMedicalReport(ReportAnalysisRequest request) {
        MedicalReport report = new MedicalReport();
        report.setFilename(request.getFileName()); // Use correct method name
        report.setOriginalPath("uploaded/" + request.getFileName()); // Set required originalPath
        report.setInjuryType(request.getInjuryType() != null && !request.getInjuryType().trim().isEmpty() 
            ? request.getInjuryType() : "general");
        report.setProcessingStatus(MedicalReport.ProcessingStatus.PENDING); // Use correct enum
        report.setFileSize(request.getFileSize());
        report.setFileType(request.getFileType());
        
        return reportRepository.save(report);
    }

    /**
     * Build analysis response
     */
    private ReportAnalysisResponse buildAnalysisResponse(MedicalReport report, String analysis) {
        ReportAnalysisResponse response = new ReportAnalysisResponse();
        response.setReportId(report.getId());
        response.setStatus("COMPLETED");
        response.setAnalysis(analysis);
        response.setInjuryType(report.getInjuryType() != null && !report.getInjuryType().trim().isEmpty() 
            ? report.getInjuryType() : "general");
        response.setProcessingTime(LocalDateTime.now().toString());
        response.setMessage("Medical report analysis completed successfully");
        
        return response;
    }

    /**
     * Get processing status for a report
     */
    public MedicalReport.ProcessingStatus getProcessingStatus(Long reportId) {
        return reportRepository.findById(reportId)
            .map(report -> report.getProcessingStatus())
            .orElse(MedicalReport.ProcessingStatus.FAILED);
    }

    /**
     * Get completed analysis by report ID
     */
    public ReportAnalysisResponse getCompletedAnalysis(Long reportId) {
        MedicalReport report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        
        if (!MedicalReport.ProcessingStatus.COMPLETED.equals(report.getProcessingStatus())) {
            throw new RuntimeException("Report analysis not completed yet. Status: " + report.getProcessingStatus());
        }
        
        return buildAnalysisResponse(report, report.getFinalAnalysis());
    }

    /**
     * Check if pipeline services are available
     */
    public boolean areServicesAvailable() {
        boolean documentAvailable = mockDocumentService != null && mockDocumentService.isServiceAvailable();
        boolean openAIAvailable = mockOpenAIService != null && mockOpenAIService.isServiceAvailable();
        boolean searchAvailable = mockCognitiveSearchService != null && mockCognitiveSearchService.isServiceAvailable();
        
        return documentAvailable && openAIAvailable && searchAvailable;
    }

    /**
     * Get pipeline status information
     */
    public String getPipelineStatus() {
        String documentStatus = (mockDocumentService != null && mockDocumentService.isServiceAvailable()) ? "Mock Available" : "Unavailable";
        String openAIStatus = (mockOpenAIService != null && mockOpenAIService.isServiceAvailable()) ? "Mock Available" : "Unavailable";
        String searchStatus = (mockCognitiveSearchService != null && mockCognitiveSearchService.isServiceAvailable()) ? "Mock Available" : "Unavailable";
        
        return String.format("RAG Pipeline Status - Document Service: %s, OpenAI Service: %s, Search Service: %s",
            documentStatus, openAIStatus, searchStatus
        );
    }
}
