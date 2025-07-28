package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contactUs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @Column(length = 1000)
    private String message;
}