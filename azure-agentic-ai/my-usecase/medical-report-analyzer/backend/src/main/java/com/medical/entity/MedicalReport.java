package com.medical.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a medical report uploaded by users
 * 
 * This entity stores:
 * - Basic report information (filename, type, size)
 * - Extracted text content from the report
 * - AI analysis results and recommendations
 * - Processing status and metadata
 */
@Entity
@Table(name = "medical_reports")
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Filename is required")
    @Size(max = 255, message = "Filename must be less than 255 characters")
    @Column(name = "filename", nullable = false)
    private String filename;

    @NotBlank(message = "Original file path is required")
    @Column(name = "original_path", nullable = false)
    private String originalPath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type")
    private ReportType reportType;

    @Enumerated(EnumType.STRING)
    @Column(name = "processing_status", nullable = false)
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;

    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "injury_type")
    private String injuryType;

    @Column(name = "recommended_solutions", columnDefinition = "TEXT")
    private String recommendedSolutions;

    @Column(name = "techniques_to_follow", columnDefinition = "TEXT")
    private String techniquesToFollow;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @Column(name = "azure_service_costs")
    private Double azureServiceCosts;

    @Column(name = "metadata", columnDefinition = "CLOB")
    private String metadata;

    @Column(name = "ai_analysis", columnDefinition = "TEXT")
    private String aiAnalysis;

    @Column(name = "final_analysis", columnDefinition = "TEXT")
    private String finalAnalysis;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "status")
    private String status;

    @Column(name = "file_type")
    private String fileType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public MedicalReport() {}

    public MedicalReport(String filename, String originalPath, Long fileSize, String mimeType) {
        this.filename = filename;
        this.originalPath = originalPath;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.processingStatus = ProcessingStatus.PENDING;
    }

    // Enums
    public enum ReportType {
        KNEE_INJURY,
        BACK_INJURY,
        SHOULDER_INJURY,
        ANKLE_INJURY,
        WRIST_INJURY,
        OTHER
    }

    public enum ProcessingStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        CANCELLED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getOriginalPath() { return originalPath; }
    public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public ReportType getReportType() { return reportType; }
    public void setReportType(ReportType reportType) { this.reportType = reportType; }

    public ProcessingStatus getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(ProcessingStatus processingStatus) { this.processingStatus = processingStatus; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public String getInjuryType() { return injuryType; }
    public void setInjuryType(String injuryType) { this.injuryType = injuryType; }

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

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public String getAiAnalysis() { return aiAnalysis; }
    public void setAiAnalysis(String aiAnalysis) { this.aiAnalysis = aiAnalysis; }

    public String getFinalAnalysis() { return finalAnalysis; }
    public void setFinalAnalysis(String finalAnalysis) { this.finalAnalysis = finalAnalysis; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Utility methods
    public boolean isCompleted() {
        return ProcessingStatus.COMPLETED.equals(this.processingStatus);
    }

    public boolean isFailed() {
        return ProcessingStatus.FAILED.equals(this.processingStatus);
    }

    public boolean isProcessing() {
        return ProcessingStatus.PROCESSING.equals(this.processingStatus);
    }

    @Override
    public String toString() {
        return "MedicalReport{" +
                "id=" + id +
                ", filename='" + filename + '\'' +
                ", reportType=" + reportType +
                ", processingStatus=" + processingStatus +
                ", injuryType='" + injuryType + '\'' +
                ", confidenceScore=" + confidenceScore +
                ", createdAt=" + createdAt +
                '}';
    }
}
