package com.pgvaale.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pg_rooms")
public class PGRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String address;
    private String region;
    private String state;
    private String gender;
    private Double rent;
    private boolean available = true;
    private String createdBy; // username of the owner

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Double getRent() { return rent; }
    public void setRent(Double rent) { this.rent = rent; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
} 