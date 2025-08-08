package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Feedback_Web;

import com.pgvaale.backend.repository.Feedback_WebRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Feedback_WebController {

    @Autowired
    private Feedback_WebRepository feedbackRepository;

    @PostMapping("/feedback-web")

    // @PostMapping
    public Feedback_Web submitFeedback(@RequestBody Feedback_Web feedback) {
        return feedbackRepository.save(feedback);
    }
}
