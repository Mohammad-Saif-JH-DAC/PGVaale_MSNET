package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "maid_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaidRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "maid_id")
    private Maid maid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "service_date")
    private LocalDate serviceDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    public enum RequestStatus {
        REQUESTED,
        ACCEPTED,
        REJECTED,
        COMPLETED
    }
} 