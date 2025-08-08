using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Booking>> GetAllAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Pg)
                .ToListAsync();
        }

        public async Task<Booking?> GetByIdAsync(long id)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Pg)
                .FirstOrDefaultAsync(b => b.BookingId == id);
        }

        public async Task<Booking?> GetFirstByUserIdAsync(long userId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Pg)
                .FirstOrDefaultAsync(b => b.UserId == userId);
        }

        public async Task<Booking> SaveAsync(Booking booking)
        {
            if (booking.BookingId == 0)
            {
                _context.Bookings.Add(booking);
            }
            else
            {
                _context.Bookings.Update(booking);
            }
            
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task DeleteAsync(long id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking != null)
            {
                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
            }
        }
    }
}
