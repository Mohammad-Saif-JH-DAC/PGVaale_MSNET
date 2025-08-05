package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    // ✅ List of image paths (max 5 should be handled via validation in controller
    // or frontend)
    @ElementCollection
    @CollectionTable(name = "pg_images", joinColumns = @JoinColumn(name = "pg_id"))
    @Column(name = "image_path")
    private List<String> imagePaths;

    private double latitude;
    private double longitude;

    private String amenities; // e.g., "AC,Gas,Fridge"
    private String nearbyResources; // e.g., "Hospital,Gym,Garden"

    private double rent;

    private String generalPreference;

    private String region; // Added region field
    private String availability;
}
