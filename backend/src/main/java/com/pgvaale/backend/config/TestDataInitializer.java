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
        // Create test maids if they don't exist
        createTestMaids();
        
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
                    .startDate(LocalDate.now().plusDays(1))
                    .endDate(LocalDate.now().plusDays(3))
                    .timeSlot(maid.getTiming()) // Use maid's timing
                    .status(UserMaid.RequestStatus.PENDING)
                    .userAddress("123 Test Street, Test City")
                    .build();
            
            UserMaid request2 = UserMaid.builder()
                    .maid(maid)
                    .user(user)
                    .assignedDateTime(LocalDateTime.now().minusDays(1))
                    .startDate(LocalDate.now().plusDays(2))
                    .endDate(LocalDate.now().plusDays(4))
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
    
    private void createTestMaids() {
        // Check if test maids already exist
        if (maidRepository.findByUsername("testmaid1").isEmpty()) {
            Maid maid1 = new Maid();
            maid1.setName("Priya Sharma");
            maid1.setEmail("priya@test.com");
            maid1.setPhoneNumber("9876543210");
            maid1.setUsername("testmaid1");
            maid1.setPassword("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"); // password
            maid1.setRegion("Mumbai");
            maid1.setServices("Cleaning, Cooking");
            maid1.setMonthlySalary(8000);
            maid1.setTiming("08:00 - 18:00");
            maid1.setGender("Female");
            maid1.setApproved(true);
            maidRepository.save(maid1);
        }
        
        if (maidRepository.findByUsername("testmaid2").isEmpty()) {
            Maid maid2 = new Maid();
            maid2.setName("Rajesh Kumar");
            maid2.setEmail("rajesh@test.com");
            maid2.setPhoneNumber("9876543211");
            maid2.setUsername("testmaid2");
            maid2.setPassword("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"); // password
            maid2.setRegion("Pune");
            maid2.setServices("Cooking, Ironing");
            maid2.setMonthlySalary(10000);
            maid2.setTiming("09:00 - 21:00");
            maid2.setGender("Male");
            maid2.setApproved(true);
            maidRepository.save(maid2);
        }
        
        if (maidRepository.findByUsername("testmaid3").isEmpty()) {
            Maid maid3 = new Maid();
            maid3.setName("Sunita Patel");
            maid3.setEmail("sunita@test.com");
            maid3.setPhoneNumber("9876543212");
            maid3.setUsername("testmaid3");
            maid3.setPassword("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"); // password
            maid3.setRegion("Hyderabad");
            maid3.setServices("Cleaning, Laundry");
            maid3.setMonthlySalary(7500);
            maid3.setTiming("07:00 - 17:00");
            maid3.setGender("Female");
            maid3.setApproved(true);
            maidRepository.save(maid3);
        }
        
        System.out.println("Test maids created successfully!");
    }
} 