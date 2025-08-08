using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IUserMaidRepository
    {
        Task<List<UserMaid>> GetAllAsync();
        Task<UserMaid?> GetByIdAsync(long id);
        Task<UserMaid> SaveAsync(UserMaid userMaid);
        Task DeleteAsync(long id);
        
        // Find all requests for a specific maid
        Task<List<UserMaid>> FindByMaidIdAsync(long maidId);
        
        // Find all requests for a specific user
        Task<List<UserMaid>> FindByUserIdAsync(long userId);
        
        // Count requests for a specific user
        Task<long> CountByUserIdAsync(long userId);
        
        // Find requests by status for a maid (excluding deleted/canceled requests)
        Task<List<UserMaid>> FindByMaidIdAndStatusAsync(long maidId, UserMaid.RequestStatus status);
        
        // Find requests by status for a user (excluding deleted/canceled requests)
        Task<List<UserMaid>> FindByUserIdAndStatusAsync(long userId, UserMaid.RequestStatus status);
        
        // Find requests by user, maid, and status (excluding deleted/canceled requests)
        Task<List<UserMaid>> FindByUserIdAndMaidIdAndStatusAsync(long userId, long maidId, UserMaid.RequestStatus status);
        
        // Find active requests (not deleted) for a maid
        Task<List<UserMaid>> FindActiveRequestsByMaidIdAsync(long maidId);
        
        // Find active requests (not deleted) for a user
        Task<List<UserMaid>> FindActiveRequestsByUserIdAsync(long userId);
        
        // Find accepted requests for a user (active maid service)
        Task<List<UserMaid>> FindAcceptedRequestsByUserIdAsync(long userId);
        
        // Count pending requests for a maid (excluding deleted/canceled requests)
        Task<long> CountByMaidIdAndStatusAsync(long maidId, UserMaid.RequestStatus status);
        
        // Check if a user has an active request with a specific maid
        Task<bool> ExistsActiveRequestByUserIdAndMaidIdAsync(long userId, long maidId);
        
        // Count active requests for a user (excluding deleted/canceled requests)
        Task<long> CountActiveRequestsByUserIdAsync(long userId);
        
        // Check if a user has any active request
        Task<bool> ExistsActiveRequestByUserIdAsync(long userId);
        
        // Find all requests for a maid (including canceled ones)
        Task<List<UserMaid>> FindAllRequestsByMaidIdAsync(long maidId);
    }
}