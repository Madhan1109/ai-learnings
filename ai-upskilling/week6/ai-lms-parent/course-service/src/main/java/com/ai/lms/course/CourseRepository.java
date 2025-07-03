package com.ai.lms.course;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface CourseRepository extends ReactiveCrudRepository<Course, Long> {
    Flux<Course> findByTitleContainingIgnoreCase(String title);
    Flux<Course> findByTagsContainingIgnoreCase(String tag);
} 