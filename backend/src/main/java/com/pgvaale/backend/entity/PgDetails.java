package com.pgvaale.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// ...existing code...
@Entity
@Getter
@Setter
@Table(name = "pg_details")
public class PgDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pgId;

    private String pgName;
    private String pgAddress;
    private Double pgRent;

    // Getters & Setters
}

