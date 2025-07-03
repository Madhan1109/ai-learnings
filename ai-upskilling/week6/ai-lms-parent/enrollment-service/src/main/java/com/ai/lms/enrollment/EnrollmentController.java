package com.ai.lms.enrollment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Enrollment> enroll(@RequestBody Enrollment enrollment) {
        return enrollmentService.enroll(enrollment);
    }

    @PutMapping("/{id}/complete")
    public Mono<Enrollment> complete(@PathVariable Long id, @RequestParam String certificateUrl) {
        return enrollmentService.completeEnrollment(id, certificateUrl);
    }

    @GetMapping("/user/{userId}")
    public Flux<Enrollment> getByUser(@PathVariable Long userId) {
        return enrollmentService.getByUser(userId);
    }

    @GetMapping("/course/{courseId}")
    public Flux<Enrollment> getByCourse(@PathVariable Long courseId) {
        return enrollmentService.getByCourse(courseId);
    }

    @GetMapping("/{id}")
    public Mono<Enrollment> getById(@PathVariable Long id) {
        return enrollmentService.getById(id);
    }

    @GetMapping
    public Flux<Enrollment> getAll() {
        return enrollmentService.getAll();
    }
} 