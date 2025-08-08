using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IServiceProviderRepository
    {
        Task<List<ServiceProvider>> GetAllAsync();
        Task<ServiceProvider?> GetByIdAsync(long id);
        Task<List<ServiceProvider>> FindByTypeAsync(string type);
        Task<List<ServiceProvider>> FindByRegionAsync(string region);
        Task<List<ServiceProvider>> FindByApprovedAsync(bool approved);
        Task<ServiceProvider> SaveAsync(ServiceProvider serviceProvider);
        Task DeleteAsync(long id);
    }
}
