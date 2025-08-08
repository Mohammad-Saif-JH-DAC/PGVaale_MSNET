using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class OwnerRepository : IOwnerRepository
    {
        private readonly ApplicationDbContext _context;

        public OwnerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Owner>> GetAllAsync()
        {
            return await _context.Owners.ToListAsync();
        }

        public async Task<Owner?> GetByIdAsync(long id)
        {
            return await _context.Owners.FindAsync(id);
        }

        public async Task<Owner?> FindByUsernameAsync(string username)
        {
            return await _context.Owners
                .FirstOrDefaultAsync(o => o.Username == username);
        }

        public async Task<Owner?> FindByEmailAsync(string email)
        {
            return await _context.Owners
                .FirstOrDefaultAsync(o => o.Email == email);
        }

        public async Task<Owner> SaveAsync(Owner owner)
        {
            if (owner.Id == 0)
            {
                _context.Owners.Add(owner);
            }
            else
            {
                _context.Owners.Update(owner);
            }
            
            await _context.SaveChangesAsync();
            return owner;
        }

        public async Task DeleteAsync(long id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner != null)
            {
                _context.Owners.Remove(owner);
                await _context.SaveChangesAsync();
            }
        }
    }
}
