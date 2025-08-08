using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.DTOs
{
    // Java: @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public class TiffinDashboardDTO
    {
        // Java: private String tiffinName;
        public string TiffinName { get; set; } = string.Empty;
        
        // Java: private Long pendingRequests;
        public long PendingRequests { get; set; }
        
        // Java: private Long acceptedRequests;
        public long AcceptedRequests { get; set; }
        
        // Java: private Long rejectedRequests;
        public long RejectedRequests { get; set; }
        
        // Java: private Double averageRating;
        public double? AverageRating { get; set; }
        
        // Java: private List<UserTiffinDTO> recentRequests;
        public List<UserTiffinDTO> RecentRequests { get; set; } = new List<UserTiffinDTO>();

        // Default constructor (equivalent to @NoArgsConstructor)
        public TiffinDashboardDTO()
        {
        }

        // Constructor with all parameters (equivalent to @AllArgsConstructor)
        public TiffinDashboardDTO(
            string tiffinName,
            long pendingRequests,
            long acceptedRequests,
            long rejectedRequests,
            double? averageRating,
            List<UserTiffinDTO> recentRequests)
        {
            TiffinName = tiffinName;
            PendingRequests = pendingRequests;
            AcceptedRequests = acceptedRequests;
            RejectedRequests = rejectedRequests;
            AverageRating = averageRating;
            RecentRequests = recentRequests;
        }

        // Builder pattern (equivalent to @Builder)
        public class TiffinDashboardDTOBuilder
        {
            private string _tiffinName = string.Empty;
            private long _pendingRequests;
            private long _acceptedRequests;
            private long _rejectedRequests;
            private double? _averageRating;
            private List<UserTiffinDTO> _recentRequests = new List<UserTiffinDTO>();

            public TiffinDashboardDTOBuilder TiffinName(string tiffinName)
            {
                _tiffinName = tiffinName;
                return this;
            }

            public TiffinDashboardDTOBuilder PendingRequests(long pendingRequests)
            {
                _pendingRequests = pendingRequests;
                return this;
            }

            public TiffinDashboardDTOBuilder AcceptedRequests(long acceptedRequests)
            {
                _acceptedRequests = acceptedRequests;
                return this;
            }

            public TiffinDashboardDTOBuilder RejectedRequests(long rejectedRequests)
            {
                _rejectedRequests = rejectedRequests;
                return this;
            }

            public TiffinDashboardDTOBuilder AverageRating(double? averageRating)
            {
                _averageRating = averageRating;
                return this;
            }

            public TiffinDashboardDTOBuilder RecentRequests(List<UserTiffinDTO> recentRequests)
            {
                _recentRequests = recentRequests;
                return this;
            }

            public TiffinDashboardDTO Build()
            {
                return new TiffinDashboardDTO(
                    _tiffinName,
                    _pendingRequests,
                    _acceptedRequests,
                    _rejectedRequests,
                    _averageRating,
                    _recentRequests);
            }
        }

        // Static method to create builder (equivalent to Lombok @Builder)
        public static TiffinDashboardDTOBuilder Builder()
        {
            return new TiffinDashboardDTOBuilder();
        }
    }
}
