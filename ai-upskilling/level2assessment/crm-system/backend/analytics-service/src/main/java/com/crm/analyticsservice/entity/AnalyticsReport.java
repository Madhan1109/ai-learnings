package com.crm.analyticsservice.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_reports")
@EntityListeners(AuditingEntityListener.class)
public class AnalyticsReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String insights;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "ai_generated")
    private Boolean aiGenerated = true;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "data_points_analyzed")
    private Integer dataPointsAnalyzed;

    @Column(name = "time_period_start")
    private LocalDateTime timePeriodStart;

    @Column(name = "time_period_end")
    private LocalDateTime timePeriodEnd;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public AnalyticsReport() {}

    public AnalyticsReport(String reportType, String title, String description) {
        this.reportType = reportType;
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInsights() {
        return insights;
    }

    public void setInsights(String insights) {
        this.insights = insights;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public Boolean getAiGenerated() {
        return aiGenerated;
    }

    public void setAiGenerated(Boolean aiGenerated) {
        this.aiGenerated = aiGenerated;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public Integer getDataPointsAnalyzed() {
        return dataPointsAnalyzed;
    }

    public void setDataPointsAnalyzed(Integer dataPointsAnalyzed) {
        this.dataPointsAnalyzed = dataPointsAnalyzed;
    }

    public LocalDateTime getTimePeriodStart() {
        return timePeriodStart;
    }

    public void setTimePeriodStart(LocalDateTime timePeriodStart) {
        this.timePeriodStart = timePeriodStart;
    }

    public LocalDateTime getTimePeriodEnd() {
        return timePeriodEnd;
    }

    public void setTimePeriodEnd(LocalDateTime timePeriodEnd) {
        this.timePeriodEnd = timePeriodEnd;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "AnalyticsReport{" +
                "id=" + id +
                ", reportType='" + reportType + '\'' +
                ", title='" + title + '\'' +
                ", aiGenerated=" + aiGenerated +
                ", confidenceScore=" + confidenceScore +
                ", dataPointsAnalyzed=" + dataPointsAnalyzed +
                '}';
    }
} 