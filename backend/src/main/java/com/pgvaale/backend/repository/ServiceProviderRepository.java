package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    List<ServiceProvider> findByType(String type);
    List<ServiceProvider> findByRegion(String region);
    List<ServiceProvider> findByApproved(boolean approved);
} 