using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IMaidRepository
    {
        Task<List<Maid>> GetAllAsync();
        Task<Maid?> GetByIdAsync(long id);
        Task<Maid?> FindByUsernameAsync(string username);
        Task<Maid?> FindByEmailAsync(string email);
        Task<List<Maid>> FindByApprovedFalseAsync();
        Task<List<Maid>> FindByApprovedTrueAsync();
        Task<List<Maid>> FindByRegionAndApprovedTrueAsync(string region);
        Task<Maid> SaveAsync(Maid maid);
        Task DeleteAsync(long id);
    }
}