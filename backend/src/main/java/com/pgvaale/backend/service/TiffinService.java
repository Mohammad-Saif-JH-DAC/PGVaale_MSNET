package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.repository.TiffinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TiffinService {
    @Autowired
    private TiffinRepository tiffinRepository;

    public List<Tiffin> getAllTiffins() {
        return tiffinRepository.findAll();
    }

    public Optional<Tiffin> getTiffinById(Long id) {
        return tiffinRepository.findById(id);
    }

    public Tiffin saveTiffin(Tiffin tiffin) {
        return tiffinRepository.save(tiffin);
    }

    public void deleteTiffin(Long id) {
        tiffinRepository.deleteById(id);
    }
} 