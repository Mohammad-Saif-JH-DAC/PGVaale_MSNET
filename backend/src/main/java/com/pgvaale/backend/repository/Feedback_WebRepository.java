package com.pgvaale.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pgvaale.backend.entity.Feedback_Web;

public interface Feedback_WebRepository extends JpaRepository<Feedback_Web, Long> {

    @Query("SELECT AVG(f.rating) FROM Feedback_Web f")
    Double averageFeedbackRating();

    @Query("SELECT COUNT(f) FROM Feedback_Web f")
    Long count_feedback();
}
