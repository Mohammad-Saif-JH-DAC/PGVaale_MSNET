package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.repository.OwnerRepository;
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
@RequestMapping("/api/owner")
public class OwnerAuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OwnerRepository ownerRepository;

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
            if (aadhaar == null || aadhaar.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Aadhaar is required");
            }
            if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mobile number is required");
            }
            if (region == null || region.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Region is required");
            }

            // Check if username exists
            Optional<Owner> existingOwner = ownerRepository.findByUsername(username);
            if (existingOwner.isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            // Check if email exists
            Optional<Owner> existingEmail = ownerRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create new owner
            Owner owner = Owner.builder()
                    .age(age != null ? age : 0)
                    .aadhaar(aadhaar)
                    .mobileNumber(mobileNumber)
                    .region(region)
                    .build();

            // Set inherited fields manually
            owner.setUsername(username);
            owner.setPassword(passwordEncoder.encode(password));
            owner.setEmail(email);
            owner.setName(name);
            owner.setMobileNumber(mobileNumber);

            // Save owner
            Owner savedOwner = ownerRepository.save(owner);

            return ResponseEntity.ok("Owner registration successful for " + savedOwner.getUsername());

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

            // Check if owner exists
            Optional<Owner> ownerOptional = ownerRepository.findByUsername(username);
            if (!ownerOptional.isPresent()) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            Owner owner = ownerOptional.get();

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername(), "ROLE_OWNER");

            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
}