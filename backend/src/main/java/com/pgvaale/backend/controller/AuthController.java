package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.repository.UserRepository;
import com.pgvaale.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;

    // Define allowed roles
    private static final List<String> ALLOWED_ROLES = Arrays.asList("user", "owner", "tiffin", "maid", "admin");

    @PostMapping("/register/{role}")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> requestData, @PathVariable String role, HttpServletRequest request) {
        System.out.println("=== REGISTRATION REQUEST DEBUG INFO ===");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Content Type: " + request.getContentType());
        System.out.println("Role parameter: " + role);
        System.out.println("Request data: " + requestData);
        
        try {
            // Validate role
            String normalizedRole = role.toLowerCase();
            if (!ALLOWED_ROLES.contains(normalizedRole)) {
                System.out.println("Invalid role: " + role);
                return ResponseEntity.badRequest().body("Invalid role. Allowed roles: " + ALLOWED_ROLES);
            }

            // Extract required fields
            String username = (String) requestData.get("username");
            String email = (String) requestData.get("email");
            String password = (String) requestData.get("password");

            // Validate required fields
            if (username == null || username.trim().isEmpty()) {
                System.out.println("Username is missing or empty");
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (email == null || email.trim().isEmpty()) {
                System.out.println("Email is missing or empty");
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("Password is missing or empty");
                return ResponseEntity.badRequest().body("Password is required");
            }

            // Check if username exists
            Optional<User> existingUser = userRepository.findByUsername(username);
            if (existingUser.isPresent()) {
                System.out.println("Username already exists: " + username);
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email exists
            Optional<User> existingEmail = userRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                System.out.println("Email already exists: " + email);
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            System.out.println("Creating new user: " + username);
            
            // Create base user
            User user = new User(username, passwordEncoder.encode(password), email, normalizedRole.toUpperCase());
            
            // Set enabled status based on role
            if (normalizedRole.equals("tiffin") || normalizedRole.equals("maid")) {
                user.setEnabled(false); // Needs admin approval
                System.out.println("User requires admin approval: " + username);
            } else {
                user.setEnabled(true);
                System.out.println("User enabled immediately: " + username);
            }
            
            // Set additional fields if they exist
            if (requestData.containsKey("address")) {
                user.setAddress((String) requestData.get("address"));
                System.out.println("Set address for user: " + user.getAddress());
            }
            if (requestData.containsKey("contactNumber")) {
                user.setContactNumber((String) requestData.get("contactNumber"));
                System.out.println("Set contact number for user: " + user.getContactNumber());
            }
            if (requestData.containsKey("serviceArea")) {
                user.setServiceArea((String) requestData.get("serviceArea"));
                System.out.println("Set service area for user: " + user.getServiceArea());
            }
            if (requestData.containsKey("experience")) {
                Object exp = requestData.get("experience");
                if (exp instanceof Integer) {
                    user.setExperience((Integer) exp);
                    System.out.println("Set experience (Integer): " + user.getExperience());
                } else if (exp instanceof String) {
                    try {
                        user.setExperience(Integer.parseInt((String) exp));
                        System.out.println("Set experience (String parsed): " + user.getExperience());
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid experience format: " + exp);
                    }
                }
            }
            if (requestData.containsKey("availability")) {
                user.setAvailability((String) requestData.get("availability"));
                System.out.println("Set availability for user: " + user.getAvailability());
            }
            if (requestData.containsKey("roomDetails")) {
                user.setRoomDetails((String) requestData.get("roomDetails"));
                System.out.println("Set room details for user: " + user.getRoomDetails());
            }
            
            // Save user
            User savedUser = userRepository.save(user);
            System.out.println("User registered successfully with ID: " + savedUser.getId());
            System.out.println("=== END REGISTRATION REQUEST ===");
            
            return ResponseEntity.ok("Registration successful for " + savedUser.getUsername());
            
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        System.out.println("=== LOGIN REQUEST DEBUG INFO ===");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Content Type: " + request.getContentType());
        System.out.println("Headers:");
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            System.out.println("  " + headerName + ": " + request.getHeader(headerName));
        });
        System.out.println("Login data received: " + loginData);
        
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            if (username == null || username.trim().isEmpty()) {
                System.out.println("Username is missing or empty");
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("Password is missing or empty");
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            System.out.println("Attempting authentication for user: " + username);
            
            // Check if user exists in database
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                System.out.println("User not found in database: " + username);
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            User user = userOptional.get();
            System.out.println("User found - Enabled: " + user.isEnabled() + ", Role: " + user.getRole());
            
            if (!user.isEnabled()) {
                System.out.println("User account is disabled: " + username);
                return ResponseEntity.status(401).body("Account is not enabled. Please contact administrator.");
            }
            
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            System.out.println("Authentication successful for user: " + username);
            
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            System.out.println("User details: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
            
            String token = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities().iterator().next().getAuthority());
            
            System.out.println("JWT token generated successfully");
            System.out.println("=== END LOGIN REQUEST ===");
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            System.err.println("Invalid credentials for user: " + loginData.get("username"));
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
}