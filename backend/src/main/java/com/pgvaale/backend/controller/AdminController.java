package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/pending-service-providers")
    public List<User> getPendingServiceProviders() {
        return userRepository.findAll().stream()
                .filter(u -> (u.getRole().equalsIgnoreCase("TIFFIN") || u.getRole().equalsIgnoreCase("MAID")) && !u.isEnabled())
                .toList();
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveServiceProvider(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(true);
                    userRepository.save(user);
                    return ResponseEntity.ok("Approved");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectServiceProvider(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("Rejected and deleted");
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 