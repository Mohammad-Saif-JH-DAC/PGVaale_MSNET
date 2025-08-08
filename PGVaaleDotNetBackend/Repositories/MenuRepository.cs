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

        public async Task<List<Menu>> GetAllAsync()
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

        public async Task<List<Menu>> FindByTiffinIdAndIsActiveTrueAsync(long tiffinId)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .Where(m => m.TiffinId == tiffinId && m.IsActive == true)
                .ToListAsync();
        }

        public async Task<List<Menu>> FindByTiffinIdAsync(long tiffinId)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .Where(m => m.TiffinId == tiffinId)
                .ToListAsync();
        }

        public async Task<Menu?> FindByTiffinIdAndDayOfWeekAndIsActiveTrueAsync(long tiffinId, string dayOfWeek)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefaultAsync(m => m.TiffinId == tiffinId && m.DayOfWeek == dayOfWeek && m.IsActive == true);
        }

        public async Task<Menu?> FindByTiffinIdAndMenuDateAndIsActiveTrueAsync(long tiffinId, DateTime menuDate)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .FirstOrDefaultAsync(m => m.TiffinId == tiffinId && m.MenuDate.Date == menuDate.Date && m.IsActive == true);
        }

        public async Task<List<Menu>> FindByTiffinIdAndDateRangeAsync(long tiffinId, DateTime startDate, DateTime endDate)
        {
            return await _context.Menus
                .Include(m => m.Tiffin)
                .Where(m => m.TiffinId == tiffinId && 
                           m.MenuDate.Date >= startDate.Date && 
                           m.MenuDate.Date <= endDate.Date && 
                           m.IsActive == true)
                .ToListAsync();
        }

        public async Task<Menu> SaveAsync(Menu menu)
        {
            if (menu.Id == 0)
            {
                _context.Menus.Add(menu);
            }
            else
            {
                _context.Menus.Update(menu);
            }
            
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task DeleteAsync(long id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu != null)
            {
                _context.Menus.Remove(menu);
                await _context.SaveChangesAsync();
            }
        }
    }
}
