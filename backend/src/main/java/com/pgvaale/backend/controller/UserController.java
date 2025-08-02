package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.*;
import com.pgvaale.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private MaidRequestRepository maidRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private PGRepository pgRepository;
    
    @Autowired
    private PGRoomRepository pgRoomRepository;
    
    @Autowired
    private RoomInterestRepository roomInterestRepository;
    
    @Autowired
    private TiffinRepository tiffinRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            // Get counts
            Long pgInterests = roomInterestRepository.countByUsername(user.getUsername());
            Long maidRequests = maidRequestRepository.countByUserId(user.getId());
            Long feedbackCount = feedbackRepository.countByUserId(user.getId());
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("userName", user.getName());
            dashboard.put("pgInterests", pgInterests);
            dashboard.put("maidRequests", maidRequests);
            dashboard.put("feedbackCount", feedbackCount);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching dashboard: " + e.getMessage());
        }
    }

    // PG Interests
    @GetMapping("/pgs")
    public ResponseEntity<?> getPGInterests() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            List<RoomInterest> interests = roomInterestRepository.findByUsername(user.getUsername());
            
            return ResponseEntity.ok(interests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching PG interests: " + e.getMessage());
        }
    }

    // Tiffin Services
    @GetMapping("/tiffins")
    public ResponseEntity<?> getTiffinServices() {
        try {
            List<Tiffin> tiffins = tiffinRepository.findByApprovedTrue();
            return ResponseEntity.ok(tiffins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching tiffin services: " + e.getMessage());
        }
    }

    // Maid Services
    @GetMapping("/maids")
    public ResponseEntity<?> getMaidServices() {
        try {
            List<Maid> maids = maidRepository.findByApprovedTrue();
            return ResponseEntity.ok(maids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching maid services: " + e.getMessage());
        }
    }

    // Hire Maid
    @PostMapping("/maids/hire")
    public ResponseEntity<?> hireMaid(@RequestBody Map<String, Object> requestData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            // Extract request data
            Long maidId = Long.valueOf(requestData.get("maidId").toString());
            String serviceDate = (String) requestData.get("serviceDate");
            String timeSlot = (String) requestData.get("timeSlot");
            
            Optional<Maid> maidOptional = maidRepository.findById(maidId);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Maid not found");
            }
            
            Maid maid = maidOptional.get();
            
            // Create maid request
            MaidRequest maidRequest = MaidRequest.builder()
                    .maid(maid)
                    .user(user)
                    .requestDate(LocalDate.now())
                    .serviceDate(LocalDate.parse(serviceDate))
                    .timeSlot(timeSlot)
                    .status(MaidRequest.RequestStatus.REQUESTED)
                    .build();
            
            MaidRequest savedRequest = maidRequestRepository.save(maidRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Request sent to maid!");
            response.put("requestId", savedRequest.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating service request: " + e.getMessage());
        }
    }

    // My Bookings
    @GetMapping("/bookings")
    public ResponseEntity<?> getMyBookings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            // Get all bookings
            List<RoomInterest> pgInterests = roomInterestRepository.findByUsername(user.getUsername());
            List<MaidRequest> maidRequests = maidRequestRepository.findByUserId(user.getId());
            
            Map<String, Object> bookings = new HashMap<>();
            bookings.put("pgInterests", pgInterests);
            bookings.put("maidRequests", maidRequests);
            
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }

    // Submit Feedback
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> feedbackData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            Long maidId = Long.valueOf(feedbackData.get("maidId").toString());
            Integer rating = Integer.valueOf(feedbackData.get("rating").toString());
            String feedback = (String) feedbackData.get("feedback");
            
            Optional<Maid> maidOptional = maidRepository.findById(maidId);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Maid not found");
            }
            
            Maid maid = maidOptional.get();
            
            // Check if user has completed service with this maid
            List<MaidRequest> completedRequests = maidRequestRepository.findByUserIdAndMaidIdAndStatus(
                user.getId(), maidId, MaidRequest.RequestStatus.COMPLETED);
            
            if (completedRequests.isEmpty()) {
                return ResponseEntity.badRequest().body("You can only rate maids after completing a service");
            }
            
            // Create feedback
            Feedback newFeedback = new Feedback();
            newFeedback.setUser(user);
            newFeedback.setMaid(maid);
            newFeedback.setRating(rating);
            newFeedback.setFeedback(feedback);
            
            feedbackRepository.save(newFeedback);
            
            return ResponseEntity.ok("Feedback submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting feedback: " + e.getMessage());
        }
    }

    // Get My Feedback
    @GetMapping("/feedback")
    public ResponseEntity<?> getMyFeedback() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            List<Feedback> feedback = feedbackRepository.findByUserId(user.getId());
            
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching feedback: " + e.getMessage());
        }
    }

    // Get Messages
    @GetMapping("/messages")
    public ResponseEntity<?> getMessages() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            List<ChatMessage> messages = chatMessageRepository.findByReceiverId(user.getId());
            
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching messages: " + e.getMessage());
        }
    }

    // Send Message
    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> messageData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOptional.get();
            
            Long receiverId = Long.valueOf(messageData.get("receiverId").toString());
            String message = (String) messageData.get("message");
            
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSenderId(user.getId());
            chatMessage.setReceiverId(receiverId);
            chatMessage.setMessage(message);
            
            chatMessageRepository.save(chatMessage);
            
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending message: " + e.getMessage());
        }
    }
} 