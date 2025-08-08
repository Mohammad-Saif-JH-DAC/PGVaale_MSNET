using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IMenuRepository
    {
        Task<List<Menu>> GetAllAsync();
        Task<Menu?> GetByIdAsync(long id);
        Task<List<Menu>> FindByTiffinIdAndIsActiveTrueAsync(long tiffinId);
        Task<List<Menu>> FindByTiffinIdAsync(long tiffinId);
        Task<Menu?> FindByTiffinIdAndDayOfWeekAndIsActiveTrueAsync(long tiffinId, string dayOfWeek);
        Task<Menu?> FindByTiffinIdAndMenuDateAndIsActiveTrueAsync(long tiffinId, DateTime menuDate);
        Task<List<Menu>> FindByTiffinIdAndDateRangeAsync(long tiffinId, DateTime startDate, DateTime endDate);
        Task<Menu> SaveAsync(Menu menu);
        Task DeleteAsync(long id);
    }
}
