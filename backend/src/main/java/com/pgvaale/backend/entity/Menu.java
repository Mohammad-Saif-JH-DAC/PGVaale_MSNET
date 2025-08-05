package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

/** MENU ENTITY */
@Entity
@Table(name = "menus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tiffin_id", nullable = false)
    private Tiffin tiffin;

    @NotBlank
    private String dayOfWeek; // Monday, Tuesday, etc.

    @NotBlank
    private String breakfast;

    @NotBlank
    private String lunch;

    @NotBlank
    private String dinner;

    private LocalDate menuDate; // Specific date for this menu

    private String foodCategory; // Veg, Non-Veg, Both

    private Double price; // Price per meal

    @Builder.Default
    private boolean isActive = true;
} 