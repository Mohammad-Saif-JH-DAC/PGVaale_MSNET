package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.PG;
import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.repository.PGRepository;
import com.pgvaale.backend.service.PGService;
import com.pgvaale.backend.repository.OwnerRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pg")
public class PGController {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PGService pgService;

    // Register PG
    @PostMapping("/register")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> registerPG(@RequestBody Map<String, Object> requestData) {
        try {
            Long ownerId = Long.valueOf(requestData.get("ownerId").toString());
            List<String> imagePaths = (List<String>) requestData.get("imagePaths");

            if (imagePaths == null || imagePaths.isEmpty()) {
                return ResponseEntity.badRequest().body("At least one image path is required");
            }

            if (imagePaths.size() > 5) {
                return ResponseEntity.badRequest().body("Maximum 5 images allowed");
            }

            // Latitude
            Double latitude = parseDouble(requestData.get("latitude"));
            Double longitude = parseDouble(requestData.get("longitude"));
            Double rent = parseDouble(requestData.get("rent"));

            String amenities = (String) requestData.get("amenities");
            String nearbyResources = (String) requestData.get("nearbyResources");
            String generalPreference = (String) requestData.get("generalPreference");
            String region = (String) requestData.get("region");
            String availability = (String) requestData.get("availability");

            if (region == null || region.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Region is required");
            }

            Optional<Owner> ownerOptional = ownerRepository.findById(ownerId);
            if (!ownerOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Owner not found");
            }

            PG pg = PG.builder()
                    .owner(ownerOptional.get())
                    .imagePaths(imagePaths)
                    .latitude(latitude != null ? latitude : 0.0)
                    .longitude(longitude != null ? longitude : 0.0)
                    .amenities(amenities)
                    .nearbyResources(nearbyResources)
                    .rent(rent != null ? rent : 0.0)
                    .generalPreference(generalPreference)
                    .region(region)
                    .availability(availability)
                    .build();

            PG saved = pgRepository.save(pg);
            return ResponseEntity.ok("PG registered successfully with ID: " + saved.getId());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PG>> getAllPGs(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String generalPreference,
            @RequestParam(required = false) Boolean availability) {

        List<PG> pgs = pgService.getAllPGs();
        // Apply filters
        if (region != null) {
            pgs = pgs.stream().filter(pg -> pg.getRegion().equalsIgnoreCase(region)).collect(Collectors.toList());
        }
        if (generalPreference != null) {
            pgs = pgs.stream().filter(pg -> pg.getGeneralPreference().equalsIgnoreCase(generalPreference))
                    .collect(Collectors.toList());
        }
        if (availability != null) {
            pgs = pgs.stream().filter(pg -> {
                String avail = pg.getAvailability();
                if (avail == null)
                    return false;
                return availability ? avail.equalsIgnoreCase("available") : !avail.equalsIgnoreCase("available");
            }).collect(Collectors.toList());
        }

        return ResponseEntity.ok(pgs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPGById(@PathVariable Long id) {
        Optional<PG> pg = pgRepository.findById(id);
        return pg.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getPGsByOwner(@PathVariable Long ownerId) {
        Optional<Owner> owner = ownerRepository.findById(ownerId);
        if (!owner.isPresent())
            return ResponseEntity.badRequest().body("Owner not found");

        return ResponseEntity.ok(pgRepository.findByOwner(owner.get()));
    }

    // @GetMapping("/region/{region}")
    // public ResponseEntity<?> getPGsByRegion(@PathVariable String region) {
    // try {
    // return ResponseEntity.ok(pgRepository.findByRegion(region));
    // } catch (Exception e) {
    // return ResponseEntity.status(500).body("Error fetching PGs by region: " +
    // e.getMessage());
    // }
    // }

    // @GetMapping("/gender/{gender}")
    // public ResponseEntity<?> getPGsByGeneralPreference(@PathVariable String
    // gender) {
    // try {
    // return ResponseEntity.ok(pgRepository.findByGeneralPreference(gender));
    // } catch (Exception e) {
    // return ResponseEntity.status(500).body("Error fetching PGs by Gender
    // Preference: " + e.getMessage());
    // }
    // }

    // @GetMapping("/available/{availability}")
    // public ResponseEntity<?> getPGsByAvailibilty(@PathVariable String available)
    // {
    // try {
    // return ResponseEntity.ok(pgRepository.findByAvailability(available));
    // } catch (Exception e) {
    // return ResponseEntity.status(500).body("Error fetching PGs by Availibility: "
    // + e.getMessage());
    // }
    // }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> updatePG(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        try {
            Optional<PG> optionalPG = pgRepository.findById(id);
            if (!optionalPG.isPresent())
                return ResponseEntity.notFound().build();

            PG pg = optionalPG.get();

            if (requestData.containsKey("imagePaths")) {
                List<String> paths = (List<String>) requestData.get("imagePaths");
                if (paths.size() > 5)
                    return ResponseEntity.badRequest().body("Maximum 5 images allowed");
                pg.setImagePaths(paths);
            }

            if (requestData.containsKey("latitude"))
                pg.setLatitude(parseDouble(requestData.get("latitude")));
            if (requestData.containsKey("longitude"))
                pg.setLongitude(parseDouble(requestData.get("longitude")));
            if (requestData.containsKey("amenities"))
                pg.setAmenities((String) requestData.get("amenities"));
            if (requestData.containsKey("nearbyResources"))
                pg.setNearbyResources((String) requestData.get("nearbyResources"));
            if (requestData.containsKey("rent"))
                pg.setRent(parseDouble(requestData.get("rent")));
            if (requestData.containsKey("generalPreference"))
                pg.setGeneralPreference((String) requestData.get("generalPreference"));
            if (requestData.containsKey("region"))
                pg.setRegion((String) requestData.get("region"));

            if (requestData.containsKey("availability"))
                pg.setAvailability((String) requestData.get("availability"));

            pgRepository.save(pg);
            return ResponseEntity.ok("PG updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating PG: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> deletePG(@PathVariable Long id) {
        Optional<PG> pgOptional = pgRepository.findById(id);
        if (!pgOptional.isPresent())
            return ResponseEntity.notFound().build();

        pgRepository.deleteById(id);
        return ResponseEntity.ok("PG deleted successfully");
    }

    // Helper to parse double
    private Double parseDouble(Object obj) {
        if (obj == null)
            return null;
        if (obj instanceof Number)
            return ((Number) obj).doubleValue();
        if (obj instanceof String && !((String) obj).isEmpty()) {
            try {
                return Double.parseDouble((String) obj);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }
}
