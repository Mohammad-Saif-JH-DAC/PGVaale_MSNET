using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IChatMessageRepository
    {
        Task<List<ChatMessage>> GetAllAsync();
        Task<ChatMessage?> GetByIdAsync(long id);
        Task<List<ChatMessage>> GetByRegionOrderByTimestampAscAsync(string region);
        Task<List<ChatMessage>> GetByReceiverIdAsync(long receiverId);
        Task<List<ChatMessage>> GetBySenderIdAsync(long senderId);
        Task<ChatMessage> SaveAsync(ChatMessage chatMessage);
        Task DeleteAsync(long id);
    }
}
