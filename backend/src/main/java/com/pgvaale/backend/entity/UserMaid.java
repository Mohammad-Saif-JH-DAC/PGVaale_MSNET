package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_maid")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class UserMaid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "maid_id", nullable = false)
    private Maid maid;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;
    
    @Column(name = "assigned_date_time")
    private LocalDateTime assignedDateTime;
    
    @Column(name = "accepted_date_time")
    private LocalDateTime acceptedDateTime;
    
    @Column(name = "deletion_date_time")
    private LocalDateTime deletionDateTime;
    
    @Column(name = "user_address")
    private String userAddress;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "time_slot")
    private String timeSlot;
    
    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED, CANCELLED
    }
} 