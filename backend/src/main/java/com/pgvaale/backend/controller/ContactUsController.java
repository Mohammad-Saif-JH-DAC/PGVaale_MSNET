package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.ContactUs;
import com.pgvaale.backend.repository.ContactUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // Adjust for deployment if needed


public class ContactUsController {

    @Autowired
    private ContactUsRepository contactUsRepository;
    
    @PostMapping("/contactUs")

    //@PostMapping
    public ContactUs submitcontactUs(@RequestBody ContactUs contactUs) {
        return contactUsRepository.save(contactUs);
    }

    @GetMapping("/contactUs/all")
public ResponseEntity<?> getAllContactMessages() {
    try {
        List<ContactUs> messages = contactUsRepository.findAll();
        return ResponseEntity.ok(messages);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error fetching messages: " + e.getMessage());
    }
}


}