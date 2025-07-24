package com.pgvaale.backend.service;

import com.pgvaale.backend.entity.ServiceProvider;
import com.pgvaale.backend.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceProviderService {
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    public List<ServiceProvider> getAllProviders() {
        return serviceProviderRepository.findAll();
    }

    public Optional<ServiceProvider> getProviderById(Long id) {
        return serviceProviderRepository.findById(id);
    }

    public ServiceProvider saveProvider(ServiceProvider provider) {
        return serviceProviderRepository.save(provider);
    }

    public void deleteProvider(Long id) {
        serviceProviderRepository.deleteById(id);
    }

    public List<ServiceProvider> findByType(String type) {
        return serviceProviderRepository.findByType(type);
    }

    public List<ServiceProvider> findByRegion(String region) {
        return serviceProviderRepository.findByRegion(region);
    }

    public List<ServiceProvider> findByApproved(boolean approved) {
        return serviceProviderRepository.findByApproved(approved);
    }

    public ServiceProvider approveProvider(Long id) {
        Optional<ServiceProvider> providerOpt = serviceProviderRepository.findById(id);
        if (providerOpt.isPresent()) {
            ServiceProvider provider = providerOpt.get();
            provider.setApproved(true);
            return serviceProviderRepository.save(provider);
        }
        return null;
    }

    public ServiceProvider rejectProvider(Long id) {
        Optional<ServiceProvider> providerOpt = serviceProviderRepository.findById(id);
        if (providerOpt.isPresent()) {
            ServiceProvider provider = providerOpt.get();
            provider.setApproved(false);
            return serviceProviderRepository.save(provider);
        }
        return null;
    }
} 