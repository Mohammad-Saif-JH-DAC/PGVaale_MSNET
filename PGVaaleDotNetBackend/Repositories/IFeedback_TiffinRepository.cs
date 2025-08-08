using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IFeedback_TiffinRepository
    {
        IEnumerable<Feedback_Tiffin> GetAll();
        Feedback_Tiffin? GetById(long id);
        void Add(Feedback_Tiffin feedback);
        void Update(Feedback_Tiffin feedback);
        void Delete(long id);
        Task<IEnumerable<Feedback_Tiffin>> GetAllAsync();
        Task<Feedback_Tiffin?> GetByIdAsync(long id);
        Task<IEnumerable<Feedback_Tiffin>> GetByUserIdAsync(long userId);
        Task<IEnumerable<Feedback_Tiffin>> GetByTiffinIdAsync(long tiffinId);
        Task<double?> AverageFeedbackRatingAsync();
        Task<long> CountFeedbackAsync();
    }
}
