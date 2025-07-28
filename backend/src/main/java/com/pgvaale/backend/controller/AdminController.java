package com.pgvaale.backend.controller;

import com.pgvaale.backend.dto.DashboardStatsDTO;
import com.pgvaale.backend.entity.Admin;
import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.repository.AdminRepository;
import com.pgvaale.backend.repository.MaidRepository;
import com.pgvaale.backend.repository.TiffinRepository;
import com.pgvaale.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private MaidRepository maidRepository;

    @Autowired
    private TiffinRepository tiffinRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/test")
    public ResponseEntity<?> testAdmin() {
        try {
            List<Admin> allAdmins = adminRepository.findAll();
            Optional<Admin> adminOptional = adminRepository.findByUsername("admin");
            
            return ResponseEntity.ok(Map.of(
                "totalAdmins", allAdmins.size(),
                "adminExists", adminOptional.isPresent(),
                "adminDetails", adminOptional.map(admin -> Map.of(
                    "id", admin.getId(),
                    "username", admin.getUsername(),
                    "email", admin.getEmail(),
                    "name", admin.getName()
                )).orElse(null)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test-password")
    public ResponseEntity<?> testPassword() {
        try {
            Optional<Admin> adminOptional = adminRepository.findByUsername("admin");
            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                boolean passwordMatches = passwordEncoder.matches("admin123", admin.getPassword());
                
                return ResponseEntity.ok(Map.of(
                    "adminExists", true,
                    "passwordMatches", passwordMatches,
                    "storedPasswordHash", admin.getPassword(),
                    "testPassword", "admin123"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "adminExists", false,
                    "message", "Admin not found"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/maids")
    public ResponseEntity<?> getAllMaids() {
        try {
            List<Maid> maids = maidRepository.findAll();
            return ResponseEntity.ok(maids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching maids: " + e.getMessage());
        }
    }

    @GetMapping("/tiffins")
    public ResponseEntity<?> getAllTiffins() {
        try {
            List<Tiffin> tiffins = tiffinRepository.findAll();
            return ResponseEntity.ok(tiffins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching tiffins: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmins() {
        try {
            List<Admin> admins = adminRepository.findAll();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching admins: " + e.getMessage());
        }
    }

    // Get pending maids (not approved yet)
    @GetMapping("/maids/pending")
    public ResponseEntity<?> getPendingMaids() {
        try {
            List<Maid> pendingMaids = maidRepository.findByApprovedFalse();
            return ResponseEntity.ok(pendingMaids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching pending maids: " + e.getMessage());
        }
    }

    // Get pending tiffins (not approved yet)
    @GetMapping("/tiffins/pending")
    public ResponseEntity<?> getPendingTiffins() {
        try {
            List<Tiffin> pendingTiffins = tiffinRepository.findByApprovedFalse();
            return ResponseEntity.ok(pendingTiffins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching pending tiffins: " + e.getMessage());
        }
    }

    // Approve maid
    @PostMapping("/maids/{id}/approve")
    public ResponseEntity<?> approveMaid(@PathVariable Long id) {
        try {
            Optional<Maid> maidOptional = maidRepository.findById(id);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Maid maid = maidOptional.get();
            maid.setApproved(true);
            Maid savedMaid = maidRepository.save(maid);
            
            return ResponseEntity.ok("Maid " + savedMaid.getName() + " approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving maid: " + e.getMessage());
        }
    }

    // Approve tiffin
    @PostMapping("/tiffins/{id}/approve")
    public ResponseEntity<?> approveTiffin(@PathVariable Long id) {
        try {
            Optional<Tiffin> tiffinOptional = tiffinRepository.findById(id);
            if (!tiffinOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Tiffin tiffin = tiffinOptional.get();
            tiffin.setApproved(true);
            Tiffin savedTiffin = tiffinRepository.save(tiffin);
            
            return ResponseEntity.ok("Tiffin " + savedTiffin.getName() + " approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving tiffin: " + e.getMessage());
        }
    }

    // Reject maid
    @PostMapping("/maids/{id}/reject")
    public ResponseEntity<?> rejectMaid(@PathVariable Long id) {
        try {
            Optional<Maid> maidOptional = maidRepository.findById(id);
            if (!maidOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            maidRepository.deleteById(id);
            return ResponseEntity.ok("Maid rejected and removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting maid: " + e.getMessage());
        }
    }

    // Reject tiffin
    @PostMapping("/tiffins/{id}/reject")
    public ResponseEntity<?> rejectTiffin(@PathVariable Long id) {
        try {
            Optional<Tiffin> tiffinOptional = tiffinRepository.findById(id);
            if (!tiffinOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            tiffinRepository.deleteById(id);
            return ResponseEntity.ok("Tiffin rejected and removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting tiffin: " + e.getMessage());
        }
    }

    // Get dashboard statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching dashboard statistics: " + e.getMessage());
        }
    }
} 