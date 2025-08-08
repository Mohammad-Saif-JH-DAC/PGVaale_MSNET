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

        public async Task<List<UserTiffin>> GetAllAsync()
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

        public async Task<List<UserTiffin>> FindByTiffinIdAsync(long tiffinId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.TiffinId == tiffinId)
                .ToListAsync();
        }

        public async Task<List<UserTiffin>> FindByUserIdAsync(long userId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<UserTiffin>> FindByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.TiffinId == tiffinId && ut.Status == status)
                .ToListAsync();
        }

        public async Task<List<UserTiffin>> FindByUserIdAndStatusAsync(long userId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.UserId == userId && ut.Status == status)
                .ToListAsync();
        }

        public async Task<UserTiffin?> FindByUserIdAndTiffinIdAsync(long userId, long tiffinId)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TiffinId == tiffinId);
        }

        public async Task<List<UserTiffin>> FindByTiffinIdAndStatusOrderByAssignedDateTimeDescAsync(long tiffinId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.TiffinId == tiffinId && ut.Status == status)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<List<UserTiffin>> FindByUserIdAndStatusOrderByAssignedDateTimeDescAsync(long userId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Include(ut => ut.User)
                .Include(ut => ut.Tiffin)
                .Where(ut => ut.UserId == userId && ut.Status == status)
                .OrderByDescending(ut => ut.AssignedDateTime)
                .ToListAsync();
        }

        public async Task<long> CountByTiffinIdAndStatusAsync(long tiffinId, UserTiffin.RequestStatus status)
        {
            return await _context.UserTiffins
                .Where(ut => ut.TiffinId == tiffinId && ut.Status == status)
                .CountAsync();
        }

        public async Task<UserTiffin> SaveAsync(UserTiffin userTiffin)
        {
            if (userTiffin.Id == 0)
            {
                _context.UserTiffins.Add(userTiffin);
            }
            else
            {
                _context.UserTiffins.Update(userTiffin);
            }
            
            await _context.SaveChangesAsync();
            return userTiffin;
        }

        public async Task DeleteAsync(long id)
        {
            var userTiffin = await _context.UserTiffins.FindAsync(id);
            if (userTiffin != null)
            {
                _context.UserTiffins.Remove(userTiffin);
                await _context.SaveChangesAsync();
            }
        }
    }
}
