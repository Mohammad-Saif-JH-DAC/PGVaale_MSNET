package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.UserMaid;
import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.repository.UserMaidRepository;
import com.pgvaale.backend.repository.UserRepository;
import com.pgvaale.backend.repository.MaidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserMaidService {
    
    @Autowired
    private UserMaidRepository userMaidRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaidRepository maidRepository;
    
    // Create a new maid hiring request
    public UserMaid createHiringRequest(Long userId, Long maidId, String userAddress, 
                                       LocalDate startDate, LocalDate endDate, String timeSlot) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Maid> maidOptional = maidRepository.findById(maidId);
        
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        if (!maidOptional.isPresent()) {
            throw new RuntimeException("Maid not found");
        }
        
        // Check if user has any active request (only 1 maid can be hired at a time)
        if (userMaidRepository.existsActiveRequestByUserId(userId)) {
            throw new RuntimeException("You can only hire one maid at a time. Please cancel your existing request first.");
        }
        
        UserMaid userMaid = UserMaid.builder()
                .user(userOptional.get())
                .maid(maidOptional.get())
                .status(UserMaid.RequestStatus.PENDING)
                .assignedDateTime(LocalDateTime.now())
                .userAddress(userAddress)
                .startDate(startDate)
                .endDate(endDate)
                .timeSlot(timeSlot)
                .build();
        
        return userMaidRepository.save(userMaid);
    }
    

    
    // Get all requests for a specific maid
    public List<UserMaid> getRequestsByMaidId(Long maidId) {
        return userMaidRepository.findActiveRequestsByMaidId(maidId);
    }
    
    // Get all requests for a specific user
    public List<UserMaid> getRequestsByUserId(Long userId) {
        return userMaidRepository.findActiveRequestsByUserId(userId);
    }
    
    // Update request status
    public UserMaid updateRequestStatus(Long requestId, UserMaid.RequestStatus status) {
        Optional<UserMaid> requestOptional = userMaidRepository.findById(requestId);
        
        if (!requestOptional.isPresent()) {
            throw new RuntimeException("Request not found");
        }
        
        UserMaid userMaid = requestOptional.get();
        userMaid.setStatus(status);
        
        if (status == UserMaid.RequestStatus.CANCELLED) {
            userMaid.setDeletionDateTime(LocalDateTime.now());
        }
        
        return userMaidRepository.save(userMaid);
    }
    
    // Get request by ID
    public Optional<UserMaid> getRequestById(Long requestId) {
        return userMaidRepository.findById(requestId);
    }
    
    // Cancel a request
    public UserMaid cancelRequest(Long requestId) {
        return updateRequestStatus(requestId, UserMaid.RequestStatus.CANCELLED);
    }
    
    // Accept a request
    public UserMaid acceptRequest(Long requestId) {
        Optional<UserMaid> requestOptional = userMaidRepository.findById(requestId);
        
        if (!requestOptional.isPresent()) {
            throw new RuntimeException("Request not found");
        }
        
        UserMaid userMaid = requestOptional.get();
        userMaid.setStatus(UserMaid.RequestStatus.ACCEPTED);
        userMaid.setAcceptedDateTime(LocalDateTime.now());
        
        return userMaidRepository.save(userMaid);
    }
    
    // Reject a request
    public UserMaid rejectRequest(Long requestId) {
        return updateRequestStatus(requestId, UserMaid.RequestStatus.REJECTED);
    }
    
    // Get pending requests for a maid
    public List<UserMaid> getPendingRequestsByMaidId(Long maidId) {
        return userMaidRepository.findByMaidIdAndStatus(maidId, UserMaid.RequestStatus.PENDING);
    }
    
    // Get accepted requests for a user
    public List<UserMaid> getAcceptedRequestsByUserId(Long userId) {
        return userMaidRepository.findAcceptedRequestsByUserId(userId);
    }
    
    // Count pending requests for a maid
    public Long countPendingRequestsByMaidId(Long maidId) {
        return userMaidRepository.countByMaidIdAndStatus(maidId, UserMaid.RequestStatus.PENDING);
    }
    
    // Check if user has active request with maid
    public boolean hasActiveRequest(Long userId, Long maidId) {
        return userMaidRepository.existsActiveRequestByUserIdAndMaidId(userId, maidId);
    }
} 