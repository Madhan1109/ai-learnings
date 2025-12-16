package com.medical.repository;

import com.medical.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MedicalReport entity
 * 
 * Provides database operations for:
 * - CRUD operations on medical reports
 * - Status-based queries
 * - Cost tracking queries
 * - Date range searches
 */
@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    /**
     * Find reports by processing status
     */
    List<MedicalReport> findByProcessingStatus(MedicalReport.ProcessingStatus status);
    
    /**
     * Find reports by injury type
     */
    List<MedicalReport> findByInjuryType(String injuryType);
    
    /**
     * Find reports created within a date range
     */
    List<MedicalReport> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find reports by filename
     */
    Optional<MedicalReport> findByFilename(String filename);
    
    /**
     * Find reports with high token usage (for cost monitoring)
     */
    @Query("SELECT r FROM MedicalReport r WHERE r.tokensUsed > :threshold")
    List<MedicalReport> findByHighTokenUsage(@Param("threshold") int threshold);
    
    /**
     * Find reports with high Azure service costs (for cost monitoring)
     */
    @Query("SELECT r FROM MedicalReport r WHERE r.azureServiceCosts > :threshold")
    List<MedicalReport> findByHighServiceCost(@Param("threshold") double threshold);
    
    /**
     * Count reports by status for monitoring
     */
    @Query("SELECT r.processingStatus, COUNT(r) FROM MedicalReport r GROUP BY r.processingStatus")
    List<Object[]> countByStatus();
    
    /**
     * Find reports by processing status and injury type
     */
    List<MedicalReport> findByProcessingStatusAndInjuryType(
        MedicalReport.ProcessingStatus status, 
        String injuryType
    );
}
