using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class UserTiffinRepository : IUserTiffinRepository
    {
        private readonly ApplicationDbContext _context;

        public UserTiffinRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<UserTiffin> GetAll()
        {
            return _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .ToList();
        }

        public UserTiffin? GetById(long id)
        {
            return _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .FirstOrDefault(ut => ut.Id == id);
        }

        public void Add(UserTiffin userTiffin)
        {
            _context.UserTiffins.Add(userTiffin);
            _context.SaveChanges();
        }

        public void Update(UserTiffin userTiffin)
        {
            _context.UserTiffins.Update(userTiffin);
            _context.SaveChanges();
        }

        public void Delete(long id)
        {
            var userTiffin = _context.UserTiffins.Find(id);
            if (userTiffin != null)
            {
                _context.UserTiffins.Remove(userTiffin);
                _context.SaveChanges();
            }
        }

        public async Task<IEnumerable<UserTiffin>> GetAllAsync()
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .ToListAsync();
        }

        public async Task<UserTiffin?> GetByIdAsync(long id)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .FirstOrDefaultAsync(ut => ut.Id == id);
        }

        public async Task<IEnumerable<UserTiffin>> GetByUserIdAsync(long userId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.UserId == userId)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserTiffin>> GetByTiffinIdAsync(long tiffinId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.TiffinId == tiffinId)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<UserTiffin?> GetByUserIdAndTiffinIdAsync(long userId, long tiffinId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TiffinId == tiffinId);
        }

        public async Task<IEnumerable<UserTiffin>> GetByUserIdAndStatusAsync(long userId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.UserId == userId && ut.Status == status)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserTiffin>> GetByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.TiffinId == tiffinId && ut.Status == status)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<long> CountByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Where(ut => ut.TiffinId == tiffinId && ut.Status == status)
                .CountAsync();
        }
    }
}
