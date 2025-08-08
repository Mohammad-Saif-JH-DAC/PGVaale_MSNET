using Microsoft.EntityFrameworkCore;
using PGVaaleDotNetBackend.Data;
using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public class ChatMessageRepository : IChatMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public ChatMessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChatMessage>> GetAllAsync()
        {
            return await _context.ChatMessages
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .ToListAsync();
        }

        public async Task<ChatMessage?> GetByIdAsync(long id)
        {
            return await _context.ChatMessages
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .FirstOrDefaultAsync(cm => cm.Id == id);
        }

        public async Task<List<ChatMessage>> GetByRegionOrderByTimestampAscAsync(string region)
        {
            return await _context.ChatMessages
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .Where(cm => cm.Region == region)
                .OrderBy(cm => cm.Timestamp)
                .ToListAsync();
        }

        public async Task<List<ChatMessage>> GetByReceiverIdAsync(long receiverId)
        {
            return await _context.ChatMessages
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .Where(cm => cm.ReceiverId == receiverId)
                .ToListAsync();
        }

        public async Task<List<ChatMessage>> GetBySenderIdAsync(long senderId)
        {
            return await _context.ChatMessages
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .Where(cm => cm.SenderId == senderId)
                .ToListAsync();
        }

        public async Task<ChatMessage> SaveAsync(ChatMessage chatMessage)
        {
            if (chatMessage.Id == 0)
            {
                _context.ChatMessages.Add(chatMessage);
            }
            else
            {
                _context.ChatMessages.Update(chatMessage);
            }
            
            await _context.SaveChangesAsync();
            return chatMessage;
        }

        public async Task DeleteAsync(long id)
        {
            var chatMessage = await _context.ChatMessages.FindAsync(id);
            if (chatMessage != null)
            {
                _context.ChatMessages.Remove(chatMessage);
                await _context.SaveChangesAsync();
            }
        }
    }
}
