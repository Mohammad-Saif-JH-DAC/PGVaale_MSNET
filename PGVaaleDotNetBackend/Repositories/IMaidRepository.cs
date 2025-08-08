using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IMaidRepository
    {
        Task<List<Maid>> GetAllMaidsAsync();
        Task<Maid?> GetMaidByIdAsync(long id);
        Task<Maid?> GetMaidByUsernameAsync(string username);
        Task<Maid?> GetMaidByEmailAsync(string email);
        Task<List<Maid>> GetMaidsByApprovedStatusAsync(bool approved);
        Task<List<Maid>> GetMaidsByRegionAndApprovedAsync(string region, bool approved);
        Task<Maid> SaveMaidAsync(Maid maid);
        Task DeleteMaidAsync(long id);
    }
}