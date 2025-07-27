package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.repository.MaidRepository;
import com.pgvaale.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/maid")
public class MaidAuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> requestData, HttpServletRequest request) {
        try {
            // Extract required fields
            String username = (String) requestData.get("username");
            String email = (String) requestData.get("email");
            String password = (String) requestData.get("password");
            String name = (String) requestData.get("name");
            String phoneNumber = (String) requestData.get("phoneNumber");
            String aadhaar = (String) requestData.get("aadhaar");
            String services = (String) requestData.get("services");
            
            // Handle monthlySalary conversion from string to double
            Double monthlySalary = null;
            Object salaryObj = requestData.get("monthlySalary");
            if (salaryObj != null) {
                if (salaryObj instanceof Number) {
                    monthlySalary = ((Number) salaryObj).doubleValue();
                } else if (salaryObj instanceof String) {
                    String salaryStr = (String) salaryObj;
                    if (!salaryStr.trim().isEmpty()) {
                        try {
                            monthlySalary = Double.parseDouble(salaryStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid salary format");
                        }
                    }
                }
            }
            
            String gender = (String) requestData.get("gender");
            String timing = (String) requestData.get("timing");
            String region = (String) requestData.get("region");

            // Validate required fields
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone number is required");
            }
            if (aadhaar == null || aadhaar.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Aadhaar is required");
            }

            // Check if username exists
            Optional<Maid> existingMaid = maidRepository.findByUsername(username);
            if (existingMaid.isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email exists
            Optional<Maid> existingEmail = maidRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new maid
            Maid maid = Maid.builder()
                    .phoneNumber(phoneNumber)
                    .aadhaar(aadhaar)
                    .services(services)
                    .monthlySalary(monthlySalary != null ? monthlySalary : 0.0)
                    .gender(gender)
                    .timing(timing)
                    .region(region)
                    .build();
            
            // Set inherited fields manually
            maid.setUsername(username);
            maid.setPassword(passwordEncoder.encode(password));
            maid.setEmail(email);
            maid.setName(name);
            
            // Save maid
            Maid savedMaid = maidRepository.save(maid);
            
            return ResponseEntity.ok("Maid registration successful for " + savedMaid.getUsername());
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            // Check if maid exists
            Optional<Maid> maidOptional = maidRepository.findByUsername(username);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            Maid maid = maidOptional.get();
            
            // Check if maid is approved by admin
            if (!maid.isApproved()) {
                return ResponseEntity.status(401).body("Account is pending admin approval. Please wait for approval.");
            }
            
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername(), "ROLE_MAID");
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
} 