package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.ContactUs;
import com.pgvaale.backend.repository.ContactUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

}