using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class Feedback_TiffinRepository : IFeedback_TiffinRepository
    {
        private readonly ApplicationDbContext _context;

        public Feedback_TiffinRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Feedback_Tiffin> GetAll()
        {
            return _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .ToList();
        }

        public Feedback_Tiffin? GetById(long id)
        {
            return _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .FirstOrDefault(f => f.Id == id);
        }

        public void Add(Feedback_Tiffin feedback)
        {
            _context.Feedback_Tiffins.Add(feedback);
            _context.SaveChanges();
        }

        public void Update(Feedback_Tiffin feedback)
        {
            _context.Feedback_Tiffins.Update(feedback);
            _context.SaveChanges();
        }

        public void Delete(long id)
        {
            var feedback = _context.Feedback_Tiffins.Find(id);
            if (feedback != null)
            {
                _context.Feedback_Tiffins.Remove(feedback);
                _context.SaveChanges();
            }
        }

        public async Task<IEnumerable<Feedback_Tiffin>> GetAllAsync()
        {
            return await _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .ToListAsync();
        }

        public async Task<Feedback_Tiffin?> GetByIdAsync(long id)
        {
            return await _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<Feedback_Tiffin>> GetByUserIdAsync(long userId)
        {
            return await _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback_Tiffin>> GetByTiffinIdAsync(long tiffinId)
        {
            return await _context.Feedback_Tiffins
                .Include(f => f.User)
                .Include(f => f.Tiffin)
                .Where(f => f.TiffinId == tiffinId)
                .ToListAsync();
        }

        public async Task<double?> AverageFeedbackRatingAsync()
        {
            return await _context.Feedback_Tiffins
                .AverageAsync(f => f.Rating);
        }

        public async Task<long> CountFeedbackAsync()
        {
            return await _context.Feedback_Tiffins
                .CountAsync();
        }
    }
}
