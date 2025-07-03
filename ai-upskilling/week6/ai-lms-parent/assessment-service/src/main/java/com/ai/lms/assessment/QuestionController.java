package com.ai.lms.assessment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Question> create(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }

    @PutMapping("/{id}")
    public Mono<Question> update(@PathVariable Long id, @RequestBody Question question) {
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(@PathVariable Long id) {
        return questionService.deleteQuestion(id);
    }

    @GetMapping("/{id}")
    public Mono<Question> get(@PathVariable Long id) {
        return questionService.getQuestion(id);
    }

    @GetMapping("/quiz/{quizId}")
    public Flux<Question> getByQuiz(@PathVariable Long quizId) {
        return questionService.getByQuiz(quizId);
    }

    @GetMapping
    public Flux<Question> getAll() {
        return questionService.getAll();
    }
} 