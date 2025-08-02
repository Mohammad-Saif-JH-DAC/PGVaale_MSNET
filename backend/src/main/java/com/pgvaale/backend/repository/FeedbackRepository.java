package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double averageFeedbackRating();
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.maid.id = :maidId")
    Double findAverageRatingByMaidId(@Param("maidId") Long maidId);
    
    List<Feedback> findByMaidId(Long maidId);
    
    List<Feedback> findByUserId(Long userId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
