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

        public IEnumerable<Tiffin> GetAll()
        {
            return _context.Tiffins.ToList();
        }

        public Tiffin? GetById(long id)
        {
            return _context.Tiffins.FirstOrDefault(t => t.Id == id);
        }

        public Tiffin? GetByUsername(string username)
        {
            return _context.Tiffins.FirstOrDefault(t => t.Username == username);
        }

        public Tiffin? GetByEmail(string email)
        {
            return _context.Tiffins.FirstOrDefault(t => t.Email == email);
        }

        public void Add(Tiffin tiffin)
        {
            _context.Tiffins.Add(tiffin);
            _context.SaveChanges();
        }

        public void Update(Tiffin tiffin)
        {
            _context.Tiffins.Update(tiffin);
            _context.SaveChanges();
        }

        public void Delete(long id)
        {
            var tiffin = _context.Tiffins.Find(id);
            if (tiffin != null)
            {
                _context.Tiffins.Remove(tiffin);
                _context.SaveChanges();
            }
        }

        public async Task<Tiffin?> GetTiffinByIdAsync(long id)
        {
            return await _context.Tiffins.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<Tiffin>> GetApprovedTiffinsAsync()
        {
            return await _context.Tiffins.Where(t => t.Approved).ToListAsync();
        }

        public async Task<IEnumerable<Tiffin>> GetPendingTiffinsAsync()
        {
            return await _context.Tiffins.Where(t => !t.Approved).ToListAsync();
        }

        public async Task<Tiffin?> GetByUsernameAsync(string username)
        {
            return await _context.Tiffins.FirstOrDefaultAsync(t => t.Username == username);
        }

        public async Task<Tiffin?> GetByEmailAsync(string email)
        {
            return await _context.Tiffins.FirstOrDefaultAsync(t => t.Email == email);
        }
    }
}
