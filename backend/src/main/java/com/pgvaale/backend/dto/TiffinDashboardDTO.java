package com.pgvaale.backend.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TiffinDashboardDTO {
    private String tiffinName;
    private Long pendingRequests;
    private Long acceptedRequests;
    private Long rejectedRequests;
    private Double averageRating;
    private List<UserTiffinDTO> recentRequests;
} 