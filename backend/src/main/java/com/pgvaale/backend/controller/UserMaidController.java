package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.UserMaid;
import com.pgvaale.backend.service.UserMaidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user-maid")
public class UserMaidController {
    
    @Autowired
    private UserMaidService userMaidService;
    
    // Create a new maid hiring request
    @PostMapping("/request")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createHiringRequest(@RequestBody Map<String, Object> requestData) {
        try {
            Long userId = Long.valueOf(requestData.get("userId").toString());
            Long maidId = Long.valueOf(requestData.get("maidId").toString());
            String userAddress = (String) requestData.get("userAddress");
            String startDateStr = (String) requestData.get("startDate");
            String endDateStr = (String) requestData.get("endDate");
            String timeSlot = (String) requestData.get("timeSlot");
            
            if (userAddress == null || userAddress.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("User address is required");
            }
            
            if (startDateStr == null || startDateStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Start date is required");
            }
            
            if (endDateStr == null || endDateStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("End date is required");
            }
            
            if (timeSlot == null || timeSlot.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Time slot is required");
            }
            
            LocalDate startDate = LocalDate.parse(startDateStr);
            LocalDate endDate = LocalDate.parse(endDateStr);
            
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().body("Start date must be before or equal to end date");
            }
            
            UserMaid userMaid = userMaidService.createHiringRequest(userId, maidId, userAddress, startDate, endDate, timeSlot);
            
            return ResponseEntity.ok(Map.of(
                "message", "Maid hiring request created successfully",
                "requestId", userMaid.getId(),
                "status", userMaid.getStatus()
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating hiring request: " + e.getMessage());
        }
    }
    

    
    // Get all requests for a specific maid
    @GetMapping("/maid/{maidId}")
    @PreAuthorize("hasRole('MAID')")
    public ResponseEntity<?> getRequestsByMaidId(@PathVariable Long maidId) {
        try {
            List<UserMaid> requests = userMaidService.getRequestsByMaidId(maidId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching requests: " + e.getMessage());
        }
    }
    
    // Get all requests for a specific user
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getRequestsByUserId(@PathVariable Long userId) {
        try {
            List<UserMaid> requests = userMaidService.getRequestsByUserId(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching requests: " + e.getMessage());
        }
    }
    
    // Update request status (Accept/Reject/Cancel)
    @PostMapping("/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId, @RequestBody Map<String, String> statusData) {
        try {
            String status = statusData.get("status");
            
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            
            UserMaid.RequestStatus requestStatus;
            try {
                requestStatus = UserMaid.RequestStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status. Must be PENDING, ACCEPTED, REJECTED, or CANCELLED");
            }
            
            UserMaid userMaid = userMaidService.updateRequestStatus(requestId, requestStatus);
            
            return ResponseEntity.ok(Map.of(
                "message", "Request status updated successfully",
                "requestId", userMaid.getId(),
                "status", userMaid.getStatus()
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating request status: " + e.getMessage());
        }
    }
    
    // Accept a request
    @PostMapping("/{requestId}/accept")
    @PreAuthorize("hasRole('MAID')")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        try {
            UserMaid userMaid = userMaidService.acceptRequest(requestId);
            return ResponseEntity.ok(Map.of(
                "message", "Request accepted successfully",
                "requestId", userMaid.getId(),
                "status", userMaid.getStatus()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error accepting request: " + e.getMessage());
        }
    }
    
    // Reject a request
    @PostMapping("/{requestId}/reject")
    @PreAuthorize("hasRole('MAID')")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId) {
        try {
            UserMaid userMaid = userMaidService.rejectRequest(requestId);
            return ResponseEntity.ok(Map.of(
                "message", "Request rejected successfully",
                "requestId", userMaid.getId(),
                "status", userMaid.getStatus()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting request: " + e.getMessage());
        }
    }
    
    // Cancel a request
    @PostMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelRequest(@PathVariable Long requestId) {
        try {
            UserMaid userMaid = userMaidService.cancelRequest(requestId);
            return ResponseEntity.ok(Map.of(
                "message", "Request cancelled successfully",
                "requestId", userMaid.getId(),
                "status", userMaid.getStatus()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling request: " + e.getMessage());
        }
    }
    
    // Get pending requests for a maid
    @GetMapping("/maid/{maidId}/pending")
    @PreAuthorize("hasRole('MAID')")
    public ResponseEntity<?> getPendingRequestsByMaidId(@PathVariable Long maidId) {
        try {
            List<UserMaid> requests = userMaidService.getPendingRequestsByMaidId(maidId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching pending requests: " + e.getMessage());
        }
    }
    
    // Get accepted requests for a user
    @GetMapping("/user/{userId}/accepted")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAcceptedRequestsByUserId(@PathVariable Long userId) {
        try {
            List<UserMaid> requests = userMaidService.getAcceptedRequestsByUserId(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching accepted requests: " + e.getMessage());
        }
    }
    
    // Check if user has active request with maid
    @GetMapping("/check-active")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> checkActiveRequest(@RequestParam Long userId, @RequestParam Long maidId) {
        try {
            boolean hasActiveRequest = userMaidService.hasActiveRequest(userId, maidId);
            return ResponseEntity.ok(Map.of("hasActiveRequest", hasActiveRequest));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error checking active request: " + e.getMessage());
        }
    }
} 