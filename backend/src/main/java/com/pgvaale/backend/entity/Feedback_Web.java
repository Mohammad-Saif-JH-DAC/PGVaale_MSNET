package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feedback_web")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Feedback_Web {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String feedback;
    private Integer rating;
}
