package com.ai.lms.assessment;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface QuizRepository extends ReactiveCrudRepository<Quiz, Long> {
    Flux<Quiz> findByCourseId(Long courseId);
} 