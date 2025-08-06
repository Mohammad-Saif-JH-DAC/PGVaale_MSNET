package com.pgvaale.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgvaale.backend.dto.PgDetailsResponseDTO;
import com.pgvaale.backend.service.PgDetailsService;

@RestController
@RequestMapping("/api/pg-details")
@CrossOrigin(origins = "http://localhost:3000")
public class PgDetailsController {

    @Autowired
    private PgDetailsService pgDetailsService;

    @GetMapping("/{userId}")
    public ResponseEntity<PgDetailsResponseDTO> getPgDetails(@PathVariable Long userId) {
        PgDetailsResponseDTO pgDetails = pgDetailsService.getPgDetailsByUserId(userId);
        return ResponseEntity.ok(pgDetails);
    }
}
