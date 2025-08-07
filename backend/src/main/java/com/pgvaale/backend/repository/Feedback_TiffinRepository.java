package com.pgvaale.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pgvaale.backend.entity.Feedback_Tiffin;

import java.util.List;

public interface Feedback_TiffinRepository extends JpaRepository<Feedback_Tiffin, Long> {

    @Query("SELECT AVG(f.rating) FROM Feedback_Tiffin f")
    Double averageFeedbackRating();

    @Query("SELECT COUNT(f) FROM Feedback_Tiffin f")
    Long countFeedback();

    @Query("SELECT f FROM Feedback_Tiffin f WHERE f.user.id = :userId")
    List<Feedback_Tiffin> findByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Feedback_Tiffin f WHERE f.tiffin.id = :tiffinId")
    List<Feedback_Tiffin> findByTiffinId(@Param("tiffinId") Long tiffinId);
}
