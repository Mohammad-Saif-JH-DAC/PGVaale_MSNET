package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.PGRoom;
import com.pgvaale.backend.repository.PGRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PGRoomService {
    @Autowired
    private PGRoomRepository pgRoomRepository;

    public List<PGRoom> getAllRooms() {
        return pgRoomRepository.findAll();
    }

    public Optional<PGRoom> getRoomById(Long id) {
        return pgRoomRepository.findById(id);
    }

    public PGRoom saveRoom(PGRoom room) {
        return pgRoomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        pgRoomRepository.deleteById(id);
    }

    public List<PGRoom> findByRegion(String region) {
        return pgRoomRepository.findByRegion(region);
    }

    public List<PGRoom> findByState(String state) {
        return pgRoomRepository.findByState(state);
    }

    public List<PGRoom> findByGender(String gender) {
        return pgRoomRepository.findByGender(gender);
    }

    public List<PGRoom> findByAvailable(boolean available) {
        return pgRoomRepository.findByAvailable(available);
    }

    public List<PGRoom> findByCreatedBy(String createdBy) {
        return pgRoomRepository.findByCreatedBy(createdBy);
    }
} 