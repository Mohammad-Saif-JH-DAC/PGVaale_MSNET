using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Admin>> GetAllAsync()
        {
            return await _context.Admins.ToListAsync();
        }

        public async Task<Admin?> GetByIdAsync(long id)
        {
            return await _context.Admins.FindAsync(id);
        }

        public async Task<Admin?> GetByUsernameAsync(string username)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.Username == username);
        }

        public async Task<Admin?> GetByEmailAsync(string email)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
        }

        public async Task<Admin> SaveAsync(Admin admin)
        {
            if (admin.Id == 0)
            {
                // Generate a new ID since the database doesn't have auto-increment
                var maxId = await _context.Admins.MaxAsync(a => (long?)a.Id) ?? 0;
                admin.Id = maxId + 1;
                _context.Admins.Add(admin);
            }
            else
            {
                _context.Admins.Update(admin);
            }
            
            await _context.SaveChangesAsync();
            return admin;
        }

        public async Task DeleteAsync(long id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin != null)
            {
                _context.Admins.Remove(admin);
                await _context.SaveChangesAsync();
            }
        }
    }
}
