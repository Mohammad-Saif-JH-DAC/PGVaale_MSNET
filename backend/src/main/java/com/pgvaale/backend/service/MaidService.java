package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.Maid;
import com.pgvaale.backend.repository.MaidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaidService {
    @Autowired
    private MaidRepository maidRepository;

    public List<Maid> getAllMaids() {
        return maidRepository.findAll();
    }

    public Optional<Maid> getMaidById(Long id) {
        return maidRepository.findById(id);
    }

    public Maid saveMaid(Maid maid) {
        return maidRepository.save(maid);
    }

    public void deleteMaid(Long id) {
        maidRepository.deleteById(id);
    }
} 