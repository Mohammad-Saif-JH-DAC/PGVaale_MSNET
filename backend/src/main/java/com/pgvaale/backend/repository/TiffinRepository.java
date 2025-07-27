package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.Tiffin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TiffinRepository extends JpaRepository<Tiffin, Long> {
    Optional<Tiffin> findByUsername(String username);
    Optional<Tiffin> findByEmail(String email);
    List<Tiffin> findByApprovedFalse();
} 