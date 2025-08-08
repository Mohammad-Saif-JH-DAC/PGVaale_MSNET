using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class TiffinRepository : ITiffinRepository
    {
        private readonly ApplicationDbContext _context;

        public TiffinRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tiffin>> GetAllAsync()
        {
            return await _context.Tiffins.ToListAsync();
        }

        public async Task<Tiffin?> GetByIdAsync(long id)
        {
            return await _context.Tiffins.FindAsync(id);
        }

        public async Task<Tiffin?> FindByUsernameAsync(string username)
        {
            return await _context.Tiffins.FirstOrDefaultAsync(t => t.Username == username);
        }

        public async Task<Tiffin?> FindByEmailAsync(string email)
        {
            return await _context.Tiffins.FirstOrDefaultAsync(t => t.Email == email);
        }

        public async Task<List<Tiffin>> FindByApprovedFalseAsync()
        {
            return await _context.Tiffins.Where(t => t.Approved == false).ToListAsync();
        }

        public async Task<List<Tiffin>> FindByApprovedTrueAsync()
        {
            return await _context.Tiffins.Where(t => t.Approved == true).ToListAsync();
        }

        public async Task<Tiffin> SaveAsync(Tiffin tiffin)
        {
            if (tiffin.Id == 0)
            {
                _context.Tiffins.Add(tiffin);
            }
            else
            {
                _context.Tiffins.Update(tiffin);
            }
            
            await _context.SaveChangesAsync();
            return tiffin;
        }

        public async Task DeleteAsync(long id)
        {
            var tiffin = await _context.Tiffins.FindAsync(id);
            if (tiffin != null)
            {
                _context.Tiffins.Remove(tiffin);
                await _context.SaveChangesAsync();
            }
        }
    }
}
