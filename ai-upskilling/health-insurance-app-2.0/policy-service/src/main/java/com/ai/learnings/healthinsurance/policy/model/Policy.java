package com.ai.learnings.healthinsurance.policy.model;

import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String policyNumber;

    @Column(nullable = false)
    private String policyHolderName;

    @Column(nullable = false)
    private int years;

    @Column(nullable = false)
    private double price;
} 