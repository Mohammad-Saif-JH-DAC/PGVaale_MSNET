package com.pgvaale.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgvaale.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findFirstByUserId(Long id);
}

