package com.pgvaale.backend.controller;

import com.pgvaale.backend.entity.ServiceProvider;
import com.pgvaale.backend.service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/service-providers")
public class ServiceProviderController {
    @Autowired
    private ServiceProviderService serviceProviderService;

    @GetMapping
    public List<ServiceProvider> getAllProviders() {
        return serviceProviderService.getAllProviders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProvider> getProviderById(@PathVariable Long id) {
        return serviceProviderService.getProviderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ServiceProvider createProvider(@RequestBody ServiceProvider provider) {
        return serviceProviderService.saveProvider(provider);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProvider> updateProvider(@PathVariable Long id, @RequestBody ServiceProvider provider) {
        return serviceProviderService.getProviderById(id)
                .map(existing -> {
                    provider.setId(id);
                    return ResponseEntity.ok(serviceProviderService.saveProvider(provider));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        serviceProviderService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{type}")
    public List<ServiceProvider> getProvidersByType(@PathVariable String type) {
        return serviceProviderService.findByType(type);
    }

    @GetMapping("/region/{region}")
    public List<ServiceProvider> getProvidersByRegion(@PathVariable String region) {
        return serviceProviderService.findByRegion(region);
    }

    @GetMapping("/approved/{approved}")
    public List<ServiceProvider> getProvidersByApproval(@PathVariable boolean approved) {
        return serviceProviderService.findByApproved(approved);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ServiceProvider> approveProvider(@PathVariable Long id) {
        ServiceProvider provider = serviceProviderService.approveProvider(id);
        if (provider != null) {
            return ResponseEntity.ok(provider);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ServiceProvider> rejectProvider(@PathVariable Long id) {
        ServiceProvider provider = serviceProviderService.rejectProvider(id);
        if (provider != null) {
            return ResponseEntity.ok(provider);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 