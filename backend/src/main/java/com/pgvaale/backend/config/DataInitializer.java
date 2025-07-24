package com.pgvaale.backend.config;

import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@pgvaale.com");
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }
    }
} 