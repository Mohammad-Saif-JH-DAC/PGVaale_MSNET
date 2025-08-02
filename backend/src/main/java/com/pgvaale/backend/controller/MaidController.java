package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.entity.MaidRequest;
import com.pgvaale.backend.entity.Feedback;
import com.pgvaale.backend.repository.MaidRepository;
import com.pgvaale.backend.repository.MaidRequestRepository;
import com.pgvaale.backend.repository.FeedbackRepository;
import com.pgvaale.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    private MaidRequestRepository maidRequestRepository;
    
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
            Long pendingRequests = maidRequestRepository.countByMaidIdAndStatus(maidId, MaidRequest.RequestStatus.REQUESTED);
            Long acceptedJobs = maidRequestRepository.countByMaidIdAndStatus(maidId, MaidRequest.RequestStatus.ACCEPTED);
            
            // Calculate average rating
            Double averageRating = feedbackRepository.findAverageRatingByMaidId(maidId);
            
            // Get recent activity
            List<MaidRequest> recentRequests = maidRequestRepository.findRecentRequestsByMaidId(maidId);
            
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
            List<MaidRequest> requests = maidRequestRepository.findByMaidId(maidId);
            
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
            
            Optional<MaidRequest> requestOptional = maidRequestRepository.findById(requestId);
            if (!requestOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            MaidRequest request = requestOptional.get();
            
            // Verify the request belongs to the authenticated maid
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            
            if (!maidOptional.isPresent() || !request.getMaid().getId().equals(maidOptional.get().getId())) {
                return ResponseEntity.status(403).body("Unauthorized");
            }
            
            try {
                MaidRequest.RequestStatus status = MaidRequest.RequestStatus.valueOf(newStatus.toUpperCase());
                request.setStatus(status);
                maidRequestRepository.save(request);
                return ResponseEntity.ok("Request status updated successfully");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating request status: " + e.getMessage());
        }
    }
} 