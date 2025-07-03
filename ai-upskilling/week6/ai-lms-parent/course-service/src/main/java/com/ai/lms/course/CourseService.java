package com.ai.lms.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Mono<Course> createCourse(Course course) {
        course.setVersion(1);
        return courseRepository.save(course);
    }

    public Mono<Course> updateCourse(Long id, Course updated) {
        return courseRepository.findById(id)
                .flatMap(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setDescription(updated.getDescription());
                    existing.setContentUrl(updated.getContentUrl());
                    existing.setTags(updated.getTags());
                    existing.setVersion(existing.getVersion() + 1);
                    return courseRepository.save(existing);
                });
    }

    public Mono<Void> deleteCourse(Long id) {
        return courseRepository.deleteById(id);
    }

    public Mono<Course> getCourse(Long id) {
        return courseRepository.findById(id);
    }

    public Flux<Course> searchByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

    public Flux<Course> searchByTag(String tag) {
        return courseRepository.findByTagsContainingIgnoreCase(tag);
    }

    public Flux<Course> getAllCourses() {
        return courseRepository.findAll();
    }
} 