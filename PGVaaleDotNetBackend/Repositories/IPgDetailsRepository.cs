using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IPgDetailsRepository
    {
        Task<List<PgDetails>> GetAllAsync();
        Task<PgDetails?> GetByIdAsync(long id);
        Task<PgDetails> SaveAsync(PgDetails pgDetails);
        Task DeleteAsync(long id);
    }
}
