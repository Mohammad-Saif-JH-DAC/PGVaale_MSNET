package com.pgvaale.backend.controller;

import com.pgvaale.backend.dto.MenuDTO;
import com.pgvaale.backend.dto.TiffinDashboardDTO;
import com.pgvaale.backend.dto.UserTiffinDTO;
import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.entity.UserTiffin;
import com.pgvaale.backend.repository.TiffinRepository;
import com.pgvaale.backend.service.TiffinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tiffin")
public class TiffinController {
    
    @Autowired
    private TiffinService tiffinService;
    
    @Autowired
    private TiffinRepository tiffinRepository;
    
    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            // Get tiffin ID from username (you might need to adjust this based on your auth setup)
            Long tiffinId = getTiffinIdFromUsername(username);
            TiffinDashboardDTO dashboard = tiffinService.getTiffinDashboard(tiffinId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard: " + e.getMessage());
        }
    }
    
    // Menu Management
    @PostMapping("/menu")
    public ResponseEntity<?> createMenu(@RequestBody MenuDTO menuDTO) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long tiffinId = getTiffinIdFromUsername(username);
            menuDTO.setTiffinId(tiffinId);
            
            MenuDTO createdMenu = tiffinService.createMenu(menuDTO);
            return ResponseEntity.ok(createdMenu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating menu: " + e.getMessage());
        }
    }
    
    @PutMapping("/menu/{menuId}")
    public ResponseEntity<?> updateMenu(@PathVariable Long menuId, @RequestBody MenuDTO menuDTO) {
        try {
            MenuDTO updatedMenu = tiffinService.updateMenu(menuId, menuDTO);
            return ResponseEntity.ok(updatedMenu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating menu: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/menu/{menuId}")
    public ResponseEntity<?> deleteMenu(@PathVariable Long menuId) {
        try {
            tiffinService.deleteMenu(menuId);
            return ResponseEntity.ok("Menu deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting menu: " + e.getMessage());
        }
    }
    
    @GetMapping("/menu")
    public ResponseEntity<?> getWeeklyMenu() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long tiffinId = getTiffinIdFromUsername(username);
            
            List<MenuDTO> menus = tiffinService.getWeeklyMenu(tiffinId);
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching menu: " + e.getMessage());
        }
    }
    
    @GetMapping("/menu/{dayOfWeek}")
    public ResponseEntity<?> getMenuByDay(@PathVariable String dayOfWeek) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long tiffinId = getTiffinIdFromUsername(username);
            
            MenuDTO menu = tiffinService.getMenuByDay(tiffinId, dayOfWeek);
            if (menu != null) {
                return ResponseEntity.ok(menu);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching menu: " + e.getMessage());
        }
    }
    
    // Request Management
    @GetMapping("/requests")
    public ResponseEntity<?> getRequests(@RequestParam(required = false) String status) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Long tiffinId = getTiffinIdFromUsername(username);
            
            UserTiffin.RequestStatus requestStatus = null;
            if (status != null && !status.isEmpty()) {
                requestStatus = UserTiffin.RequestStatus.valueOf(status.toUpperCase());
            }
            
            List<UserTiffinDTO> requests = tiffinService.getTiffinRequests(tiffinId, requestStatus);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests: " + e.getMessage());
        }
    }
    
    @PostMapping("/requests/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            UserTiffin.RequestStatus requestStatus = UserTiffin.RequestStatus.valueOf(status.toUpperCase());
            
            UserTiffinDTO updatedRequest = tiffinService.updateRequestStatus(requestId, requestStatus);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating request status: " + e.getMessage());
        }
    }
    
    // Profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            // You'll need to implement this based on your auth setup
            return ResponseEntity.ok(Map.of("username", username, "message", "Profile endpoint"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }
    
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData) {
        try {
            // Implement profile update logic
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
    
    // Helper method to get tiffin ID from username
    private Long getTiffinIdFromUsername(String username) {
        try {
            Optional<Tiffin> tiffin = tiffinRepository.findByUsername(username);
            if (tiffin.isPresent()) {
                return tiffin.get().getId();
            }
            throw new RuntimeException("Tiffin not found for username: " + username);
        } catch (Exception e) {
            throw new RuntimeException("Error getting tiffin ID: " + e.getMessage());
        }
    }
} 