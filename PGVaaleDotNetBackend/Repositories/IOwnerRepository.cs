using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IOwnerRepository
    {
        Task<List<Owner>> GetAllAsync();
        Task<Owner?> GetByIdAsync(long id);
        Task<Owner?> FindByUsernameAsync(string username);
        Task<Owner?> FindByEmailAsync(string email);
        Task<Owner> SaveAsync(Owner owner);
        Task DeleteAsync(long id);
    }
}
