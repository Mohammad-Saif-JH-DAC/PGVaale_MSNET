package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feedback_tiffin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Feedback_Tiffin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tiffin_id")
    private Tiffin tiffin;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String feedback;
    private Integer rating;
}
