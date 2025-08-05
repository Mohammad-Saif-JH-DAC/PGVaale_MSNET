package com.pgvaale.backend.config;

import com.pgvaale.backend.entity.*;
import com.pgvaale.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class TestDataInitializer implements CommandLineRunner {

    @Autowired
    private UserMaidRepository userMaidRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only add test data if no requests exist
        if (userMaidRepository.count() == 0) {
            addTestData();
        }
    }

    private void addTestData() {
        // Find existing maid and user for testing
        var maidOptional = maidRepository.findByUsername("Peru@06");
        var userOptional = userRepository.findByUsername("testuser");
        
        if (maidOptional.isPresent() && userOptional.isPresent()) {
            Maid maid = maidOptional.get();
            User user = userOptional.get();
            
            // Add sample service requests
            UserMaid request1 = UserMaid.builder()
                    .maid(maid)
                    .user(user)
                    .assignedDateTime(LocalDateTime.now().minusDays(2))
                    .serviceDate(LocalDate.now().plusDays(1))
                    .timeSlot(maid.getTiming()) // Use maid's timing
                    .status(UserMaid.RequestStatus.PENDING)
                    .userAddress("123 Test Street, Test City")
                    .build();
            
            UserMaid request2 = UserMaid.builder()
                    .maid(maid)
                    .user(user)
                    .assignedDateTime(LocalDateTime.now().minusDays(1))
                    .serviceDate(LocalDate.now().plusDays(2))
                    .timeSlot(maid.getTiming()) // Use maid's timing
                    .status(UserMaid.RequestStatus.ACCEPTED)
                    .userAddress("456 Sample Road, Sample City")
                    .build();
            
            userMaidRepository.save(request1);
            userMaidRepository.save(request2);
            
            // Add sample feedback
            Feedback feedback1 = new Feedback();
            feedback1.setMaid(maid);
            feedback1.setUser(user);
            feedback1.setRating(5);
            feedback1.setFeedback("Excellent cleaning service!");
            
            Feedback feedback2 = new Feedback();
            feedback2.setMaid(maid);
            feedback2.setUser(user);
            feedback2.setRating(4);
            feedback2.setFeedback("Good work, very professional.");
            
            feedbackRepository.save(feedback1);
            feedbackRepository.save(feedback2);
            
            System.out.println("Test data added successfully!");
        }
    }
} 