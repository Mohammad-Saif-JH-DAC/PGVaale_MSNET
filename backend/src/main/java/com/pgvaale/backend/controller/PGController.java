package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.PG;
import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.repository.PGRepository;
import com.pgvaale.backend.repository.OwnerRepository;
import com.pgvaale.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pg")
public class PGController {
    
    @Autowired
    private PGRepository pgRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Only Owners can register PGs
    @PostMapping("/register")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> registerPG(@RequestBody Map<String, Object> requestData, HttpServletRequest request) {
        try {
            // Extract required fields
            Long ownerId = Long.valueOf(requestData.get("ownerId").toString());
            String imageUrl = (String) requestData.get("imageUrl");
            
            // Handle latitude conversion from string to double
            Double latitude = null;
            Object latObj = requestData.get("latitude");
            if (latObj != null) {
                if (latObj instanceof Number) {
                    latitude = ((Number) latObj).doubleValue();
                } else if (latObj instanceof String) {
                    String latStr = (String) latObj;
                    if (!latStr.trim().isEmpty()) {
                        try {
                            latitude = Double.parseDouble(latStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid latitude format");
                        }
                    }
                }
            }
            
            // Handle longitude conversion from string to double
            Double longitude = null;
            Object longObj = requestData.get("longitude");
            if (longObj != null) {
                if (longObj instanceof Number) {
                    longitude = ((Number) longObj).doubleValue();
                } else if (longObj instanceof String) {
                    String longStr = (String) longObj;
                    if (!longStr.trim().isEmpty()) {
                        try {
                            longitude = Double.parseDouble(longStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid longitude format");
                        }
                    }
                }
            }
            
            String amenities = (String) requestData.get("amenities");
            String nearbyResources = (String) requestData.get("nearbyResources");
            
            // Handle rent conversion from string to double
            Double rent = null;
            Object rentObj = requestData.get("rent");
            if (rentObj != null) {
                if (rentObj instanceof Number) {
                    rent = ((Number) rentObj).doubleValue();
                } else if (rentObj instanceof String) {
                    String rentStr = (String) rentObj;
                    if (!rentStr.trim().isEmpty()) {
                        try {
                            rent = Double.parseDouble(rentStr);
                        } catch (NumberFormatException e) {
                            return ResponseEntity.badRequest().body("Invalid rent format");
                        }
                    }
                }
            }
            
            String generalPreference = (String) requestData.get("generalPreference");

            // Validate required fields
            if (ownerId == null) {
                return ResponseEntity.badRequest().body("Owner ID is required");
            }
            if (rent == null || rent <= 0) {
                return ResponseEntity.badRequest().body("Valid rent amount is required");
            }

            // Find owner
            Optional<Owner> ownerOptional = ownerRepository.findById(ownerId);
            if (!ownerOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Owner not found");
            }

            Owner owner = ownerOptional.get();

            // Create new PG
            PG pg = PG.builder()
                    .owner(owner)
                    .imageUrl(imageUrl)
                    .latitude(latitude != null ? latitude : 0.0)
                    .longitude(longitude != null ? longitude : 0.0)
                    .amenities(amenities)
                    .nearbyResources(nearbyResources)
                    .rent(rent)
                    .generalPreference(generalPreference)
                    .build();

            // Save PG
            PG savedPG = pgRepository.save(pg);

            return ResponseEntity.ok("PG registered successfully with ID: " + savedPG.getId());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("PG registration failed: " + e.getMessage());
        }
    }

    // Get all PGs (accessible by all authenticated users)
    @GetMapping("/all")
    public ResponseEntity<?> getAllPGs() {
        try {
            List<PG> pgs = pgRepository.findAll();
            return ResponseEntity.ok(pgs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch PGs: " + e.getMessage());
        }
    }

    // Get PG by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPGById(@PathVariable Long id) {
        try {
            Optional<PG> pgOptional = pgRepository.findById(id);
            if (pgOptional.isPresent()) {
                return ResponseEntity.ok(pgOptional.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch PG: " + e.getMessage());
        }
    }

    // Get PGs by owner
    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getPGsByOwner(@PathVariable Long ownerId) {
        try {
            Optional<Owner> ownerOptional = ownerRepository.findById(ownerId);
            if (!ownerOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Owner not found");
            }

            List<PG> pgs = pgRepository.findByOwner(ownerOptional.get());
            return ResponseEntity.ok(pgs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch PGs: " + e.getMessage());
        }
    }

    // Update PG (only by owner)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> updatePG(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        try {
            Optional<PG> pgOptional = pgRepository.findById(id);
            if (!pgOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            PG pg = pgOptional.get();

            // Update fields if provided
            if (requestData.containsKey("imageUrl")) {
                pg.setImageUrl((String) requestData.get("imageUrl"));
            }
            if (requestData.containsKey("latitude")) {
                Object latObj = requestData.get("latitude");
                if (latObj != null) {
                    if (latObj instanceof Number) {
                        pg.setLatitude(((Number) latObj).doubleValue());
                    } else if (latObj instanceof String) {
                        String latStr = (String) latObj;
                        if (!latStr.trim().isEmpty()) {
                            try {
                                pg.setLatitude(Double.parseDouble(latStr));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest().body("Invalid latitude format");
                            }
                        }
                    }
                }
            }
            if (requestData.containsKey("longitude")) {
                Object longObj = requestData.get("longitude");
                if (longObj != null) {
                    if (longObj instanceof Number) {
                        pg.setLongitude(((Number) longObj).doubleValue());
                    } else if (longObj instanceof String) {
                        String longStr = (String) longObj;
                        if (!longStr.trim().isEmpty()) {
                            try {
                                pg.setLongitude(Double.parseDouble(longStr));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest().body("Invalid longitude format");
                            }
                        }
                    }
                }
            }
            if (requestData.containsKey("amenities")) {
                pg.setAmenities((String) requestData.get("amenities"));
            }
            if (requestData.containsKey("nearbyResources")) {
                pg.setNearbyResources((String) requestData.get("nearbyResources"));
            }
            if (requestData.containsKey("rent")) {
                Object rentObj = requestData.get("rent");
                if (rentObj != null) {
                    if (rentObj instanceof Number) {
                        pg.setRent(((Number) rentObj).doubleValue());
                    } else if (rentObj instanceof String) {
                        String rentStr = (String) rentObj;
                        if (!rentStr.trim().isEmpty()) {
                            try {
                                pg.setRent(Double.parseDouble(rentStr));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest().body("Invalid rent format");
                            }
                        }
                    }
                }
            }
            if (requestData.containsKey("generalPreference")) {
                pg.setGeneralPreference((String) requestData.get("generalPreference"));
            }

            PG updatedPG = pgRepository.save(pg);
            return ResponseEntity.ok("PG updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update PG: " + e.getMessage());
        }
    }

    // Delete PG (only by owner or admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> deletePG(@PathVariable Long id) {
        try {
            Optional<PG> pgOptional = pgRepository.findById(id);
            if (!pgOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            pgRepository.deleteById(id);
            return ResponseEntity.ok("PG deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete PG: " + e.getMessage());
        }
    }
} 