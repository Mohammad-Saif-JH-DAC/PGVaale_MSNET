package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.Maid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaidRepository extends JpaRepository<Maid, Long> {
    Optional<Maid> findByUsername(String username);
    Optional<Maid> findByEmail(String email);
    List<Maid> findByApprovedFalse();
    List<Maid> findByApprovedTrue();
} 