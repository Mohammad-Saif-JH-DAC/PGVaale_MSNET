package com.pgvaale.backend.config;

import com.pgvaale.backend.entity.Admin;
import com.pgvaale.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Starting Data Initialization ===");
        // Create default admin if not exists
        createDefaultAdmin();
        System.out.println("=== Data Initialization Complete ===");
    }

    private void createDefaultAdmin() {
        System.out.println("Checking for default admin...");
        
        // Check if default admin already exists
        Optional<Admin> existingAdmin = adminRepository.findByUsername("admin");
        if (existingAdmin.isEmpty()) {
            System.out.println("Default admin not found. Creating...");
            
            Admin defaultAdmin = Admin.builder().build();
            
            // Set inherited fields manually
            defaultAdmin.setName("System Admin");
            defaultAdmin.setEmail("admin@pgvaale.com");
            defaultAdmin.setUsername("admin");
            String encodedPassword = passwordEncoder.encode("admin123");
            defaultAdmin.setPassword(encodedPassword);
            
            System.out.println("Admin details:");
            System.out.println("- Username: " + defaultAdmin.getUsername());
            System.out.println("- Email: " + defaultAdmin.getEmail());
            System.out.println("- Name: " + defaultAdmin.getName());
            System.out.println("- Password (encoded): " + encodedPassword);
            System.out.println("- Default Password: admin123");
            
            Admin savedAdmin = adminRepository.save(defaultAdmin);
            System.out.println("Default admin created successfully with ID: " + savedAdmin.getId());
            
            // Verify the admin was saved
            Optional<Admin> verifyAdmin = adminRepository.findByUsername("admin");
            if (verifyAdmin.isPresent()) {
                System.out.println("Admin verification successful - found in database");
            } else {
                System.out.println("ERROR: Admin not found in database after save!");
            }
        } else {
            System.out.println("Default admin already exists!");
            
            Admin admin = existingAdmin.get();
            System.out.println("Existing admin details:");
            System.out.println("- ID: " + admin.getId());
            System.out.println("- Username: " + admin.getUsername());
            System.out.println("- Email: " + admin.getEmail());
            System.out.println("- Name: " + admin.getName());
            
            // Check if password needs to be updated
            String expectedPassword = "admin123";
            if (!passwordEncoder.matches(expectedPassword, admin.getPassword())) {
                System.out.println("Updating admin password to: " + expectedPassword);
                admin.setPassword(passwordEncoder.encode(expectedPassword));
                adminRepository.save(admin);
                System.out.println("Admin password updated successfully");
            } else {
                System.out.println("Admin password is already correct");
            }
            
            System.out.println("- Default Password: admin123");
        }
    }
} 