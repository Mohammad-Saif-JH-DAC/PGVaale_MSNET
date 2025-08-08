using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IPGRepository
    {
        Task<List<PG>> GetAllAsync();
        Task<PG?> GetByIdAsync(long id);
        Task<List<PG>> FindByOwnerAsync(Owner owner);
        Task<List<PG>> FindByRegionAsync(string region);
        Task<List<PG>> FindByGeneralPreferenceAsync(string generalPreference);
        Task<List<PG>> FindByRegisteredUserAsync(User registeredUser);
        Task<PG> SaveAsync(PG pg);
        Task DeleteAsync(long id);
    }
}
