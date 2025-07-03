package com.ai.lms.assessment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public Mono<Quiz> createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public Mono<Quiz> updateQuiz(Long id, Quiz updated) {
        return quizRepository.findById(id)
                .flatMap(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setDescription(updated.getDescription());
                    return quizRepository.save(existing);
                });
    }

    public Mono<Void> deleteQuiz(Long id) {
        return quizRepository.deleteById(id);
    }

    public Mono<Quiz> getQuiz(Long id) {
        return quizRepository.findById(id);
    }

    public Flux<Quiz> getByCourse(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public Flux<Quiz> getAll() {
        return quizRepository.findAll();
    }
} 