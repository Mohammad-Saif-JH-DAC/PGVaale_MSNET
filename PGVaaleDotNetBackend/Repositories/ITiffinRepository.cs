using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface ITiffinRepository
    {
        Task<List<Tiffin>> GetAllAsync();
        Task<Tiffin?> GetByIdAsync(long id);
        Task<Tiffin?> FindByUsernameAsync(string username);
        Task<Tiffin?> FindByEmailAsync(string email);
        Task<List<Tiffin>> FindByApprovedFalseAsync();
        Task<List<Tiffin>> FindByApprovedTrueAsync();
        Task<Tiffin> SaveAsync(Tiffin tiffin);
        Task DeleteAsync(long id);
    }
}
