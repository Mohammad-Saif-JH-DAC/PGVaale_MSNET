package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.repository.TiffinRepository;
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
@RequestMapping("/api/tiffin")
public class TiffinAuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private TiffinRepository tiffinRepository;
    
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
            
            // Handle price conversion from string to double
            Double price = null;
            Object priceObj = requestData.get("price");
            if (priceObj != null) {
                if (priceObj instanceof Number) {
                    price = ((Number) priceObj).doubleValue();
                } else if (priceObj instanceof String) {
                    String priceStr = (String) priceObj;
                    if (!priceStr.trim().isEmpty()) {
                        try {
                            price = Double.parseDouble(priceStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid price format");
                        }
                    }
                }
            }
            
            String foodCategory = (String) requestData.get("foodCategory");
            String region = (String) requestData.get("region");
            String maidAddress = (String) requestData.get("maidAddress");

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
            Optional<Tiffin> existingTiffin = tiffinRepository.findByUsername(username);
            if (existingTiffin.isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email exists
            Optional<Tiffin> existingEmail = tiffinRepository.findByEmail(email);
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new tiffin
            Tiffin tiffin = Tiffin.builder()
                    .phoneNumber(phoneNumber)
                    .aadhaar(aadhaar)
                    .price(price != null ? price : 0.0)
                    .foodCategory(foodCategory)
                    .region(region)
                    .maidAddress(maidAddress)
                    .build();
            
            // Set inherited fields manually
            tiffin.setUsername(username);
            tiffin.setPassword(passwordEncoder.encode(password));
            tiffin.setEmail(email);
            tiffin.setName(name);
            
            // Save tiffin
            Tiffin savedTiffin = tiffinRepository.save(tiffin);
            
            return ResponseEntity.ok("Tiffin registration successful for " + savedTiffin.getUsername());
            
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
            
            // Check if tiffin exists
            Optional<Tiffin> tiffinOptional = tiffinRepository.findByUsername(username);
            if (!tiffinOptional.isPresent()) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            Tiffin tiffin = tiffinOptional.get();
            
            // Check if tiffin is approved by admin
            if (!tiffin.isApproved()) {
                return ResponseEntity.status(401).body("Account is pending admin approval. Please wait for approval.");
            }
            
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername(), "ROLE_TIFFIN", tiffin.getId());
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
} 