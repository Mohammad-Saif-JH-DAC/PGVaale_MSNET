using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class PGRepository : IPGRepository
    {
        private readonly ApplicationDbContext _context;

        public PGRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PG>> GetAllAsync()
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .ToListAsync();
        }

        public async Task<PG?> GetByIdAsync(long id)
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<PG>> FindByOwnerAsync(Owner owner)
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .Where(p => p.OwnerId == owner.Id)
                .ToListAsync();
        }

        public async Task<List<PG>> FindByRegionAsync(string region)
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .Where(p => p.Region == region)
                .ToListAsync();
        }

        public async Task<List<PG>> FindByGeneralPreferenceAsync(string generalPreference)
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .Where(p => p.GeneralPreference == generalPreference)
                .ToListAsync();
        }

        public async Task<List<PG>> FindByRegisteredUserAsync(User registeredUser)
        {
            return await _context.PGs
                .Include(p => p.Owner)
                .Include(p => p.RegisteredUser)
                .Where(p => p.UserId == registeredUser.Id)
                .ToListAsync();
        }

        public async Task<PG> SaveAsync(PG pg)
        {
            if (pg.Id == 0)
            {
                _context.PGs.Add(pg);
            }
            else
            {
                _context.PGs.Update(pg);
            }
            
            await _context.SaveChangesAsync();
            return pg;
        }

        public async Task DeleteAsync(long id)
        {
            var pg = await _context.PGs.FindAsync(id);
            if (pg != null)
            {
                _context.PGs.Remove(pg);
                await _context.SaveChangesAsync();
            }
        }
    }
}
