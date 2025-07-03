package com.ai.lms.enrollment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final ProgressService progressService;

    @Autowired
    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Progress> completeLesson(@RequestBody Progress progress) {
        return progressService.completeLesson(progress);
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public Flux<Progress> getByEnrollment(@PathVariable Long enrollmentId) {
        return progressService.getByEnrollment(enrollmentId);
    }

    @GetMapping("/lesson/{lessonId}")
    public Flux<Progress> getByLesson(@PathVariable Long lessonId) {
        return progressService.getByLesson(lessonId);
    }

    @GetMapping
    public Flux<Progress> getAll() {
        return progressService.getAll();
    }
} 