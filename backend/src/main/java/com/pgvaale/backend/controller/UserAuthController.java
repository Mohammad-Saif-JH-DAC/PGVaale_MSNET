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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserAuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
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
            String aadhaar = (String) requestData.get("aadhaar");
            String mobileNumber = (String) requestData.get("mobileNumber");
            
            // Handle age conversion from string to integer
            Integer age = null;
            Object ageObj = requestData.get("age");
            if (ageObj != null) {
                if (ageObj instanceof Number) {
                    age = ((Number) ageObj).intValue();
                } else if (ageObj instanceof String) {
                    String ageStr = (String) ageObj;
                    if (!ageStr.trim().isEmpty()) {
                        try {
                            age = Integer.parseInt(ageStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid age format");
                        }
                    }
                }
            }
            
            String gender = (String) requestData.get("gender");

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
            if (aadhaar == null || aadhaar.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Aadhaar is required");
            }
            if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mobile number is required");
            }
            if (gender == null || gender.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Gender is required");
            }

            // Check if username exists
            Optional<User> existingUser = userRepository.findByUsername(username);
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email exists
            Optional<User> existingEmail = userRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new user
            User user = User.builder()
                    .aadhaar(aadhaar)
                    .mobileNumber(mobileNumber)
                    .age(age != null ? age : 0)
                    .gender(gender)
                    .uniqueId("USER_" + System.currentTimeMillis())
                    .build();
            
            // Set inherited fields manually
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setName(name);
            
            // Save user
            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok("User registration successful for " + savedUser.getUsername());
            
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
            
            // Check if user exists and is a USER
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            User user = userOptional.get();
            
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername(), "ROLE_USER");
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
} 