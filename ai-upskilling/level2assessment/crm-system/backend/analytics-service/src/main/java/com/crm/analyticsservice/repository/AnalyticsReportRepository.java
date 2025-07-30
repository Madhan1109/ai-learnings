package com.crm.analyticsservice.repository;

import com.crm.analyticsservice.entity.AnalyticsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsReportRepository extends JpaRepository<AnalyticsReport, Long> {

    // Find by report type
    List<AnalyticsReport> findByReportType(String reportType);

    // Find AI-generated reports
    List<AnalyticsReport> findByAiGeneratedTrue();

    // Find by report type and AI-generated
    List<AnalyticsReport> findByReportTypeAndAiGeneratedTrue(String reportType);

    // Find high confidence reports
    List<AnalyticsReport> findByConfidenceScoreGreaterThanOrderByConfidenceScoreDesc(Double minConfidence);

    // Find recent reports
    List<AnalyticsReport> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime since);

    // Find public reports
    List<AnalyticsReport> findByIsPublicTrue();

    // Find by created by
    List<AnalyticsReport> findByCreatedBy(Long createdBy);

    // AI-Powered Queries
    @Query("SELECT ar FROM AnalyticsReport ar WHERE ar.confidenceScore >= :minScore AND ar.aiGenerated = true ORDER BY ar.confidenceScore DESC")
    List<AnalyticsReport> findHighConfidenceAIReports(@Param("minScore") Double minScore);

    @Query("SELECT ar FROM AnalyticsReport ar WHERE ar.dataPointsAnalyzed >= :minDataPoints ORDER BY ar.dataPointsAnalyzed DESC")
    List<AnalyticsReport> findReportsWithHighDataPoints(@Param("minDataPoints") Integer minDataPoints);

    // Analytics Queries
    @Query("SELECT COUNT(ar) FROM AnalyticsReport ar WHERE ar.aiGenerated = true")
    Long countByAiGeneratedTrue();

    @Query("SELECT COUNT(ar) FROM AnalyticsReport ar WHERE ar.isPublic = true")
    Long countByIsPublicTrue();

    @Query("SELECT COUNT(ar) FROM AnalyticsReport ar WHERE ar.createdAt >= :since")
    Long countByCreatedAtAfter(@Param("since") LocalDateTime since);

    @Query("SELECT AVG(ar.confidenceScore) FROM AnalyticsReport ar")
    Double getAverageConfidenceScore();

    @Query("SELECT ar.reportType, COUNT(ar) FROM AnalyticsReport ar GROUP BY ar.reportType ORDER BY COUNT(ar) DESC")
    List<Object[]> getTopReportTypes();

    // Advanced Analytics
    @Query("SELECT ar.reportType, AVG(ar.confidenceScore) FROM AnalyticsReport ar GROUP BY ar.reportType")
    List<Object[]> getAverageConfidenceByReportType();

    @Query("SELECT ar.reportType, COUNT(ar) FROM AnalyticsReport ar WHERE ar.aiGenerated = true GROUP BY ar.reportType")
    List<Object[]> getAIReportCountByType();

    @Query("SELECT ar.reportType, AVG(ar.dataPointsAnalyzed) FROM AnalyticsReport ar GROUP BY ar.reportType")
    List<Object[]> getAverageDataPointsByReportType();

    // Time-based Analytics
    @Query("SELECT DATE(ar.createdAt), COUNT(ar) FROM AnalyticsReport ar WHERE ar.createdAt >= :startDate GROUP BY DATE(ar.createdAt) ORDER BY DATE(ar.createdAt)")
    List<Object[]> getReportCountByDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT ar.reportType, COUNT(ar) FROM AnalyticsReport ar WHERE ar.createdAt >= :startDate GROUP BY ar.reportType")
    List<Object[]> getReportCountByTypeSince(@Param("startDate") LocalDateTime startDate);

    // Performance Analytics
    @Query("SELECT AVG(ar.confidenceScore) FROM AnalyticsReport ar WHERE ar.reportType = :reportType")
    Double getAverageConfidenceByType(@Param("reportType") String reportType);

    @Query("SELECT COUNT(ar) FROM AnalyticsReport ar WHERE ar.reportType = :reportType AND ar.aiGenerated = true")
    Long getAIReportCountByType(@Param("reportType") String reportType);

    // Search and Filter
    @Query("SELECT ar FROM AnalyticsReport ar WHERE ar.title LIKE %:keyword% OR ar.description LIKE %:keyword%")
    List<AnalyticsReport> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT ar FROM AnalyticsReport ar WHERE ar.confidenceScore BETWEEN :minConfidence AND :maxConfidence")
    List<AnalyticsReport> findByConfidenceRange(@Param("minConfidence") Double minConfidence, @Param("maxConfidence") Double maxConfidence);

    // Summary Statistics
    @Query("SELECT COUNT(ar), AVG(ar.confidenceScore), AVG(ar.dataPointsAnalyzed) FROM AnalyticsReport ar")
    Object[] getSummaryStatistics();

    @Query("SELECT ar.reportType, COUNT(ar), AVG(ar.confidenceScore) FROM AnalyticsReport ar GROUP BY ar.reportType")
    List<Object[]> getReportTypeStatistics();
} 