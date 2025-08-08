namespace PGVaaleDotNetBackend.DTOs
{
    public class DashboardStatsDTO
    {
        public long TotalUsers { get; set; }
        public long TotalOwners { get; set; }
        public long TotalMaids { get; set; }
        public long TotalTiffins { get; set; }
        public long PendingMaids { get; set; }
        public long PendingTiffins { get; set; }
        public long ApprovedMaids { get; set; }
        public long ApprovedTiffins { get; set; }
        public long TotalPGs { get; set; }
        public long TotalBookings { get; set; }
        public long ActiveBookings { get; set; }
        public long CompletedBookings { get; set; }
        public double TotalRevenue { get; set; }
        public double MonthlyRevenue { get; set; }
    }
}
