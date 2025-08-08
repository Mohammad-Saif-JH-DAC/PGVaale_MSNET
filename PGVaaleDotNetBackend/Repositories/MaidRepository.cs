#nullable enable
using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class MaidRepository : IMaidRepository
    {
        private readonly ApplicationDbContext _context;

        public MaidRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Maid>> GetAllAsync()
        {
            return await _context.Maids.ToListAsync();
        }

        public async Task<Maid?> GetByIdAsync(long id)
        {
            return await _context.Maids.FindAsync(id);
        }

        public async Task<Maid?> FindByUsernameAsync(string username)
        {
            return await _context.Maids.FirstOrDefaultAsync(m => m.Username == username);
        }

        public async Task<Maid?> FindByEmailAsync(string email)
        {
            return await _context.Maids.FirstOrDefaultAsync(m => m.Email == email);
        }

        public async Task<List<Maid>> FindByApprovedFalseAsync()
        {
            return await _context.Maids.Where(m => m.Approved == false).ToListAsync();
        }

        public async Task<List<Maid>> FindByApprovedTrueAsync()
        {
            return await _context.Maids.Where(m => m.Approved == true).ToListAsync();
        }

        public async Task<List<Maid>> FindByRegionAndApprovedTrueAsync(string region)
        {
            return await _context.Maids.Where(m => m.Region == region && m.Approved == true).ToListAsync();
        }

        public async Task<Maid> SaveAsync(Maid maid)
        {
            if (maid.Id == 0)
            {
                _context.Maids.Add(maid);
            }
            else
            {
                _context.Maids.Update(maid);
            }
            
            await _context.SaveChangesAsync();
            return maid;
        }

        public async Task DeleteAsync(long id)
        {
            var maid = await _context.Maids.FindAsync(id);
            if (maid != null)
            {
                _context.Maids.Remove(maid);
                await _context.SaveChangesAsync();
            }
        }
    }
}
