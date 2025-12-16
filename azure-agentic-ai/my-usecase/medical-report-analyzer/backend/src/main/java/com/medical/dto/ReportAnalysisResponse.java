package com.medical.dto;

import com.medical.entity.MedicalReport;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for medical report analysis responses
 * 
 * This DTO contains:
 * - Analysis results and recommendations
 * - Processing metadata and costs
 * - User-friendly formatted content
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportAnalysisResponse {

    private Long reportId;
    private String status;
    private String analysis;
    private String injuryType;
    private String processingTime;
    private String message;
    private String filename;
    private String aiSummary;
    private String recommendedSolutions;
    private String techniquesToFollow;
    private Double confidenceScore;
    private Long processingTimeMs;
    private Integer tokensUsed;
    private Double azureServiceCosts;
    private LocalDateTime completedAt;
    private String errorMessage;

    // Constructors
    public ReportAnalysisResponse() {}

    public ReportAnalysisResponse(Long reportId, String status, String analysis, String injuryType, String processingTime, String message) {
        this.reportId = reportId;
        this.status = status;
        this.analysis = analysis;
        this.injuryType = injuryType;
        this.processingTime = processingTime;
        this.message = message;
    }

    public ReportAnalysisResponse(MedicalReport report) {
        this.reportId = report.getId();
        this.filename = report.getFilename();
        this.injuryType = report.getInjuryType();
        this.aiSummary = report.getAiAnalysis();
        this.recommendedSolutions = report.getFinalAnalysis();
        this.techniquesToFollow = report.getFinalAnalysis();
        this.confidenceScore = 0.95; // Default confidence
        this.status = report.getProcessingStatus() != null ? report.getProcessingStatus().name() : "UNKNOWN";
        this.processingTimeMs = 0L; // Default processing time
        this.tokensUsed = 0; // Default tokens
        this.azureServiceCosts = 0.0; // Default cost
        this.completedAt = report.getCompletedAt();
    }

    public ReportAnalysisResponse(String errorMessage) {
        this.errorMessage = errorMessage;
        this.status = "FAILED";
    }

    // Static factory methods for common responses
    public static ReportAnalysisResponse success(MedicalReport report) {
        return new ReportAnalysisResponse(report);
    }

    public static ReportAnalysisResponse error(String errorMessage) {
        return new ReportAnalysisResponse(errorMessage);
    }

    public static ReportAnalysisResponse processing(Long reportId, String filename) {
        ReportAnalysisResponse response = new ReportAnalysisResponse();
        response.setReportId(reportId);
        response.setFilename(filename);
        response.setStatus("PROCESSING");
        return response;
    }

    // Getters and Setters
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }

    public String getInjuryType() { return injuryType; }
    public void setInjuryType(String injuryType) { this.injuryType = injuryType; }

    public String getProcessingTime() { return processingTime; }
    public void setProcessingTime(String processingTime) { this.processingTime = processingTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public String getRecommendedSolutions() { return recommendedSolutions; }
    public void setRecommendedSolutions(String recommendedSolutions) { this.recommendedSolutions = recommendedSolutions; }

    public String getTechniquesToFollow() { return techniquesToFollow; }
    public void setTechniquesToFollow(String techniquesToFollow) { this.techniquesToFollow = techniquesToFollow; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(Long processingTimeMs) { this.processingTimeMs = processingTimeMs; }

    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }

    public Double getAzureServiceCosts() { return azureServiceCosts; }
    public void setAzureServiceCosts(Double azureServiceCosts) { this.azureServiceCosts = azureServiceCosts; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    // Utility methods
    public boolean isSuccess() {
        return "COMPLETED".equals(status) && errorMessage == null;
    }

    public boolean isProcessing() {
        return "PROCESSING".equals(status);
    }

    public boolean isFailed() {
        return "FAILED".equals(status) || errorMessage != null;
    }

    public String getFormattedProcessingTime() {
        if (processingTimeMs != null) {
            if (processingTimeMs < 1000) {
                return processingTimeMs + "ms";
            } else {
                return String.format("%.2fs", processingTimeMs / 1000.0);
            }
        }
        return "N/A";
    }

    public String getFormattedConfidence() {
        if (confidenceScore != null) {
            return String.format("%.1f%%", confidenceScore * 100);
        }
        return "N/A";
    }

    public String getFormattedCosts() {
        if (azureServiceCosts != null) {
            return String.format("$%.4f", azureServiceCosts);
        }
        return "N/A";
    }

    @Override
    public String toString() {
        return "ReportAnalysisResponse{" +
                "reportId=" + reportId +
                ", status='" + status + '\'' +
                ", analysis='" + analysis + '\'' +
                ", injuryType='" + injuryType + '\'' +
                ", processingTime='" + processingTime + '\'' +
                ", message='" + message + '\'' +
                ", filename='" + filename + '\'' +
                ", confidenceScore=" + confidenceScore +
                ", processingTimeMs=" + processingTimeMs +
                ", tokensUsed=" + tokensUsed +
                '}';
    }
}
