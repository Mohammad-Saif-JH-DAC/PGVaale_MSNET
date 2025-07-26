package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/** TIFFIN ENTITY */
@Entity
@Table(name = "tiffins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tiffin extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tiffin_seq")
    @SequenceGenerator(name = "tiffin_seq", sequenceName = "tiffin_sequence", initialValue = 3000, allocationSize = 1)
    private Long id;

    @NotBlank
    @Size(min = 10, max = 10)
    private String phoneNumber;

    @NotBlank
    @Size(min = 12, max = 12)
    private String aadhaar;

    private double price;

    private String foodCategory; // "Veg" or "Non-Veg"

    private String region;

    private String maidAddress;
    
    @Builder.Default
    private boolean approved = false; // Admin approval status
} 