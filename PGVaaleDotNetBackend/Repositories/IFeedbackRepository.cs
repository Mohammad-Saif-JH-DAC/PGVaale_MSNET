using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IFeedbackRepository
    {
        Task<List<Feedback>> GetAllAsync();
        Task<Feedback?> GetByIdAsync(long id);
        Task<Feedback> SaveAsync(Feedback feedback);
        Task DeleteAsync(long id);
        Task<double?> AverageFeedbackRatingAsync();
        Task<double?> FindAverageRatingByMaidIdAsync(long maidId);
        Task<List<Feedback>> FindByMaidIdAsync(long maidId);
        Task<List<Feedback>> FindByUserIdAsync(long userId);
        Task<long> CountByUserIdAsync(long userId);
    }
}
