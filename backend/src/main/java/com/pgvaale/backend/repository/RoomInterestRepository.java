package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.RoomInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface RoomInterestRepository extends JpaRepository<RoomInterest, Long> {
    List<RoomInterest> findByRoomId(Long roomId);
    
    List<RoomInterest> findByUsername(String username);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(ri) FROM RoomInterest ri WHERE ri.username = :username")
    Long countByUsername(@org.springframework.data.repository.query.Param("username") String username);
} 