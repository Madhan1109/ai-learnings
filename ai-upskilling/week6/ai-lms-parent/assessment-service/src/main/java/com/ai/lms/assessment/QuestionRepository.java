package com.ai.lms.assessment;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface QuestionRepository extends ReactiveCrudRepository<Question, Long> {
    Flux<Question> findByQuizId(Long quizId);
} 