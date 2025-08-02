package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/** MAID ENTITY */
@Entity
@Table(name = "maids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maid extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "maid_seq")
    @SequenceGenerator(name = "maid_seq", sequenceName = "maid_sequence", initialValue = 2000, allocationSize = 1)
    private Long id;

    @NotBlank
    @Size(min = 10, max = 10)
    @Column(name = "phone_number")
    private String phoneNumber;

    @NotBlank
    @Size(min = 12, max = 12)
    @Column(name = "aadhaar")
    private String aadhaar;

    @Column(name = "services")
    private String services; // CSV or JSON ("Mobbing,Cooking")

    @Column(name = "monthly_salary")
    private double monthlySalary;

    @Column(name = "gender")
    private String gender;

    @Column(name = "timing")
    private String timing;

    @Column(name = "region")
    private String region;
    
    @Column(name = "approved")
    @Builder.Default
    private boolean approved = false; // Admin approval status
} 