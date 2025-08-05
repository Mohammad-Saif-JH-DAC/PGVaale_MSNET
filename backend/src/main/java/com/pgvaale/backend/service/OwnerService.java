package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.Owner;
import com.pgvaale.backend.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {
    @Autowired
    private OwnerRepository ownerRepository;

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    public Owner saveOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    public void deleteOwner(Long id) {
        ownerRepository.deleteById(id);
    }

    public Owner updateOwner(Long id, Owner updatedOwner) {
        Optional<Owner> existingOwnerOpt = ownerRepository.findById(id);
        if (existingOwnerOpt.isEmpty()) {
            throw new RuntimeException("Owner not found with id: " + id);
        }

        Owner existingOwner = existingOwnerOpt.get();

        // Update fields (you can add more as needed)
        existingOwner.setName(updatedOwner.getName());
        existingOwner.setEmail(updatedOwner.getEmail());
        existingOwner.setMobileNumber(updatedOwner.getMobileNumber());
        existingOwner.setRegion(updatedOwner.getRegion());
        existingOwner.setAge(updatedOwner.getAge());
        existingOwner.setAadhaar(updatedOwner.getAadhaar());

        // Optionally: don't allow email/id changes
        // existingOwner.setEmail(existingOwner.getEmail()); // keep old

        return ownerRepository.save(existingOwner);
    }
}