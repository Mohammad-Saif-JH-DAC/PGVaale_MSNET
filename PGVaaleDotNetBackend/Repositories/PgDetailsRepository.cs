using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class PgDetailsRepository : IPgDetailsRepository
    {
        private readonly ApplicationDbContext _context;

        public PgDetailsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PgDetails>> GetAllAsync()
        {
            return await _context.PgDetails.ToListAsync();
        }

        public async Task<PgDetails?> GetByIdAsync(long id)
        {
            return await _context.PgDetails.FindAsync(id);
        }

        public async Task<PgDetails> SaveAsync(PgDetails pgDetails)
        {
            if (pgDetails.PgId == 0)
            {
                _context.PgDetails.Add(pgDetails);
            }
            else
            {
                _context.PgDetails.Update(pgDetails);
            }
            
            await _context.SaveChangesAsync();
            return pgDetails;
        }

        public async Task DeleteAsync(long id)
        {
            var pgDetails = await _context.PgDetails.FindAsync(id);
            if (pgDetails != null)
            {
                _context.PgDetails.Remove(pgDetails);
                await _context.SaveChangesAsync();
            }
        }
    }
}
