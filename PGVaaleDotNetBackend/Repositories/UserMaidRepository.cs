using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class UserMaidRepository : IUserMaidRepository
    {
        private readonly ApplicationDbContext _context;

        public UserMaidRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserMaid>> GetAllAsync()
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .ToListAsync();
        }

        public async Task<UserMaid?> GetByIdAsync(long id)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .FirstOrDefaultAsync(um => um.Id == id);
        }

        public async Task<UserMaid> SaveAsync(UserMaid userMaid)
        {
            if (userMaid.Id == 0)
            {
                // user_maid table has auto_increment, so just add the entity
                _context.UserMaids.Add(userMaid);
            }
            else
            {
                _context.UserMaids.Update(userMaid);
            }
            
            await _context.SaveChangesAsync();
            return userMaid;
        }

        public async Task DeleteAsync(long id)
        {
            var userMaid = await _context.UserMaids.FindAsync(id);
            if (userMaid != null)
            {
                _context.UserMaids.Remove(userMaid);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<UserMaid>> FindByMaidIdAsync(long maidId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.MaidId == maidId)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.UserId == userId)
                .ToListAsync();
        }

        public async Task<long> CountByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .CountAsync(um => um.UserId == userId);
        }

        public async Task<List<UserMaid>> FindByMaidIdAndStatusAsync(long maidId, UserMaid.RequestStatus status)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.MaidId == maidId && um.Status == status && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindByUserIdAndStatusAsync(long userId, UserMaid.RequestStatus status)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.UserId == userId && um.Status == status && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindByUserIdAndMaidIdAndStatusAsync(long userId, long maidId, UserMaid.RequestStatus status)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.UserId == userId && um.MaidId == maidId && um.Status == status && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindActiveRequestsByMaidIdAsync(long maidId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.MaidId == maidId && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindActiveRequestsByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.UserId == userId && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<List<UserMaid>> FindAcceptedRequestsByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.UserId == userId && um.Status == UserMaid.RequestStatus.ACCEPTED && um.DeletionDateTime == null)
                .ToListAsync();
        }

        public async Task<long> CountByMaidIdAndStatusAsync(long maidId, UserMaid.RequestStatus status)
        {
            return await _context.UserMaids
                .CountAsync(um => um.MaidId == maidId && um.Status == status && um.DeletionDateTime == null);
        }

        public async Task<bool> ExistsActiveRequestByUserIdAndMaidIdAsync(long userId, long maidId)
        {
            return await _context.UserMaids
                .AnyAsync(um => um.UserId == userId && um.MaidId == maidId && um.DeletionDateTime == null);
        }

        public async Task<long> CountActiveRequestsByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .CountAsync(um => um.UserId == userId && um.DeletionDateTime == null);
        }

        public async Task<bool> ExistsActiveRequestByUserIdAsync(long userId)
        {
            return await _context.UserMaids
                .AnyAsync(um => um.UserId == userId && um.DeletionDateTime == null);
        }

        public async Task<List<UserMaid>> FindAllRequestsByMaidIdAsync(long maidId)
        {
            return await _context.UserMaids
                .Include(um => um.User)
                .Include(um => um.Maid)
                .Where(um => um.MaidId == maidId)
                .ToListAsync();
        }
    }
}
