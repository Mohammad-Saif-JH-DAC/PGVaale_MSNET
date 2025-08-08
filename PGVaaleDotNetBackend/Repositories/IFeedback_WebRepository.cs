using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IFeedback_WebRepository
    {
        Task<List<Feedback_Web>> GetAllAsync();
        Task<Feedback_Web?> GetByIdAsync(long id);
        Task<Feedback_Web> SaveAsync(Feedback_Web feedback);
        Task DeleteAsync(long id);
        Task<double?> AverageFeedbackRatingAsync();
        Task<long> CountFeedbackAsync();
    }
}
