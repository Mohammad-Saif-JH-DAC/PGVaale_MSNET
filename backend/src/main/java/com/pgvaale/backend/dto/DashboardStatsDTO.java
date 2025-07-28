package com.pgvaale.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalOwners;
    private long totalTiffinProviders;
    private long totalMaids;
    private long totalPGs;
    private long pendingMaids;
    private long pendingTiffins;
    private long totalServiceProviders;
    private long totalAccounts;
} 