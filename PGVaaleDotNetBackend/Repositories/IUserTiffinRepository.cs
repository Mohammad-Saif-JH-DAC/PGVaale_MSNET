using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IUserTiffinRepository
    {
        IEnumerable<UserTiffin> GetAll();
        UserTiffin? GetById(long id);
        void Add(UserTiffin userTiffin);
        void Update(UserTiffin userTiffin);
        void Delete(long id);
        Task<IEnumerable<UserTiffin>> GetAllAsync();
        Task<UserTiffin?> GetByIdAsync(long id);
        Task<IEnumerable<UserTiffin>> GetByUserIdAsync(long userId);
        Task<IEnumerable<UserTiffin>> GetByTiffinIdAsync(long tiffinId);
        Task<UserTiffin?> GetByUserIdAndTiffinIdAsync(long userId, long tiffinId);
        Task<IEnumerable<UserTiffin>> GetByUserIdAndStatusAsync(long userId, UserTiffin.RequestStatus status);
        Task<IEnumerable<UserTiffin>> GetByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status);
        Task<long> CountByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status);
    }
}
