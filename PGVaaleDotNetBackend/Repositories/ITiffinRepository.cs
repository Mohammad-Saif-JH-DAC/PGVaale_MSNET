using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface ITiffinRepository
    {
        IEnumerable<Tiffin> GetAll();
        Tiffin? GetById(long id);
        Tiffin? GetByUsername(string username);
        Tiffin? GetByEmail(string email);
        void Add(Tiffin tiffin);
        void Update(Tiffin tiffin);
        void Delete(long id);
        Task<Tiffin?> GetTiffinByIdAsync(long id);
        Task<IEnumerable<Tiffin>> GetApprovedTiffinsAsync();
        Task<IEnumerable<Tiffin>> GetPendingTiffinsAsync();
        Task<Tiffin?> GetByUsernameAsync(string username);
        Task<Tiffin?> GetByEmailAsync(string email);
    }
}
