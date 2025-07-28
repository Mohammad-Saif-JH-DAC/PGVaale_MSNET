// src/main/java/com/pgvaale/backend/controller/OwnerController.java
package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Ensure CORS is handled
@RestController
@RequestMapping("/api/owners") // Base path for owner-related endpoints (different from OwnerAuthController)
public class OwnerController {

    @Autowired
    private OwnerRepository ownerRepository;

    /**
     * Endpoint for an authenticated owner to get their own details (including ID).
     * This resolves the issue where the ownerId is not in the JWT token.
     * Path: GET /api/owners/me
     * Requires: ROLE_OWNER
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('OWNER')") // Ensure only owners can access this
    public ResponseEntity<?> getCurrentOwner(Authentication authentication) {
        try {
            // Get the username from the security context (comes from the JWT 'sub' claim)
            String username = authentication.getName(); // This will be "Mohammad_Saif_001"

            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("Username not found in authentication context.");
            }

            // Find the owner in the database using the username
            // findByUsername is already defined in OwnerRepository
            Optional<Owner> ownerOptional = ownerRepository.findByUsername(username);

            if (ownerOptional.isPresent()) {
                Owner owner = ownerOptional.get();
                // Return the owner object. The frontend expects the 'id' field.
                return ResponseEntity.ok(owner);
            } else {
                // User is authenticated but no Owner record found - this is an inconsistency
                return ResponseEntity.badRequest().body("Owner record not found for authenticated user: " + username
                        + ". Please contact administrator.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch owner details: " + e.getMessage());
        }
    }
}