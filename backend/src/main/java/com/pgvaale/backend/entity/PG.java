package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

/** PG ENTITY */
@Entity
@Table(name = "pgs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PG {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pg_seq")
    @SequenceGenerator(name = "pg_seq", sequenceName = "pg_sequence", initialValue = 9000, allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User registeredUser;

    private String imageUrl; // Cloudinary or Blob storage URL

    private double latitude;
    private double longitude;

    private String amenities; // CSV or JSON ("AC,Gas,Fridge,Table,Bed")
    private String nearbyResources; // CSV or JSON ("Hospital,Gym,Garden")

    private double rent;

    private String generalPreference;
} 