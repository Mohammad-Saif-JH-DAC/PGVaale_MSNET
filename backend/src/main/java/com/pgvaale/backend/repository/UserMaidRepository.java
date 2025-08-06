package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.UserMaid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMaidRepository extends JpaRepository<UserMaid, Long> {
    
    // Find all requests for a specific maid
    List<UserMaid> findByMaidId(Long maidId);
    
    // Find all requests for a specific user
    List<UserMaid> findByUserId(Long userId);
    
    // Count requests for a specific user
    Long countByUserId(Long userId);
    
    // Find requests by status for a maid (excluding deleted/canceled requests)
    @Query("SELECT um FROM UserMaid um WHERE um.maid.id = :maidId AND um.status = :status AND um.deletionDateTime IS NULL")
    List<UserMaid> findByMaidIdAndStatus(@Param("maidId") Long maidId, @Param("status") UserMaid.RequestStatus status);
    
    // Find requests by status for a user (excluding deleted/canceled requests)
    @Query("SELECT um FROM UserMaid um WHERE um.user.id = :userId AND um.status = :status AND um.deletionDateTime IS NULL")
    List<UserMaid> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") UserMaid.RequestStatus status);
    
    // Find requests by user, maid, and status (excluding deleted/canceled requests)
    @Query("SELECT um FROM UserMaid um WHERE um.user.id = :userId AND um.maid.id = :maidId AND um.status = :status AND um.deletionDateTime IS NULL")
    List<UserMaid> findByUserIdAndMaidIdAndStatus(@Param("userId") Long userId, @Param("maidId") Long maidId, @Param("status") UserMaid.RequestStatus status);
    
    // Find active requests (not deleted) for a maid
    @Query("SELECT um FROM UserMaid um WHERE um.maid.id = :maidId AND um.deletionDateTime IS NULL")
    List<UserMaid> findActiveRequestsByMaidId(@Param("maidId") Long maidId);
    
    // Find active requests (not deleted) for a user
    @Query("SELECT um FROM UserMaid um WHERE um.user.id = :userId AND um.deletionDateTime IS NULL")
    List<UserMaid> findActiveRequestsByUserId(@Param("userId") Long userId);
    
    // Find accepted requests for a user (active maid service)
    @Query("SELECT um FROM UserMaid um WHERE um.user.id = :userId AND um.status = 'ACCEPTED' AND um.deletionDateTime IS NULL")
    List<UserMaid> findAcceptedRequestsByUserId(@Param("userId") Long userId);
    
    // Count pending requests for a maid (excluding deleted/canceled requests)
    @Query("SELECT COUNT(um) FROM UserMaid um WHERE um.maid.id = :maidId AND um.status = :status AND um.deletionDateTime IS NULL")
    Long countByMaidIdAndStatus(@Param("maidId") Long maidId, @Param("status") UserMaid.RequestStatus status);
    
    // Check if a user has an active request with a specific maid
    @Query("SELECT COUNT(um) > 0 FROM UserMaid um WHERE um.user.id = :userId AND um.maid.id = :maidId AND um.deletionDateTime IS NULL")
    boolean existsActiveRequestByUserIdAndMaidId(@Param("userId") Long userId, @Param("maidId") Long maidId);
    
    // Count active requests for a user (excluding deleted/canceled requests)
    @Query("SELECT COUNT(um) FROM UserMaid um WHERE um.user.id = :userId AND um.deletionDateTime IS NULL")
    Long countActiveRequestsByUserId(@Param("userId") Long userId);
    
    // Check if a user has any active request
    @Query("SELECT COUNT(um) > 0 FROM UserMaid um WHERE um.user.id = :userId AND um.deletionDateTime IS NULL")
    boolean existsActiveRequestByUserId(@Param("userId") Long userId);
    
    // Find all requests for a maid (including canceled ones)
    @Query("SELECT um FROM UserMaid um WHERE um.maid.id = :maidId")
    List<UserMaid> findAllRequestsByMaidId(@Param("maidId") Long maidId);
} 