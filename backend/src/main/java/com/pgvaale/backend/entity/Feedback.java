package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "maid_id")
    private Maid maid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String feedback;
    private Integer rating;
}
