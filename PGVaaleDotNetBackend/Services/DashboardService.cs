using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Repositories;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Services
{
    public class DashboardService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMaidRepository _maidRepository;
        private readonly IUserMaidRepository _userMaidRepository;

        public DashboardService(IUserRepository userRepository, IMaidRepository maidRepository, IUserMaidRepository userMaidRepository)
        {
            _userRepository = userRepository;
            _maidRepository = maidRepository;
            _userMaidRepository = userMaidRepository;
        }

        public async Task<DashboardStatsDTO> GetDashboardStatsAsync()
        {
            var stats = new DashboardStatsDTO();

            try
            {
                // Get all entities
                var allUsers = _userRepository.GetAll().ToList(); // Convert to List for async compatibility
                var allMaids = await _maidRepository.GetAllMaidsAsync();
                var allUserMaids = await _userMaidRepository.GetAllAsync();

                // Calculate statistics
                stats.TotalUsers = allUsers.Count;
                stats.TotalMaids = allMaids.Count;
                stats.PendingMaids = allMaids.Count(m => !m.Approved);
                stats.ApprovedMaids = allMaids.Count(m => m.Approved);
                stats.TotalBookings = allUserMaids.Count;
                stats.ActiveBookings = allUserMaids.Count(um => um.Status == UserMaid.RequestStatus.ACCEPTED);
                stats.CompletedBookings = allUserMaids.Count(um => um.Status == UserMaid.RequestStatus.CANCELLED);

                // For now, set placeholder values for entities that don't exist yet
                stats.TotalOwners = 0; // Will be implemented when Owner entity is added
                stats.TotalTiffins = 0; // Will be implemented when Tiffin entity is added
                stats.PendingTiffins = 0;
                stats.ApprovedTiffins = 0;
                stats.TotalPGs = 0; // Will be implemented when PG entity is added
                stats.TotalRevenue = 0.0;
                stats.MonthlyRevenue = 0.0;

                return stats;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error getting dashboard stats: {ex.Message}");
                throw;
            }
        }
    }
}
