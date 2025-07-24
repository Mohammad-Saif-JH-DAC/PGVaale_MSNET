package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.PGRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PGRoomRepository extends JpaRepository<PGRoom, Long> {
    List<PGRoom> findByRegion(String region);
    List<PGRoom> findByState(String state);
    List<PGRoom> findByGender(String gender);
    List<PGRoom> findByAvailable(boolean available);
    List<PGRoom> findByCreatedBy(String createdBy);
} 