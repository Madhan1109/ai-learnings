package com.ai.lms.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Course> create(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public Mono<Course> update(@PathVariable Long id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(@PathVariable Long id) {
        return courseService.deleteCourse(id);
    }

    @GetMapping("/{id}")
    public Mono<Course> get(@PathVariable Long id) {
        return courseService.getCourse(id);
    }

    @GetMapping
    public Flux<Course> getAll() {
        return courseService.getAllCourses();
    }

    @GetMapping("/search")
    public Flux<Course> search(@RequestParam(required = false) String title, @RequestParam(required = false) String tag) {
        if (title != null) {
            return courseService.searchByTitle(title);
        } else if (tag != null) {
            return courseService.searchByTag(tag);
        } else {
            return courseService.getAllCourses();
        }
    }
} 