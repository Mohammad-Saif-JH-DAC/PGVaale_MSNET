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
                var allUsers = await _userRepository.GetAllAsync();
                var allMaids = await _maidRepository.GetAllAsync();
                var allUserMaids = await _userMaidRepository.GetAllAsync();

                // Calculate statistics
                stats.TotalUsers = allUsers.Count;
                stats.TotalMaids = allMaids.Count;
                stats.PendingMaids = allMaids.Count(m => !m.Approved);
                stats.TotalOwners = 0; // Will be implemented when Owner entity is added
                stats.TotalTiffinProviders = 0; // Will be implemented when Tiffin entity is added
                stats.TotalPGs = 0; // Will be implemented when PG entity is added
                stats.PendingTiffins = 0;
                stats.TotalServiceProviders = 0;
                stats.TotalAccounts = allUsers.Count + allMaids.Count;
                stats.AverageFeedbackRating = 0.0m;

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
