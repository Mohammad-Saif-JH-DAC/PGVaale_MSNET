package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Feedback;
import com.pgvaale.backend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // Adjust for deployment if needed


public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @PostMapping("/feedback")

    //@PostMapping
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

}
