package com.medical.controller;

import com.medical.dto.ReportAnalysisRequest;
import com.medical.dto.ReportAnalysisResponse;
import com.medical.entity.MedicalReport;
import com.medical.service.RAGPipelineService;
import com.medical.service.HealthCheckService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * REST Controller for Medical Report Analysis
 * 
 * Provides endpoints for:
 * - Medical report upload and analysis
 * - Processing status checking
 * - Analysis results retrieval
 * - Health and status monitoring
 */
@RestController
@RequestMapping("/api/medical-reports")
@CrossOrigin(origins = "*") // For development - restrict in production
public class MedicalReportController {

    private static final Logger logger = LoggerFactory.getLogger(MedicalReportController.class);

    @Autowired
    private RAGPipelineService ragPipelineService;

    @Autowired
    private HealthCheckService healthCheckService;

    /**
     * Upload and analyze medical report
     * 
     * @param file Medical report file (PDF, image)
     * @param injuryType Type of injury (optional)
     * @return Analysis response with recommendations
     */
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportAnalysisResponse> analyzeMedicalReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "injuryType", required = false) String injuryType) {
        
        try {
            logger.info("Received medical report for analysis: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("File is empty"));
            }

            // Create analysis request
            ReportAnalysisRequest request = new ReportAnalysisRequest();
            request.setFile(file.getBytes());
            request.setFileName(file.getOriginalFilename());
            request.setFileSize(file.getSize());
            request.setFileType(getFileExtension(file.getOriginalFilename()));
            request.setInjuryType(injuryType);

            // Process through RAG pipeline
            CompletableFuture<ReportAnalysisResponse> future = 
                ragPipelineService.processMedicalReport(request);

            // For now, wait for completion (in production, return immediately with status)
            ReportAnalysisResponse response = future.get();
            
            logger.info("Successfully analyzed medical report: {}", response.getReportId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error analyzing medical report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Analysis failed: " + e.getMessage()));
        }
    }

    /**
     * Get analysis status for a report
     * 
     * @param reportId Report ID
     * @return Current processing status
     */
    @GetMapping("/{reportId}/status")
    public ResponseEntity<Object> getAnalysisStatus(@PathVariable Long reportId) {
        try {
            MedicalReport.ProcessingStatus status = 
                ragPipelineService.getProcessingStatus(reportId);
            
            return ResponseEntity.ok(new StatusResponse(reportId, status.toString()));
            
        } catch (Exception e) {
            logger.error("Error getting status for report {}: {}", reportId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new StatusResponse(reportId, "ERROR"));
        }
    }

    /**
     * Get completed analysis results
     * 
     * @param reportId Report ID
     * @return Complete analysis with recommendations
     */
    @GetMapping("/{reportId}/results")
    public ResponseEntity<Object> getAnalysisResults(@PathVariable Long reportId) {
        try {
            ReportAnalysisResponse response = 
                ragPipelineService.getCompletedAnalysis(reportId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error getting results for report {}: {}", reportId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to retrieve results: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     * 
     * @return Service health status
     */
    @GetMapping("/health")
    public ResponseEntity<Object> getHealth() {
        try {
            Map<String, Object> healthStatus = healthCheckService.getComprehensiveHealthStatus();
            return ResponseEntity.ok(healthStatus);
            
        } catch (Exception e) {
            logger.error("Health check failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "service", "Medical Report Analyzer",
                    "status", "UNHEALTHY",
                    "error", e.getMessage()
                ));
        }
    }

    /**
     * System readiness check endpoint
     * 
     * @return System readiness status
     */
    @GetMapping("/ready")
    public ResponseEntity<Object> getSystemReadiness() {
        try {
            boolean isReady = healthCheckService.isSystemReady();
            Map<String, Object> readinessStatus = Map.of(
                "ready", isReady,
                "timestamp", java.time.LocalDateTime.now().toString(),
                "message", isReady ? "System is ready to process medical reports" : "System is not ready"
            );
            
            return ResponseEntity.ok(readinessStatus);
            
        } catch (Exception e) {
            logger.error("System readiness check failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "ready", false,
                    "error", e.getMessage()
                ));
        }
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "unknown";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * Create error response
     */
    private ReportAnalysisResponse createErrorResponse(String errorMessage) {
        ReportAnalysisResponse response = new ReportAnalysisResponse();
        response.setStatus("ERROR");
        response.setMessage(errorMessage);
        return response;
    }

    // Response classes for different endpoints
    public static class StatusResponse {
        private Long reportId;
        private String status;

        public StatusResponse(Long reportId, String status) {
            this.reportId = reportId;
            this.status = status;
        }

        // Getters and setters
        public Long getReportId() { return reportId; }
        public void setReportId(Long reportId) { this.reportId = reportId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class HealthResponse {
        private String service;
        private String status;
        private String details;

        public HealthResponse(String service, String status, String details) {
            this.service = service;
            this.status = status;
            this.details = details;
        }

        // Getters and setters
        public String getService() { return service; }
        public void setService(String service) { this.service = service; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }
}
