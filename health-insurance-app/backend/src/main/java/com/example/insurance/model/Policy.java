package com.example.insurance.model;

import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "policies")
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_number", unique = true, nullable = false)
    private String policyNumber;

    @Column(name = "holder_name", nullable = false)
    private String holderName;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false)
    private String gender;

    @Column(name = "plan_type", nullable = false)
    private String planType;

    @Column(name = "sum_insured", nullable = false)
    private double sumInsured;

    @Column(nullable = false)
    private double premium;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
} 