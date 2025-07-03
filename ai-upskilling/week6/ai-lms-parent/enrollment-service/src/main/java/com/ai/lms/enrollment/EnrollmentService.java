package com.ai.lms.enrollment;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public EnrollmentService(EnrollmentRepository enrollmentRepository, RabbitTemplate rabbitTemplate) {
        this.enrollmentRepository = enrollmentRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Mono<Enrollment> enroll(Enrollment enrollment) {
        enrollment.setStatus("ACTIVE");
        return enrollmentRepository.save(enrollment)
                .doOnSuccess(e -> rabbitTemplate.convertAndSend("enrollment.exchange", "enrollment.created", e));
    }

    public Mono<Enrollment> completeEnrollment(Long id, String certificateUrl) {
        return enrollmentRepository.findById(id)
                .flatMap(enrollment -> {
                    enrollment.setStatus("COMPLETED");
                    enrollment.setCertificateUrl(certificateUrl);
                    return enrollmentRepository.save(enrollment)
                        .doOnSuccess(e -> rabbitTemplate.convertAndSend("enrollment.exchange", "enrollment.completed", e));
                });
    }

    public Flux<Enrollment> getByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public Flux<Enrollment> getByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Mono<Enrollment> getById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public Flux<Enrollment> getAll() {
        return enrollmentRepository.findAll();
    }
} 