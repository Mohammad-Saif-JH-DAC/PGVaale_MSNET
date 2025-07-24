package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.RoomInterest;
import com.pgvaale.backend.repository.RoomInterestRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
} 