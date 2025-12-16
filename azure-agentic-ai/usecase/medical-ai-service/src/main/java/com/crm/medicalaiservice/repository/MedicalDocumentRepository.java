package com.crm.medicalaiservice.repository;

import com.crm.medicalaiservice.entity.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, UUID> {

    /**
     * Find documents by document type
     */
    List<MedicalDocument> findByDocumentType(String documentType);

    /**
     * Find documents by processing status
     */
    List<MedicalDocument> findByProcessingStatus(MedicalDocument.ProcessingStatus status);

    /**
     * Find documents by uploaded user
     */
    List<MedicalDocument> findByUploadedBy(String uploadedBy);

    /**
     * Find documents by compliance score range
     */
    @Query("SELECT d FROM MedicalDocument d WHERE d.complianceScore >= :minScore AND d.complianceScore <= :maxScore")
    List<MedicalDocument> findByComplianceScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);

    /**
     * Find documents by risk level
     */
    List<MedicalDocument> findByRiskLevel(MedicalDocument.RiskLevel riskLevel);

    /**
     * Find documents by document type and exclude specific ID
     */
    List<MedicalDocument> findByDocumentTypeAndIdNot(String documentType, UUID id);

    /**
     * Find documents with low compliance scores (for review)
     */
    @Query("SELECT d FROM MedicalDocument d WHERE d.complianceScore < 0.7 ORDER BY d.complianceScore ASC")
    List<MedicalDocument> findLowComplianceDocuments();

    /**
     * Find documents uploaded within date range
     */
    @Query("SELECT d FROM MedicalDocument d WHERE d.uploadedAt BETWEEN :startDate AND :endDate ORDER BY d.uploadedAt DESC")
    List<MedicalDocument> findByUploadDateRange(@Param("startDate") java.time.LocalDateTime startDate, 
                                               @Param("endDate") java.time.LocalDateTime endDate);

    /**
     * Find documents by patient ID (encrypted)
     */
    List<MedicalDocument> findByPatientId(String patientId);

    /**
     * Count documents by document type
     */
    long countByDocumentType(String documentType);

    /**
     * Count documents by processing status
     */
    long countByProcessingStatus(MedicalDocument.ProcessingStatus status);

    /**
     * Find documents with text content containing search term
     */
    @Query("SELECT d FROM MedicalDocument d WHERE d.extractedText LIKE %:searchTerm% OR d.aiSummary LIKE %:searchTerm%")
    List<MedicalDocument> findByTextContent(@Param("searchTerm") String searchTerm);

    /**
     * Find documents by multiple criteria
     */
    @Query("SELECT d FROM MedicalDocument d WHERE " +
           "(:documentType IS NULL OR d.documentType = :documentType) AND " +
           "(:status IS NULL OR d.processingStatus = :status) AND " +
           "(:minCompliance IS NULL OR d.complianceScore >= :minCompliance) AND " +
           "(:riskLevel IS NULL OR d.riskLevel = :riskLevel)")
    List<MedicalDocument> findByMultipleCriteria(@Param("documentType") String documentType,
                                                @Param("status") MedicalDocument.ProcessingStatus status,
                                                @Param("minCompliance") Double minCompliance,
                                                @Param("riskLevel") MedicalDocument.RiskLevel riskLevel);
}
