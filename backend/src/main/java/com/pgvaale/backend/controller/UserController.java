package com.pgvaale.backend.controller;

import com.pgvaale.backend.dto.MenuDTO;
import com.pgvaale.backend.dto.UserTiffinDTO;
import com.pgvaale.backend.entity.Feedback;
import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.entity.RoomInterest;
import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.entity.UserMaid;
import com.pgvaale.backend.entity.UserTiffin;
import com.pgvaale.backend.repository.FeedbackRepository;
import com.pgvaale.backend.repository.MaidRepository;
import com.pgvaale.backend.repository.RoomInterestRepository;
import com.pgvaale.backend.repository.UserMaidRepository;
import com.pgvaale.backend.repository.UserRepository;
import com.pgvaale.backend.service.TiffinService;
import com.pgvaale.backend.service.UserService;
import com.pgvaale.backend.service.UserMaidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private TiffinService tiffinService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private UserMaidRepository userMaidRepository;
    
    @Autowired
    private RoomInterestRepository roomInterestRepository;
    
    @Autowired
    private UserMaidService userMaidService;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    // Get all available maids
    @GetMapping("/maids")
    public ResponseEntity<?> getAllMaids() {
        try {
            List<Maid> maids = maidRepository.findByApprovedTrue();
            return ResponseEntity.ok(maids);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching maids: " + e.getMessage());
        }
    }
    
    // Get maid details
    @GetMapping("/maids/{maidId}")
    public ResponseEntity<?> getMaidDetails(@PathVariable Long maidId) {
        try {
            Optional<Maid> maidOptional = maidRepository.findById(maidId);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            if (!maid.isApproved()) {
                return ResponseEntity.badRequest().body("Maid is not approved");
            }
            
            return ResponseEntity.ok(maid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching maid details: " + e.getMessage());
        }
    }
    
    // Send request to maid (legacy endpoint)
    @PostMapping("/maids/{maidId}/request")
    public ResponseEntity<?> sendMaidRequest(@PathVariable Long maidId, @RequestBody Map<String, Object> requestData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            // Use UserMaidService to create request with proper validation
            String userAddress = (String) requestData.get("userAddress");
            String startDateStr = (String) requestData.get("startDate");
            String endDateStr = (String) requestData.get("endDate");
            String timeSlot = (String) requestData.get("timeSlot");
            
            LocalDate startDate = startDateStr != null ? LocalDate.parse(startDateStr) : LocalDate.now().plusDays(1);
            LocalDate endDate = endDateStr != null ? LocalDate.parse(endDateStr) : LocalDate.now().plusDays(7);
            
            UserMaid savedRequest = userMaidService.createHiringRequest(userId, maidId, userAddress, startDate, endDate, timeSlot);
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending request: " + e.getMessage());
        }
    }
    
    // Hire maid (frontend endpoint)
    @PostMapping("/maids/hire")
    public ResponseEntity<?> hireMaid(@RequestBody Map<String, Object> requestData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            Long maidId = Long.valueOf(requestData.get("maidId").toString());
            
            // Use UserMaidService to create request with proper validation
            String userAddress = (String) requestData.get("userAddress");
            String startDateStr = (String) requestData.get("startDate");
            String endDateStr = (String) requestData.get("endDate");
            String timeSlot = (String) requestData.get("timeSlot");
            
            LocalDate startDate = startDateStr != null ? LocalDate.parse(startDateStr) : LocalDate.now().plusDays(1);
            LocalDate endDate = endDateStr != null ? LocalDate.parse(endDateStr) : LocalDate.now().plusDays(7);
            
            UserMaid savedRequest = userMaidService.createHiringRequest(userId, maidId, userAddress, startDate, endDate, timeSlot);
            return ResponseEntity.ok(Map.of("message", "Maid hired successfully", "request", savedRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error hiring maid: " + e.getMessage());
        }
    }
    
    // Get user's maid requests
    @GetMapping("/maid-requests")
    public ResponseEntity<?> getUserMaidRequests(@RequestParam(required = false) String status) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            UserMaid.RequestStatus requestStatus = null;
            if (status != null && !status.isEmpty()) {
                requestStatus = UserMaid.RequestStatus.valueOf(status.toUpperCase());
            }
            
            List<UserMaid> requests;
            if (requestStatus != null) {
                requests = userMaidRepository.findByUserIdAndStatus(userId, requestStatus);
            } else {
                requests = userMaidRepository.findByUserId(userId);
            }
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching maid requests: " + e.getMessage());
        }
    }
    
    // Cancel maid request
    @DeleteMapping("/maid-requests/{requestId}")
    public ResponseEntity<?> cancelMaidRequest(@PathVariable Long requestId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            Optional<UserMaid> requestOptional = userMaidRepository.findById(requestId);
            if (!requestOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            UserMaid request = requestOptional.get();
            if (!request.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }
            
            if (request.getStatus() != UserMaid.RequestStatus.PENDING) {
                return ResponseEntity.badRequest().body("Cannot cancel non-pending request");
            }
            
            userMaidRepository.delete(request);
            return ResponseEntity.ok("Request cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error cancelling request: " + e.getMessage());
        }
    }
    
    // Change maid for accepted request
    @PostMapping("/maid-requests/{requestId}/change")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> changeMaidForRequest(@PathVariable Long requestId) {
        try {
            // Find the existing request
            Optional<UserMaid> requestOptional = userMaidRepository.findById(requestId);
            if (!requestOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            UserMaid existingRequest = requestOptional.get();
            
            // Check if request is accepted
            if (existingRequest.getStatus() != UserMaid.RequestStatus.ACCEPTED) {
                return ResponseEntity.badRequest().body("Can only change maid for accepted requests");
            }
            
            // Cancel the existing request
            existingRequest.setStatus(UserMaid.RequestStatus.CANCELLED);
            existingRequest.setDeletionDateTime(LocalDateTime.now());
            userMaidRepository.save(existingRequest);
            
            return ResponseEntity.ok(Map.of(
                "message", "Maid request cancelled. You can now hire a different maid.",
                "requestId", existingRequest.getId()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error changing maid: " + e.getMessage());
        }
    }
    
    // Get user's active maid service
    @GetMapping("/active-maid-service")
    public ResponseEntity<?> getActiveMaidService() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            List<UserMaid> activeRequests = userMaidRepository.findByUserIdAndStatus(userId, UserMaid.RequestStatus.ACCEPTED);
            
            if (activeRequests.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No active maid service"));
            }
            
            // Get the most recent accepted request
            UserMaid activeService = activeRequests.get(0);
            
            Map<String, Object> response = Map.of(
                "activeService", activeService,
                "maid", activeService.getMaid()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching active maid service: " + e.getMessage());
        }
    }
    
    // Get user's active maid service (frontend endpoint)
    @GetMapping("/maids/active")
    public ResponseEntity<?> getActiveMaidServiceFrontend() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            List<UserMaid> activeRequests = userMaidRepository.findByUserIdAndStatus(userId, UserMaid.RequestStatus.ACCEPTED);
            
            if (activeRequests.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No active maid service"));
            }
            
            // Get the most recent accepted request
            UserMaid activeService = activeRequests.get(0);
            
            Map<String, Object> response = Map.of(
                "activeService", activeService,
                "maid", activeService.getMaid()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching active maid service: " + e.getMessage());
        }
    }
    
    // Get all available tiffin providers
    @GetMapping("/tiffins")
    public ResponseEntity<?> getAllTiffins() {
        try {
            List<Tiffin> tiffins = tiffinService.getAllTiffins();
            return ResponseEntity.ok(tiffins);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching tiffins: " + e.getMessage());
        }
    }
    
    // Get tiffin details with menu
    @GetMapping("/tiffins/{tiffinId}")
    public ResponseEntity<?> getTiffinDetails(@PathVariable Long tiffinId) {
        try {
            Tiffin tiffin = tiffinService.getTiffinById(tiffinId).orElse(null);
            if (tiffin == null) {
                return ResponseEntity.notFound().build();
            }
            
            List<MenuDTO> menus = tiffinService.getWeeklyMenu(tiffinId);
            
            Map<String, Object> response = Map.of(
                "tiffin", tiffin,
                "menus", menus
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching tiffin details: " + e.getMessage());
        }
    }
    
    // Send request to tiffin provider
    @PostMapping("/tiffins/{tiffinId}/request")
    public ResponseEntity<?> sendTiffinRequest(@PathVariable Long tiffinId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            // Get user ID from username (you might need to adjust this based on your auth setup)
            Long userId = getUserIdFromUsername(username);
            
            UserTiffinDTO request = tiffinService.createUserRequest(userId, tiffinId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending request: " + e.getMessage());
        }
    }
    
    // Get user's tiffin requests
    @GetMapping("/requests")
    public ResponseEntity<?> getUserRequests(@RequestParam(required = false) String status) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            UserTiffin.RequestStatus requestStatus = null;
            if (status != null && !status.isEmpty()) {
                requestStatus = UserTiffin.RequestStatus.valueOf(status.toUpperCase());
            }
            
            List<UserTiffinDTO> requests = tiffinService.getUserRequests(userId, requestStatus);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests: " + e.getMessage());
        }
    }
    
    // Cancel tiffin request
    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<?> cancelRequest(@PathVariable Long requestId) {
        try {
            tiffinService.cancelUserRequest(requestId);
            return ResponseEntity.ok("Request cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error cancelling request: " + e.getMessage());
        }
    }
    
    // Get user's active tiffin service
    @GetMapping("/active-service")
    public ResponseEntity<?> getActiveService() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            List<UserTiffinDTO> activeRequests = tiffinService.getUserRequests(userId, UserTiffin.RequestStatus.ACCEPTED);
            
            if (activeRequests.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No active tiffin service"));
            }
            
            // Get the most recent accepted request
            UserTiffinDTO activeService = activeRequests.get(0);
            
            // Get tiffin details and menu
            Tiffin tiffin = tiffinService.getTiffinById(activeService.getTiffinId()).orElse(null);
            List<MenuDTO> menus = tiffinService.getWeeklyMenu(activeService.getTiffinId());
            
            Map<String, Object> response = Map.of(
                "activeService", activeService,
                "tiffin", tiffin,
                "menus", menus
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching active service: " + e.getMessage());
        }
    }
    
    // Get all user bookings (PG interests, tiffin requests, maid requests)
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            // Get maid requests
            List<UserMaid> maidRequests = userMaidRepository.findByUserId(userId);
            
            // Get tiffin requests
            List<UserTiffinDTO> tiffinRequests = tiffinService.getUserRequests(userId, null);
            
            // Get PG interests (you'll need to implement this based on your PG interest entity)
            // For now, I'll create an empty list
            List<Object> pgInterests = new ArrayList<>();
            
            Map<String, Object> bookings = Map.of(
                "maidRequests", maidRequests,
                "tiffinRequests", tiffinRequests,
                "pgInterests", pgInterests
            );
            
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching bookings: " + e.getMessage());
        }
    }
    
    // Get user's PG interests
    @GetMapping("/pgs")
    public ResponseEntity<?> getUserPGInterests() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            // Get user's room interests from the database
            List<RoomInterest> interests = roomInterestRepository.findByUsername(username);
            return ResponseEntity.ok(interests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching PG interests: " + e.getMessage());
        }
    }
    
    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "username", user.getUsername(),
                "mobileNumber", user.getMobileNumber(),
                "age", user.getAge(),
                "gender", user.getGender(),
                "aadhaar", user.getAadhaar(),
                "uniqueId", user.getUniqueId()
            );
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }
    
    // Get user's feedback
    @GetMapping("/feedback")
    public ResponseEntity<?> getUserFeedback() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            // Get user's feedback from repository
            List<Feedback> userFeedback = feedbackRepository.findByUserId(userId);
            return ResponseEntity.ok(userFeedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching feedback: " + e.getMessage());
        }
    }
    
    // Submit feedback
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> feedbackData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long userId = getUserIdFromUsername(username);
            
            // Get user and maid entities
            Optional<User> userOptional = userRepository.findById(userId);
            Optional<Maid> maidOptional = maidRepository.findById(Long.valueOf(feedbackData.get("maidId").toString()));
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            if (!maidOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Maid not found");
            }
            
            // Create feedback object
            Feedback feedback = new Feedback();
            feedback.setUser(userOptional.get());
            feedback.setMaid(maidOptional.get());
            feedback.setRating(Integer.valueOf(feedbackData.get("rating").toString()));
            feedback.setFeedback((String) feedbackData.get("feedback"));
            
            // Save feedback
            Feedback savedFeedback = feedbackRepository.save(feedback);
            return ResponseEntity.ok(savedFeedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting feedback: " + e.getMessage());
        }
    }
    
    // Helper method to get user ID from username
    private Long getUserIdFromUsername(String username) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                return user.get().getId();
            }
            throw new RuntimeException("User not found for username: " + username);
        } catch (Exception e) {
            throw new RuntimeException("Error getting user ID: " + e.getMessage());
        }
    }
}