package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/** USER TIFFIN ENTITY */
@Entity
@Table(name = "user_tiffins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTiffin extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tiffin_id", nullable = false)
    private Tiffin tiffin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status; // PENDING, ACCEPTED, REJECTED

    @Column(nullable = false)
    private LocalDateTime assignedDateTime; // When request was made

    private LocalDateTime deletionDateTime; // When service ends

    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
} 