package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.PG;
import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PGRepository extends JpaRepository<PG, Long> {
    List<PG> findByOwner(Owner owner);

    List<PG> findByRegion(String region);

    List<PG> findByGeneralPreference(String generalPreference);

    List<PG> findByRegisteredUser(User registeredUser);

    // List<PG> findByAvailability(String available);
}