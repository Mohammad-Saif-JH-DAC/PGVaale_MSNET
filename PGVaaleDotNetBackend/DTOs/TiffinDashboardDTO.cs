using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.DTOs
{
    public class TiffinDashboardDTO
    {
        public string TiffinName { get; set; } = string.Empty;
        public long PendingRequests { get; set; }
        public long AcceptedRequests { get; set; }
        public long RejectedRequests { get; set; }
        public double AverageRating { get; set; }
        public List<UserTiffinDTO> RecentRequests { get; set; } = new List<UserTiffinDTO>();
    }
}
