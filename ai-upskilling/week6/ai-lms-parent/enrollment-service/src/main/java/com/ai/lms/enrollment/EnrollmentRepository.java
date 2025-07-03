package com.ai.lms.enrollment;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface EnrollmentRepository extends ReactiveCrudRepository<Enrollment, Long> {
    Flux<Enrollment> findByUserId(Long userId);
    Flux<Enrollment> findByCourseId(Long courseId);
} 