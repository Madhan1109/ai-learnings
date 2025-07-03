package com.ai.lms.enrollment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProgressService {
    private final ProgressRepository progressRepository;

    @Autowired
    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public Mono<Progress> completeLesson(Progress progress) {
        progress.setCompleted(true);
        return progressRepository.save(progress);
    }

    public Flux<Progress> getByEnrollment(Long enrollmentId) {
        return progressRepository.findByEnrollmentId(enrollmentId);
    }

    public Flux<Progress> getByLesson(Long lessonId) {
        return progressRepository.findByLessonId(lessonId);
    }

    public Flux<Progress> getAll() {
        return progressRepository.findAll();
    }
} 