package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.RoomInterest;
import com.pgvaale.backend.repository.RoomInterestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/room-interests")
public class RoomInterestController {
    @Autowired
    private RoomInterestRepository repo;

    @PostMapping
    public RoomInterest expressInterest(@RequestBody RoomInterest interest) {
        return repo.save(interest);
    }

    @GetMapping("/room/{roomId}")
    public List<RoomInterest> getInterestsForRoom(@PathVariable Long roomId) {
        return repo.findByRoomId(roomId);
    }
    
    @GetMapping("/user")
    public List<RoomInterest> getUserInterests() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return repo.findByUsername(username);
    }
}