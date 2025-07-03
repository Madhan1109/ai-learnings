package com.ai.lms.assessment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Quiz> create(@RequestBody Quiz quiz) {
        return quizService.createQuiz(quiz);
    }

    @PutMapping("/{id}")
    public Mono<Quiz> update(@PathVariable Long id, @RequestBody Quiz quiz) {
        return quizService.updateQuiz(id, quiz);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(@PathVariable Long id) {
        return quizService.deleteQuiz(id);
    }

    @GetMapping("/{id}")
    public Mono<Quiz> get(@PathVariable Long id) {
        return quizService.getQuiz(id);
    }

    @GetMapping("/course/{courseId}")
    public Flux<Quiz> getByCourse(@PathVariable Long courseId) {
        return quizService.getByCourse(courseId);
    }

    @GetMapping
    public Flux<Quiz> getAll() {
        return quizService.getAll();
    }
} 