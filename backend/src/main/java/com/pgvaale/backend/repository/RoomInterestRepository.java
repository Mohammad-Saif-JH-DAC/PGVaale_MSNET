package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.RoomInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomInterestRepository extends JpaRepository<RoomInterest, Long> {
    List<RoomInterest> findByRoomId(Long roomId);
} 