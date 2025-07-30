package com.crm.customerservice.repository;

import com.crm.customerservice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find by email
    Optional<Customer> findByEmail(String email);

    // Find by company name
    List<Customer> findByCompanyContainingIgnoreCase(String company);

    // Find by industry
    List<Customer> findByIndustry(String industry);

    // Find by status
    List<Customer> findByStatus(String status);

    // Find by assigned user
    List<Customer> findByAssignedTo(Long assignedTo);

    // Find customers with high lead scores
    List<Customer> findByLeadScoreGreaterThan(Integer minScore);

    // Find by name containing (case insensitive)
    List<Customer> findByNameContainingIgnoreCase(String name);

    // Custom query for AI-powered lead scoring
    @Query("SELECT c FROM Customer c WHERE c.leadScore >= :minScore ORDER BY c.leadScore DESC")
    List<Customer> findHighValueLeads(@Param("minScore") Integer minScore);

    // Custom query for customers by industry and status
    @Query("SELECT c FROM Customer c WHERE c.industry = :industry AND c.status = :status")
    List<Customer> findByIndustryAndStatus(@Param("industry") String industry, @Param("status") String status);

    // Custom query for customers assigned to specific user with high lead scores
    @Query("SELECT c FROM Customer c WHERE c.assignedTo = :assignedTo AND c.leadScore >= :minScore ORDER BY c.leadScore DESC")
    List<Customer> findAssignedHighValueLeads(@Param("assignedTo") Long assignedTo, @Param("minScore") Integer minScore);

    // Count customers by status
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = :status")
    Long countByStatus(@Param("status") String status);

    // Get average lead score
    @Query("SELECT AVG(c.leadScore) FROM Customer c")
    Double getAverageLeadScore();

    // Find customers created in the last N days
    @Query("SELECT c FROM Customer c WHERE c.createdAt >= :startDate")
    List<Customer> findRecentCustomers(@Param("startDate") java.time.LocalDateTime startDate);
} 