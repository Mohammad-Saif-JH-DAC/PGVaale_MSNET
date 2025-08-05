package com.pgvaale.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/** OWNER ENTITY */
@Entity
@Table(name = "owners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Owner extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "owner_seq")
    @SequenceGenerator(name = "owner_seq", sequenceName = "owner_sequence", initialValue = 1000, allocationSize = 1)
    private Long id;

    @Min(0)
    private int age;

    @NotBlank
    @Size(min = 12, max = 12)
    private String aadhaar;

    @Column(name = "mobile_number")
    @NotBlank
    @Size(min = 10, max = 10)
    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @NotBlank
    private String region;
}