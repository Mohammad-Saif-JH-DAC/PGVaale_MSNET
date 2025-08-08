using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class ServiceProviderRepository : IServiceProviderRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceProviderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ServiceProvider>> GetAllAsync()
        {
            return await _context.ServiceProviders.ToListAsync();
        }

        public async Task<ServiceProvider?> GetByIdAsync(long id)
        {
            return await _context.ServiceProviders.FindAsync(id);
        }

        public async Task<List<ServiceProvider>> FindByTypeAsync(string type)
        {
            return await _context.ServiceProviders
                .Where(sp => sp.Type == type)
                .ToListAsync();
        }

        public async Task<List<ServiceProvider>> FindByRegionAsync(string region)
        {
            return await _context.ServiceProviders
                .Where(sp => sp.Region == region)
                .ToListAsync();
        }

        public async Task<List<ServiceProvider>> FindByApprovedAsync(bool approved)
        {
            return await _context.ServiceProviders
                .Where(sp => sp.Approved == approved)
                .ToListAsync();
        }

        public async Task<ServiceProvider> SaveAsync(ServiceProvider serviceProvider)
        {
            if (serviceProvider.Id == 0)
            {
                _context.ServiceProviders.Add(serviceProvider);
            }
            else
            {
                _context.ServiceProviders.Update(serviceProvider);
            }
            
            await _context.SaveChangesAsync();
            return serviceProvider;
        }

        public async Task DeleteAsync(long id)
        {
            var serviceProvider = await _context.ServiceProviders.FindAsync(id);
            if (serviceProvider != null)
            {
                _context.ServiceProviders.Remove(serviceProvider);
                await _context.SaveChangesAsync();
            }
        }
    }
}
