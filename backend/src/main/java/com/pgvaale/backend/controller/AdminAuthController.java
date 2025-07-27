package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Admin;
import com.pgvaale.backend.repository.AdminRepository;
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
@RequestMapping("/api/admin")
public class AdminAuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private AdminRepository adminRepository;
    
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

            // Check if username exists
            Optional<Admin> existingAdmin = adminRepository.findByUsername(username);
            if (existingAdmin.isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email exists
            Optional<Admin> existingEmail = adminRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new admin
            Admin admin = Admin.builder().build();
            
            // Set inherited fields manually
            admin.setUsername(username);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setEmail(email);
            admin.setName(name);
            
            // Save admin
            Admin savedAdmin = adminRepository.save(admin);
            
            return ResponseEntity.ok("Admin registration successful for " + savedAdmin.getUsername());
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        System.out.println("=== ADMIN LOGIN ATTEMPT ===");
        System.out.println("Request data: " + loginData);
        
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            System.out.println("Login attempt for username: " + username);
            
            if (username == null || username.trim().isEmpty()) {
                System.out.println("Username is missing");
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("Password is missing");
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            // Check if admin exists
            Optional<Admin> adminOptional = adminRepository.findByUsername(username);
            if (!adminOptional.isPresent()) {
                System.out.println("Admin not found in database: " + username);
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            Admin admin = adminOptional.get();
            System.out.println("Admin found in database:");
            System.out.println("- ID: " + admin.getId());
            System.out.println("- Username: " + admin.getUsername());
            System.out.println("- Email: " + admin.getEmail());
            System.out.println("- Name: " + admin.getName());
            System.out.println("- Stored password (encoded): " + admin.getPassword());
            
            // Test password matching
            boolean passwordMatches = passwordEncoder.matches(password, admin.getPassword());
            System.out.println("Password matches: " + passwordMatches);
            
            System.out.println("Attempting authentication with AuthenticationManager...");
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            System.out.println("Authentication successful!");
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            System.out.println("UserDetails: " + userDetails.getUsername() + " with authorities: " + userDetails.getAuthorities());
            
            String token = jwtUtil.generateToken(userDetails.getUsername(), "ROLE_ADMIN");
            System.out.println("JWT token generated successfully");
            System.out.println("=== ADMIN LOGIN SUCCESS ===");
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            System.out.println("BadCredentialsException: " + e.getMessage());
            System.out.println("=== ADMIN LOGIN FAILED - BAD CREDENTIALS ===");
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            System.out.println("Exception during login: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== ADMIN LOGIN FAILED - EXCEPTION ===");
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
} 