package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.entity.UserMaid;
import com.pgvaale.backend.entity.Feedback;
import com.pgvaale.backend.repository.MaidRepository;
import com.pgvaale.backend.repository.UserMaidRepository;
import com.pgvaale.backend.repository.FeedbackRepository;
import com.pgvaale.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/maid")
public class MaidController {
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private UserMaidRepository userMaidRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            System.out.println("Fetching profile for username: " + username);
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                System.out.println("Maid not found for username: " + username);
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            System.out.println("Found maid: " + maid.getName() + ", Email: " + maid.getEmail());
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", maid.getId());
            profile.put("name", maid.getName());
            profile.put("email", maid.getEmail());
            profile.put("phoneNumber", maid.getPhoneNumber());
            profile.put("region", maid.getRegion());
            profile.put("services", maid.getServices());
            profile.put("timing", maid.getTiming());
            profile.put("monthlySalary", maid.getMonthlySalary());
            profile.put("gender", maid.getGender());
            profile.put("approved", maid.isApproved());

            
            System.out.println("Profile data: " + profile);
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.out.println("Error fetching profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            
            // Update fields
            if (profileData.containsKey("name")) {
                maid.setName((String) profileData.get("name"));
            }
            if (profileData.containsKey("email")) {
                maid.setEmail((String) profileData.get("email"));
            }
            if (profileData.containsKey("phoneNumber")) {
                maid.setPhoneNumber((String) profileData.get("phoneNumber"));
            }
            if (profileData.containsKey("region")) {
                maid.setRegion((String) profileData.get("region"));
            }
            if (profileData.containsKey("services")) {
                maid.setServices((String) profileData.get("services"));
            }
            if (profileData.containsKey("timing")) {
                maid.setTiming((String) profileData.get("timing"));
            }
            if (profileData.containsKey("monthlySalary")) {
                Object salaryObj = profileData.get("monthlySalary");
                if (salaryObj instanceof Number) {
                    maid.setMonthlySalary(((Number) salaryObj).doubleValue());
                } else if (salaryObj instanceof String) {
                    try {
                        maid.setMonthlySalary(Double.parseDouble((String) salaryObj));
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest().body("Invalid salary format");
                    }
                }
            }

            
            Maid savedMaid = maidRepository.save(maid);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            Long maidId = maid.getId();
            
            // Get counts
            Long pendingRequests = userMaidRepository.countByMaidIdAndStatus(maidId, UserMaid.RequestStatus.PENDING);
            Long acceptedJobs = userMaidRepository.countByMaidIdAndStatus(maidId, UserMaid.RequestStatus.ACCEPTED);
            
            // Calculate average rating
            Double averageRating = feedbackRepository.findAverageRatingByMaidId(maidId);
            
            // Get recent activity
            List<UserMaid> recentRequests = userMaidRepository.findAllRequestsByMaidId(maidId);
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("maidName", maid.getName());
            dashboard.put("pendingRequests", pendingRequests);
            dashboard.put("acceptedJobs", acceptedJobs);
            dashboard.put("averageRating", averageRating != null ? averageRating : 0.0);
            dashboard.put("recentRequests", recentRequests);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getServiceRequests() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Long maidId = maidOptional.get().getId();
            List<UserMaid> requests = userMaidRepository.findAllRequestsByMaidId(maidId);
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching requests: " + e.getMessage());
        }
    }

    @PostMapping("/requests/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> statusData) {
        try {
            String newStatus = statusData.get("status");
            if (newStatus == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            
            Optional<UserMaid> requestOptional = userMaidRepository.findById(requestId);
            if (!requestOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            UserMaid request = requestOptional.get();
            
            // Verify the request belongs to the authenticated maid
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            
            if (!maidOptional.isPresent() || !request.getMaid().getId().equals(maidOptional.get().getId())) {
                return ResponseEntity.status(403).body("Unauthorized");
            }
            
            try {
                UserMaid.RequestStatus status = UserMaid.RequestStatus.valueOf(newStatus.toUpperCase());
                request.setStatus(status);
                
                // If status is ACCEPTED, update the accepted date time
                if (status == UserMaid.RequestStatus.ACCEPTED) {
                    request.setAcceptedDateTime(LocalDateTime.now());
                }
                
                userMaidRepository.save(request);
                return ResponseEntity.ok("Request status updated successfully");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating request status: " + e.getMessage());
        }
    }

    // Get requests by status
    @GetMapping("/requests/status/{status}")
    public ResponseEntity<?> getRequestsByStatus(@PathVariable String status) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Long maidId = maidOptional.get().getId();
            
            try {
                UserMaid.RequestStatus requestStatus = UserMaid.RequestStatus.valueOf(status.toUpperCase());
                List<UserMaid> requests = userMaidRepository.findByMaidIdAndStatus(maidId, requestStatus);
                
                return ResponseEntity.ok(requests);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching requests: " + e.getMessage());
        }
    }
    
    // Get all available maids (for users to hire)
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableMaids(@RequestParam(required = false) String region) {
        try {
            List<Maid> maids;
            
            if (region != null && !region.trim().isEmpty()) {
                // Filter by region if provided
                maids = maidRepository.findByRegionAndApprovedTrue(region);
            } else {
                // Get all approved maids
                maids = maidRepository.findByApprovedTrue();
            }
            
            return ResponseEntity.ok(maids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching available maids: " + e.getMessage());
        }
    }
    
    // Get maid details by ID
    @GetMapping("/{maidId}")
    public ResponseEntity<?> getMaidById(@PathVariable Long maidId) {
        try {
            Optional<Maid> maidOptional = maidRepository.findById(maidId);
            
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            
            // Only return approved maids
            if (!maid.isApproved()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(maid);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching maid details: " + e.getMessage());
        }
    }

    // Delete maid account
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteAccount() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            Long maidId = maid.getId();
            
            // Delete all feedback for this maid
            List<Feedback> maidFeedback = feedbackRepository.findByMaidId(maidId);
            feedbackRepository.deleteAll(maidFeedback);
            
            // Delete all user-maid relationships for this maid
            List<UserMaid> userMaidRelations = userMaidRepository.findByMaidId(maidId);
            userMaidRepository.deleteAll(userMaidRelations);
            
            // Delete the maid account
            maidRepository.delete(maid);
            
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting account: " + e.getMessage());
        }
    }
} 