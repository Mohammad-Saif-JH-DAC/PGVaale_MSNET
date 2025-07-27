package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.PG;
import com.pgvaale.backend.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PGRepository extends JpaRepository<PG, Long> {
    List<PG> findByOwner(Owner owner);
} 