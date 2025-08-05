package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.UserTiffin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTiffinRepository extends JpaRepository<UserTiffin, Long> {
    
    List<UserTiffin> findByTiffinId(Long tiffinId);
    
    List<UserTiffin> findByUserId(Long userId);
    
    List<UserTiffin> findByTiffinIdAndStatus(Long tiffinId, UserTiffin.RequestStatus status);
    
    List<UserTiffin> findByUserIdAndStatus(Long userId, UserTiffin.RequestStatus status);
    
    Optional<UserTiffin> findByUserIdAndTiffinId(Long userId, Long tiffinId);
    
    @Query("SELECT ut FROM UserTiffin ut WHERE ut.tiffin.id = :tiffinId AND ut.status = :status ORDER BY ut.assignedDateTime DESC")
    List<UserTiffin> findByTiffinIdAndStatusOrderByAssignedDateTimeDesc(@Param("tiffinId") Long tiffinId, 
                                                                       @Param("status") UserTiffin.RequestStatus status);
    
    @Query("SELECT ut FROM UserTiffin ut WHERE ut.user.id = :userId AND ut.status = :status ORDER BY ut.assignedDateTime DESC")
    List<UserTiffin> findByUserIdAndStatusOrderByAssignedDateTimeDesc(@Param("userId") Long userId, 
                                                                     @Param("status") UserTiffin.RequestStatus status);
    
    @Query("SELECT COUNT(ut) FROM UserTiffin ut WHERE ut.tiffin.id = :tiffinId AND ut.status = :status")
    Long countByTiffinIdAndStatus(@Param("tiffinId") Long tiffinId, @Param("status") UserTiffin.RequestStatus status);
} 