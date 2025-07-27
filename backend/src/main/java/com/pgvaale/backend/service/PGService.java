package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.PG;
import com.pgvaale.backend.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PGService {
    @Autowired
    private PGRepository pgRepository;

    public List<PG> getAllPGs() {
        return pgRepository.findAll();
    }

    public Optional<PG> getPGById(Long id) {
        return pgRepository.findById(id);
    }

    public PG savePG(PG pg) {
        return pgRepository.save(pg);
    }

    public void deletePG(Long id) {
        pgRepository.deleteById(id);
    }
} 