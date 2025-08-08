using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IMenuRepository
    {
        IEnumerable<Menu> GetAll();
        Menu? GetById(long id);
        void Add(Menu menu);
        void Update(Menu menu);
        void Delete(long id);
        Task<IEnumerable<Menu>> GetAllAsync();
        Task<Menu?> GetByIdAsync(long id);
        Task<IEnumerable<Menu>> GetByTiffinIdAsync(long tiffinId);
        Task<IEnumerable<Menu>> GetByTiffinIdAndIsActiveAsync(long tiffinId, bool isActive);
        Task<Menu?> GetByTiffinIdAndDayOfWeekAsync(long tiffinId, string dayOfWeek);
        Task<Menu?> GetByTiffinIdAndDayOfWeekAndIsActiveAsync(long tiffinId, string dayOfWeek, bool isActive);
    }
}
