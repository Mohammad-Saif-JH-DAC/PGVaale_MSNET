namespace PGVaaleDotNetBackend.DTOs
{
    // Java: @Data @NoArgsConstructor @AllArgsConstructor
    public class DashboardStatsDTO
    {
        // Java: private long totalUsers;
        public long TotalUsers { get; set; }
        
        // Java: private long totalOwners;
        public long TotalOwners { get; set; }
        
        // Java: private long totalTiffinProviders;
        public long TotalTiffinProviders { get; set; }
        
        // Java: private long totalMaids;
        public long TotalMaids { get; set; }
        
        // Java: private long totalPGs;
        public long TotalPGs { get; set; }
        
        // Java: private long pendingMaids;
        public long PendingMaids { get; set; }
        
        // Java: private long pendingTiffins;
        public long PendingTiffins { get; set; }
        
        // Java: private long totalServiceProviders;
        public long TotalServiceProviders { get; set; }
        
        // Java: private long totalAccounts;
        public long TotalAccounts { get; set; }
        
        // Java: private BigDecimal averageFeedbackRating;
        public decimal AverageFeedbackRating { get; set; }

        // Default constructor (equivalent to @NoArgsConstructor)
        public DashboardStatsDTO()
        {
        }

        // Constructor with all parameters (equivalent to @AllArgsConstructor)
        public DashboardStatsDTO(
            long totalUsers,
            long totalOwners,
            long totalTiffinProviders,
            long totalMaids,
            long totalPGs,
            long pendingMaids,
            long pendingTiffins,
            long totalServiceProviders,
            long totalAccounts,
            decimal averageFeedbackRating)
        {
            TotalUsers = totalUsers;
            TotalOwners = totalOwners;
            TotalTiffinProviders = totalTiffinProviders;
            TotalMaids = totalMaids;
            TotalPGs = totalPGs;
            PendingMaids = pendingMaids;
            PendingTiffins = pendingTiffins;
            TotalServiceProviders = totalServiceProviders;
            TotalAccounts = totalAccounts;
            AverageFeedbackRating = averageFeedbackRating;
        }

        // Java: public BigDecimal getAverageFeedbackRating()
        public decimal GetAverageFeedbackRating()
        {
            return AverageFeedbackRating;
        }
    }
}
