package com.pgvaale.backend.service;

import com.pgvaale.backend.dto.DashboardStatsDTO;
import com.pgvaale.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private TiffinRepository tiffinRepository;

    @Autowired
    private MaidRepository maidRepository;

    @Autowired
    private PGRepository pgRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOwners = ownerRepository.count();
        long totalTiffinProviders = tiffinRepository.count();
        long totalMaids = maidRepository.count();
        long totalPGs = pgRepository.count();
        long pendingMaids = maidRepository.findByApprovedFalse().size();
        long pendingTiffins = tiffinRepository.findByApprovedFalse().size();
        long totalServiceProviders = totalTiffinProviders + totalMaids;
        long totalAccounts = totalUsers + totalOwners + totalTiffinProviders + totalMaids;

        return new DashboardStatsDTO(
            totalUsers,
            totalOwners,
            totalTiffinProviders,
            totalMaids,
            totalPGs,
            pendingMaids,
            pendingTiffins,
            totalServiceProviders,
            totalAccounts
        );
    }
} 