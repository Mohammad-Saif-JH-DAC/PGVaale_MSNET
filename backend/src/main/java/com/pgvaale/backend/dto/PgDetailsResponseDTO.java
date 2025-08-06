package com.pgvaale.backend.dto;

public class PgDetailsResponseDTO {

    private String pgName;
    private String pgAddress;
    private Double pgRent;
    private String startDate;
    private String endDate;

    // Constructor
    public PgDetailsResponseDTO(String pgName, String pgAddress, Double pgRent, String startDate, String endDate) {
        this.pgName = pgName;
        this.pgAddress = pgAddress;
        this.pgRent = pgRent;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters
}
