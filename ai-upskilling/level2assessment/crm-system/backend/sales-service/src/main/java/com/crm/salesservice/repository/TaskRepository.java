package com.crm.salesservice.repository;

import com.crm.salesservice.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find by assigned user
    List<Task> findByAssignedTo(Long assignedTo);

    // Find by status
    List<Task> findByStatus(String status);

    // Find by priority
    List<Task> findByPriority(String priority);

    // Find by customer ID
    List<Task> findByCustomerId(Long customerId);

    // Find by opportunity ID
    List<Task> findByOpportunityId(Long opportunityId);

    // Find overdue tasks
    List<Task> findByDueDateBeforeAndStatusNot(LocalDateTime now, String status);

    // Find tasks due today
    List<Task> findByDueDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    // AI-Powered Queries
    @Query("SELECT t FROM Task t WHERE t.aiPriorityScore >= :minScore ORDER BY t.aiPriorityScore DESC")
    List<Task> findHighPriorityTasks(@Param("minScore") Integer minScore);

    @Query("SELECT t FROM Task t WHERE t.assignedTo = :assignedTo AND t.aiPriorityScore >= :minScore ORDER BY t.aiPriorityScore DESC")
    List<Task> findHighPriorityTasksByUser(@Param("assignedTo") Long assignedTo, @Param("minScore") Integer minScore);

    // Task Analytics
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskStatusAnalytics();

    @Query("SELECT t.priority, COUNT(t) FROM Task t GROUP BY t.priority")
    List<Object[]> getTaskPriorityAnalytics();

    @Query("SELECT AVG(t.aiPriorityScore) FROM Task t WHERE t.assignedTo = :assignedTo")
    Double getAverageAiPriorityScoreByUser(@Param("assignedTo") Long assignedTo);

    // Task Performance Analytics
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo = :assignedTo AND t.status = 'COMPLETED'")
    Long getCompletedTaskCountByUser(@Param("assignedTo") Long assignedTo);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo = :assignedTo AND t.status = 'PENDING'")
    Long getPendingTaskCountByUser(@Param("assignedTo") Long assignedTo);

    // Task Duration Analytics
    @Query("SELECT AVG(t.estimatedDuration) FROM Task t WHERE t.assignedTo = :assignedTo")
    Double getAverageTaskDurationByUser(@Param("assignedTo") Long assignedTo);

    // Recent Tasks
    @Query("SELECT t FROM Task t WHERE t.createdAt >= :startDate ORDER BY t.createdAt DESC")
    List<Task> findRecentTasks(@Param("startDate") LocalDateTime startDate);

    // Tasks by Customer and Opportunity
    @Query("SELECT t FROM Task t WHERE t.customerId = :customerId AND t.opportunityId = :opportunityId ORDER BY t.dueDate ASC")
    List<Task> findTasksByCustomerAndOpportunity(@Param("customerId") Long customerId, @Param("opportunityId") Long opportunityId);

    // High Value Tasks (related to high-value opportunities)
    @Query("SELECT t FROM Task t WHERE t.opportunityId IN (SELECT o.id FROM Opportunity o WHERE o.aiScore >= :minScore) ORDER BY t.aiPriorityScore DESC")
    List<Task> findHighValueTasks(@Param("minScore") Integer minScore);

    // Task Summary by User
    @Query("SELECT t.assignedTo, COUNT(t), AVG(t.aiPriorityScore) FROM Task t GROUP BY t.assignedTo")
    List<Object[]> getTaskSummaryByUser();
} 