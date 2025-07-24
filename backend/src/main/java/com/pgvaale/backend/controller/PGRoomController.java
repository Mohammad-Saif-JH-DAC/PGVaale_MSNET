package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.PGRoom;
import com.pgvaale.backend.service.PGRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pgrooms")
public class PGRoomController {
    @Autowired
    private PGRoomService pgRoomService;

    @GetMapping
    public List<PGRoom> getAllRooms() {
        return pgRoomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PGRoom> getRoomById(@PathVariable Long id) {
        return pgRoomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PGRoom createRoom(@RequestBody PGRoom room) {
        return pgRoomService.saveRoom(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PGRoom> updateRoom(@PathVariable Long id, @RequestBody PGRoom room) {
        return pgRoomService.getRoomById(id)
                .map(existing -> {
                    room.setId(id);
                    return ResponseEntity.ok(pgRoomService.saveRoom(room));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        pgRoomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/region/{region}")
    public List<PGRoom> getRoomsByRegion(@PathVariable String region) {
        return pgRoomService.findByRegion(region);
    }

    @GetMapping("/state/{state}")
    public List<PGRoom> getRoomsByState(@PathVariable String state) {
        return pgRoomService.findByState(state);
    }

    @GetMapping("/gender/{gender}")
    public List<PGRoom> getRoomsByGender(@PathVariable String gender) {
        return pgRoomService.findByGender(gender);
    }

    @GetMapping("/available/{available}")
    public List<PGRoom> getRoomsByAvailability(@PathVariable boolean available) {
        return pgRoomService.findByAvailable(available);
    }

    @GetMapping("/owner/{username}")
    public List<PGRoom> getRoomsByOwner(@PathVariable String username) {
        return pgRoomService.findByCreatedBy(username);
    }
} 