using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class Feedback_WebRepository : IFeedback_WebRepository
    {
        private readonly ApplicationDbContext _context;

        public Feedback_WebRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Feedback_Web>> GetAllAsync()
        {
            return await _context.Feedback_Web.ToListAsync();
        }

        public async Task<Feedback_Web?> GetByIdAsync(long id)
        {
            return await _context.Feedback_Web.FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<Feedback_Web> SaveAsync(Feedback_Web feedback)
        {
            if (feedback.Id == 0)
            {
                _context.Feedback_Web.Add(feedback);
            }
            else
            {
                _context.Feedback_Web.Update(feedback);
            }
            
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task DeleteAsync(long id)
        {
            var feedback = await _context.Feedback_Web.FindAsync(id);
            if (feedback != null)
            {
                _context.Feedback_Web.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<double?> AverageFeedbackRatingAsync()
        {
            return await _context.Feedback_Web
                .AverageAsync(f => f.Rating);
        }

        public async Task<long> CountFeedbackAsync()
        {
            return await _context.Feedback_Web
                .CountAsync();
        }
    }
}
