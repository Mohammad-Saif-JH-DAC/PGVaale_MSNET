// src/main/java/com/pgvaale/backend/service/DashboardService.java
package com.pgvaale.backend.service;

import com.pgvaale.backend.dto.DashboardStatsDTO;
import com.pgvaale.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

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

    @Autowired
    private Feedback_WebRepository feedback_webRepository; // ← Add this

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

        // 🔴 Calculate average feedback rating
        Double avg = feedback_webRepository.averageFeedbackRating();
        BigDecimal averageFeedbackRating = avg != null
                ? BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new DashboardStatsDTO(
                totalUsers,
                totalOwners,
                totalTiffinProviders,
                totalMaids,
                totalPGs,
                pendingMaids,
                pendingTiffins,
                totalServiceProviders,
                totalAccounts,
                averageFeedbackRating // ← Make sure DTO supports this!
        );
    }
}