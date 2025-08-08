using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IBookingRepository
    {
        Task<List<Booking>> GetAllAsync();
        Task<Booking?> GetByIdAsync(long id);
        Task<Booking?> GetFirstByUserIdAsync(long userId);
        Task<Booking> SaveAsync(Booking booking);
        Task DeleteAsync(long id);
    }
}
