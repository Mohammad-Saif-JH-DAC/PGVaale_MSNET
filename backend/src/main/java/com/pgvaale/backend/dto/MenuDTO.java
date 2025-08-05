package com.pgvaale.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
    private Long id;
    private Long tiffinId;
    private String dayOfWeek;
    private String breakfast;
    private String lunch;
    private String dinner;
    private LocalDate menuDate;
    private boolean isActive;
    private String foodCategory;
    private Double price;
} 