using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly ApplicationDbContext _context;

        public MenuRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Menu> GetAll()
        {
            return _context.Menus
                .Include(m => m.Tiffin)
                .ToList();
        }

        public Menu? GetById(long id)
        {
            return _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefault(m => m.Id == id);
        }

        public void Add(Menu menu)
        {
            _context.Menus.Add(menu);
            _context.SaveChanges();
        }

        public void Update(Menu menu)
        {
            _context.Menus.Update(menu);
            _context.SaveChanges();
        }

        public void Delete(long id)
        {
            var menu = _context.Menus.Find(id);
            if (menu != null)
            {
                _context.Menus.Remove(menu);
                _context.SaveChanges();
            }
        }

        public async Task<IEnumerable<Menu>> GetAllAsync()
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .ToListAsync();
        }

        public async Task<Menu?> GetByIdAsync(long id)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Menu>> GetByTiffinIdAsync(long tiffinId)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .Where(m => m.TiffinId == tiffinId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Menu>> GetByTiffinIdAndIsActiveAsync(long tiffinId, bool isActive)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .Where(m => m.TiffinId == tiffinId && m.IsActive == isActive)
                .ToListAsync();
        }

        public async Task<Menu?> GetByTiffinIdAndDayOfWeekAsync(long tiffinId, string dayOfWeek)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefaultAsync(m => m.TiffinId == tiffinId && m.DayOfWeek == dayOfWeek);
        }

        public async Task<Menu?> GetByTiffinIdAndDayOfWeekAndIsActiveAsync(long tiffinId, string dayOfWeek, bool isActive)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefaultAsync(m => m.TiffinId == tiffinId && m.DayOfWeek == dayOfWeek && m.IsActive == isActive);
        }
    }
}
