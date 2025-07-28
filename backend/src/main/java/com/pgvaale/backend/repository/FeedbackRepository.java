package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>{

}
