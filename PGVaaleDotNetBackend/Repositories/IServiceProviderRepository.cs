using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IServiceProviderRepository
    {
        Task<List<Entities.ServiceProvider>> GetAllAsync();
        Task<Entities.ServiceProvider?> GetByIdAsync(long id);
        Task<List<Entities.ServiceProvider>> FindByTypeAsync(string type);
        Task<List<Entities.ServiceProvider>> FindByRegionAsync(string region);
        Task<List<Entities.ServiceProvider>> FindByApprovedAsync(bool approved);
        Task<Entities.ServiceProvider> SaveAsync(Entities.ServiceProvider serviceProvider);
        Task DeleteAsync(long id);
    }
}
