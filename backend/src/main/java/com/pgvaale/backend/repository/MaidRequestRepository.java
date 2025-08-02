package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.MaidRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaidRequestRepository extends JpaRepository<MaidRequest, Long> {
    
    List<MaidRequest> findByMaidId(Long maidId);
    
    List<MaidRequest> findByMaidIdAndStatus(Long maidId, MaidRequest.RequestStatus status);
    
    @Query("SELECT COUNT(mr) FROM MaidRequest mr WHERE mr.maid.id = :maidId AND mr.status = :status")
    Long countByMaidIdAndStatus(@Param("maidId") Long maidId, @Param("status") MaidRequest.RequestStatus status);
    
    @Query("SELECT mr FROM MaidRequest mr WHERE mr.maid.id = :maidId ORDER BY mr.requestDate DESC")
    List<MaidRequest> findRecentRequestsByMaidId(@Param("maidId") Long maidId);
    
    List<MaidRequest> findByUserId(Long userId);
    
    @Query("SELECT COUNT(mr) FROM MaidRequest mr WHERE mr.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    List<MaidRequest> findByUserIdAndMaidIdAndStatus(Long userId, Long maidId, MaidRequest.RequestStatus status);
} 