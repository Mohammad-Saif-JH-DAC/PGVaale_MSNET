using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IContactUsRepository
    {
        Task<List<ContactUs>> GetAllAsync();
        Task<ContactUs?> GetByIdAsync(long id);
        Task<ContactUs> SaveAsync(ContactUs contactUs);
        Task DeleteAsync(long id);
    }
}
