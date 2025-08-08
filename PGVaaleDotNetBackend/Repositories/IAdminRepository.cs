using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IAdminRepository
    {
        Task<List<Admin>> GetAllAsync();
        Task<Admin?> GetByIdAsync(long id);
        Task<Admin?> GetByUsernameAsync(string username);
        Task<Admin?> GetByEmailAsync(string email);
        Task<Admin> SaveAsync(Admin admin);
        Task DeleteAsync(long id);
    }
}
