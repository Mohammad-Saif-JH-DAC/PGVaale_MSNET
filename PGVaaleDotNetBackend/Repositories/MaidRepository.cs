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

        public async Task<List<Maid>> GetAllMaidsAsync()
        {
            return await _context.Maids.ToListAsync();
        }

        public async Task<Maid?> GetMaidByIdAsync(long id)
        {
            return await _context.Maids.FindAsync(id);
        }

        public async Task<Maid?> GetMaidByUsernameAsync(string username)
        {
            return await _context.Maids.FirstOrDefaultAsync(m => m.Username == username);
        }

        public async Task<Maid?> GetMaidByEmailAsync(string email)
        {
            return await _context.Maids.FirstOrDefaultAsync(m => m.Email == email);
        }

        public async Task<List<Maid>> GetMaidsByApprovedStatusAsync(bool approved)
        {
            return await _context.Maids.Where(m => m.Approved == approved).ToListAsync();
        }

        public async Task<List<Maid>> GetMaidsByRegionAndApprovedAsync(string region, bool approved)
        {
            return await _context.Maids.Where(m => m.Region == region && m.Approved == approved).ToListAsync();
        }

        public async Task<Maid> SaveMaidAsync(Maid maid)
        {
            if (maid.Id == 0)
            {
                // Generate a new ID since the database doesn't have auto-increment
                var maxId = await _context.Maids.MaxAsync(m => (long?)m.Id) ?? 0;
                maid.Id = maxId + 1;
                _context.Maids.Add(maid);
            }
            else
            {
                _context.Maids.Update(maid);
            }
            
            await _context.SaveChangesAsync();
            return maid;
        }

        public async Task DeleteMaidAsync(long id)
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
