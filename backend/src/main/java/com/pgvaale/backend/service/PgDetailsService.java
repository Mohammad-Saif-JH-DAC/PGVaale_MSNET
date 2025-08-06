package com.pgvaale.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pgvaale.backend.dto.PgDetailsResponseDTO;
import com.pgvaale.backend.entity.Booking;
import com.pgvaale.backend.entity.PgDetails;
import com.pgvaale.backend.repository.BookingRepository;

@Service
public class PgDetailsService {

    @Autowired
    private BookingRepository bookingRepository;

    public PgDetailsResponseDTO getPgDetailsByUserId(Long userId) {
        Booking booking = bookingRepository.findFirstByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No booking found for user"));

        PgDetails pg = booking.getPg();
        return new PgDetailsResponseDTO(
                pg.getPgName(),
                pg.getPgAddress(),
                pg.getPgRent(),
                booking.getStartDate(),
                booking.getEndDate()
        );
    }
}


