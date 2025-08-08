using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public FeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Feedback>> GetAllAsync()
        {
            return await _context.Feedback
                .Include(f => f.Maid)
                .Include(f => f.User)
                .ToListAsync();
        }

        public async Task<Feedback?> GetByIdAsync(long id)
        {
            return await _context.Feedback
                .Include(f => f.Maid)
                .Include(f => f.User)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<Feedback> SaveAsync(Feedback feedback)
        {
            if (feedback.Id == 0)
            {
                _context.Feedback.Add(feedback);
            }
            else
            {
                _context.Feedback.Update(feedback);
            }
            
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task DeleteAsync(long id)
        {
            var feedback = await _context.Feedback.FindAsync(id);
            if (feedback != null)
            {
                _context.Feedback.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<double?> AverageFeedbackRatingAsync()
        {
            return await _context.Feedback
                .AverageAsync(f => f.Rating);
        }

        public async Task<double?> FindAverageRatingByMaidIdAsync(long maidId)
        {
            return await _context.Feedback
                .Where(f => f.MaidId == maidId)
                .AverageAsync(f => f.Rating);
        }

        public async Task<List<Feedback>> FindByMaidIdAsync(long maidId)
        {
            return await _context.Feedback
                .Include(f => f.Maid)
                .Include(f => f.User)
                .Where(f => f.MaidId == maidId)
                .ToListAsync();
        }

        public async Task<List<Feedback>> FindByUserIdAsync(long userId)
        {
            return await _context.Feedback
                .Include(f => f.Maid)
                .Include(f => f.User)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<long> CountByUserIdAsync(long userId)
        {
            return await _context.Feedback
                .Where(f => f.UserId == userId)
                .CountAsync();
        }
    }
}
