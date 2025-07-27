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
    private String phoneNumber;

    @NotBlank
    @Size(min = 12, max = 12)
    private String aadhaar;

    private String services; // CSV or JSON ("Mobbing,Cooking")

    private double monthlySalary;

    private String gender;

    private String timing;

    private String region;
    
    @Builder.Default
    private boolean approved = false; // Admin approval status
} 