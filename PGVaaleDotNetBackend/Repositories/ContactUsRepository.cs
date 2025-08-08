using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class ContactUsRepository : IContactUsRepository
    {
        private readonly ApplicationDbContext _context;

        public ContactUsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ContactUs>> GetAllAsync()
        {
            return await _context.ContactUs.ToListAsync();
        }

        public async Task<ContactUs?> GetByIdAsync(long id)
        {
            return await _context.ContactUs.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ContactUs> SaveAsync(ContactUs contactUs)
        {
            if (contactUs.Id == 0)
            {
                _context.ContactUs.Add(contactUs);
            }
            else
            {
                _context.ContactUs.Update(contactUs);
            }
            
            await _context.SaveChangesAsync();
            return contactUs;
        }

        public async Task DeleteAsync(long id)
        {
            var contactUs = await _context.ContactUs.FindAsync(id);
            if (contactUs != null)
            {
                _context.ContactUs.Remove(contactUs);
                await _context.SaveChangesAsync();
            }
        }
    }
}
