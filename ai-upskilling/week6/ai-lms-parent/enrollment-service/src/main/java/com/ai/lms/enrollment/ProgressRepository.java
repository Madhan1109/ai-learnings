package com.ai.lms.enrollment;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ProgressRepository extends ReactiveCrudRepository<Progress, Long> {
    Flux<Progress> findByEnrollmentId(Long enrollmentId);
    Flux<Progress> findByLessonId(Long lessonId);
} 