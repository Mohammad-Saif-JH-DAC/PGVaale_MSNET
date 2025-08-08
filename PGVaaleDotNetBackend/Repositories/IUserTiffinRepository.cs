using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IUserTiffinRepository
    {
        Task<List<UserTiffin>> GetAllAsync();
        Task<UserTiffin?> GetByIdAsync(long id);
        Task<List<UserTiffin>> FindByTiffinIdAsync(long tiffinId);
        Task<List<UserTiffin>> FindByUserIdAsync(long userId);
        Task<List<UserTiffin>> FindByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status);
        Task<List<UserTiffin>> FindByUserIdAndStatusAsync(long userId, UserTiffin.RequestStatus status);
        Task<UserTiffin?> FindByUserIdAndTiffinIdAsync(long userId, long tiffinId);
        Task<List<UserTiffin>> FindByTiffinIdAndStatusOrderByAssignedDateTimeDescAsync(long tiffinId, UserTiffin.RequestStatus status);
        Task<List<UserTiffin>> FindByUserIdAndStatusOrderByAssignedDateTimeDescAsync(long userId, UserTiffin.RequestStatus status);
        Task<long> CountByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status);
        Task<UserTiffin> SaveAsync(UserTiffin userTiffin);
        Task DeleteAsync(long id);
    }
}
